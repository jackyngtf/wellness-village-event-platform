import "server-only";

import { demoTheGroundProviderEvents } from "@fixtures/demo/the-ground-provider";

import { parseTheGroundOrganizationId } from "../config";
import {
  normalizeDemoTheGroundEvent,
  normalizeVerifiedLiveTheGroundEvent,
} from "../normalize";
import {
  THE_GROUND_MAX_PAGE_SIZE,
  theGroundEventPageSchema,
} from "../schema";
import type {
  TheGroundCatalog,
  TheGroundCatalogResult,
  TheGroundConfig,
  TheGroundEvent,
} from "../types";

const THE_GROUND_PUBLIC_ORIGIN = "https://www.theground.io";
const THE_GROUND_CACHE_TTL_MS = 5 * 60 * 1_000;
const THE_GROUND_MAX_PAGES_PER_FEED = 20;
const THE_GROUND_REQUEST_TIMEOUT_MS = 8_000;
export const THE_GROUND_MAX_RESPONSE_BYTES = 2 * 1024 * 1024;

type TemporalFeed = "upcoming" | "past";

interface CatalogSnapshot {
  readonly key: string;
  readonly data: TheGroundCatalog;
  readonly fetchedAt: string;
}

export interface TheGroundSnapshotStore {
  read(key: string): Promise<CatalogSnapshot | null>;
  write(snapshot: CatalogSnapshot): Promise<void>;
}

export interface TheGroundAdapter {
  getCatalog(): Promise<TheGroundCatalogResult>;
}

export interface CreateTheGroundAdapterOptions {
  readonly config: TheGroundConfig;
  readonly fetchImplementation?: typeof fetch;
  readonly snapshotStore?: TheGroundSnapshotStore;
  readonly clock?: () => Date;
  readonly pageSize?: number;
}

export class TheGroundUnavailableError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "TheGroundUnavailableError";
  }
}

export function createInMemoryTheGroundSnapshotStore(): TheGroundSnapshotStore {
  const snapshots = new Map<string, CatalogSnapshot>();

  return {
    async read(key) {
      return snapshots.get(key) ?? null;
    },
    async write(snapshot) {
      snapshots.set(snapshot.key, snapshot);
    },
  };
}

function sortAndDeduplicateEvents(
  upcoming: readonly TheGroundEvent[],
  past: readonly TheGroundEvent[],
): readonly TheGroundEvent[] {
  const eventsById = new Map<string, TheGroundEvent>();
  for (const event of past) eventsById.set(event.eventId, event);
  for (const event of upcoming) eventsById.set(event.eventId, event);

  return [...eventsById.values()].sort(
    (left, right) =>
      Date.parse(left.startsAt) - Date.parse(right.startsAt) ||
      left.eventId.localeCompare(right.eventId),
  );
}

async function readBoundedJson(
  response: Response,
  controller: AbortController,
): Promise<unknown> {
  const declaredLength = response.headers.get("content-length");
  if (declaredLength !== null) {
    const declaredBytes = Number(declaredLength);
    if (
      !Number.isSafeInteger(declaredBytes) ||
      declaredBytes < 0 ||
      declaredBytes > THE_GROUND_MAX_RESPONSE_BYTES
    ) {
      controller.abort();
      throw new TheGroundUnavailableError(
        "The provider response exceeded the byte safety limit.",
      );
    }
  }

  if (!response.body) {
    throw new TheGroundUnavailableError(
      "The provider returned an empty response body.",
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let receivedBytes = 0;
  let body = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    receivedBytes += value.byteLength;
    if (receivedBytes > THE_GROUND_MAX_RESPONSE_BYTES) {
      controller.abort();
      throw new TheGroundUnavailableError(
        "The provider response exceeded the byte safety limit.",
      );
    }
    body += decoder.decode(value, { stream: true });
  }

  body += decoder.decode();
  return JSON.parse(body) as unknown;
}

function demoCatalog(): TheGroundCatalog {
  const payload = theGroundEventPageSchema.parse({
    data: demoTheGroundProviderEvents,
    meta: {
      page: 1,
      pageSize: THE_GROUND_MAX_PAGE_SIZE,
      total: demoTheGroundProviderEvents.length,
      pageCount: 1,
      hasNextPage: false,
      nextPage: null,
    },
  });

  return {
    events: payload.data
      .map(normalizeDemoTheGroundEvent)
      .sort(
        (left, right) =>
          Date.parse(left.startsAt) - Date.parse(right.startsAt) ||
          left.eventId.localeCompare(right.eventId),
      ),
  };
}

export function createTheGroundAdapter(
  options: CreateTheGroundAdapterOptions,
): TheGroundAdapter {
  const { config } = options;
  const fetchImplementation = options.fetchImplementation ?? fetch;
  const snapshotStore =
    options.snapshotStore ?? createInMemoryTheGroundSnapshotStore();
  const clock = options.clock ?? (() => new Date());
  const pageSize = options.pageSize ?? THE_GROUND_MAX_PAGE_SIZE;
  const validatedOrganizationId =
    config.mode === "live"
      ? parseTheGroundOrganizationId(config.organizationId)
      : null;

  if (
    !Number.isInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > THE_GROUND_MAX_PAGE_SIZE
  ) {
    throw new RangeError("The Ground page size must be between 1 and 50.");
  }
  async function requestPage(url: URL): Promise<unknown> {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      THE_GROUND_REQUEST_TIMEOUT_MS,
    );

    try {
      const response = await fetchImplementation(url, {
        method: "GET",
        headers: { accept: "application/json" },
        redirect: "manual",
        signal: controller.signal,
        cache: "no-store",
      });
      if (!response.ok) {
        throw new TheGroundUnavailableError(
          `The provider responded with HTTP ${response.status}.`,
        );
      }
      return await readBoundedJson(response, controller);
    } finally {
      clearTimeout(timeout);
    }
  }

  async function fetchFeed(
    organizationId: string,
    type: TemporalFeed,
  ): Promise<readonly TheGroundEvent[]> {
    const events: TheGroundEvent[] = [];
    let requestedPage = 1;
    let receivedRows = 0;
    let paginationContract: Readonly<{
      total: number;
      pageCount: number;
      pageSize: number;
    }> | null = null;

    while (requestedPage <= THE_GROUND_MAX_PAGES_PER_FEED) {
      const url = new URL(
        `/api/organizations/${encodeURIComponent(organizationId)}/events`,
        THE_GROUND_PUBLIC_ORIGIN,
      );
      url.searchParams.set("type", type);
      url.searchParams.set("page", String(requestedPage));
      url.searchParams.set("pageSize", String(pageSize));
      url.searchParams.set("order", "ASC");

      const payload = theGroundEventPageSchema.parse(await requestPage(url));
      if (payload.meta.page !== requestedPage) {
        throw new TheGroundUnavailableError(
          "The provider returned an unexpected pagination cursor.",
        );
      }

      const currentPaginationContract = {
        total: payload.meta.total,
        pageCount: payload.meta.pageCount,
        pageSize: payload.meta.pageSize,
      };
      if (!paginationContract) {
        paginationContract = currentPaginationContract;
      } else if (
        paginationContract.total !== currentPaginationContract.total ||
        paginationContract.pageCount !== currentPaginationContract.pageCount ||
        paginationContract.pageSize !== currentPaginationContract.pageSize
      ) {
        throw new TheGroundUnavailableError(
          "The provider changed pagination metadata within one feed.",
        );
      }

      if (
        payload.data.some(
          (event) => String(event.companyId) !== organizationId,
        )
      ) {
        throw new TheGroundUnavailableError(
          "The provider returned an event outside the requested organisation.",
        );
      }

      receivedRows += payload.data.length;
      if (receivedRows > payload.meta.total) {
        throw new TheGroundUnavailableError(
          "The provider returned more rows than the declared feed total.",
        );
      }

      events.push(
        ...payload.data.map((event) =>
          normalizeVerifiedLiveTheGroundEvent(event, organizationId),
        ),
      );
      if (!payload.meta.hasNextPage) {
        if (receivedRows !== payload.meta.total) {
          throw new TheGroundUnavailableError(
            "The provider feed ended before its declared total was complete.",
          );
        }
        return events;
      }
      requestedPage = payload.meta.nextPage ?? requestedPage + 1;
    }

    throw new TheGroundUnavailableError(
      "The provider exceeded the 20-page safety limit for one feed.",
    );
  }

  async function readSnapshot(key: string): Promise<CatalogSnapshot | null> {
    try {
      return await snapshotStore.read(key);
    } catch {
      return null;
    }
  }

  async function writeSnapshot(snapshot: CatalogSnapshot): Promise<void> {
    try {
      await snapshotStore.write(snapshot);
    } catch {
      // A store outage must not discard a valid provider response.
    }
  }

  return {
    async getCatalog() {
      const requestedAt = clock();
      if (config.mode === "demo") {
        return {
          mode: "demo",
          freshness: "demo",
          fetchedAt: requestedAt.toISOString(),
          data: demoCatalog(),
        };
      }

      const organizationId = validatedOrganizationId;
      if (!organizationId) {
        throw new TheGroundUnavailableError(
          "Live mode is unavailable without an organisation identifier.",
        );
      }

      const snapshotKey = `catalog:${organizationId}`;
      const previous = await readSnapshot(snapshotKey);
      if (
        previous &&
        requestedAt.getTime() - Date.parse(previous.fetchedAt) <
          THE_GROUND_CACHE_TTL_MS
      ) {
        return {
          mode: "live",
          freshness: "fresh",
          fetchedAt: previous.fetchedAt,
          data: previous.data,
        };
      }

      try {
        const [upcoming, past] = await Promise.all([
          fetchFeed(organizationId, "upcoming"),
          fetchFeed(organizationId, "past"),
        ]);
        const snapshot: CatalogSnapshot = {
          key: snapshotKey,
          fetchedAt: requestedAt.toISOString(),
          data: { events: sortAndDeduplicateEvents(upcoming, past) },
        };
        await writeSnapshot(snapshot);
        return {
          mode: "live",
          freshness: "fresh",
          fetchedAt: snapshot.fetchedAt,
          data: snapshot.data,
        };
      } catch (error) {
        if (previous) {
          return {
            mode: "live",
            freshness: "stale",
            fetchedAt: previous.fetchedAt,
            data: previous.data,
          };
        }

        throw new TheGroundUnavailableError(
          "The live programme is unavailable and no warm snapshot exists.",
          { cause: error },
        );
      }
    },
  };
}
