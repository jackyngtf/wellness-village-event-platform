import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import type { TheGroundConfig } from "../types";
import { TheGroundConfigurationError } from "../config";
import {
  createInMemoryTheGroundSnapshotStore,
  createTheGroundAdapter,
  THE_GROUND_MAX_RESPONSE_BYTES,
  TheGroundUnavailableError,
} from "./adapter";

const liveConfig: TheGroundConfig = {
  mode: "live",
  organizationId: "424242",
};

function providerEvent(
  id: string,
  startDate = "2030-06-01T02:00:00.000Z",
  endDate = "2030-06-01T03:00:00.000Z",
  companyId = 424242,
) {
  return {
    id,
    companyId,
    name: id
      .split("-")
      .map((word) => word[0]?.toUpperCase() + word.slice(1))
      .join(" "),
    startDate,
    endDate,
    location: "Garden Room",
    capacity: 20,
    joinedCount: 2,
    shouldPublicRSVP: true,
    price: "0",
    paymentDetails: null,
    imageSrc: null,
    hasPayment: false,
    joinDeadline: null,
    isJoinOpen: true,
    providerContact: "private@example.com",
  };
}

function page(
  data: readonly ReturnType<typeof providerEvent>[],
  meta: Partial<{
    page: number;
    pageSize: number;
    total: number;
    pageCount: number;
    hasNextPage: boolean;
    nextPage: number | null;
  }> = {},
) {
  return {
    data,
    meta: {
      page: 1,
      pageSize: 50,
      total: data.length,
      pageCount: data.length ? 1 : 0,
      hasNextPage: false,
      nextPage: null,
      ...meta,
    },
  };
}

function jsonResponse(body: unknown, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json", ...headers },
  });
}

describe("The Ground public server adapter", () => {
  beforeEach(() => vi.useRealTimers());
  afterEach(() => vi.restoreAllMocks());

  it("returns synthetic demo records without touching the network", async () => {
    const fetchImplementation = vi.fn<typeof fetch>();
    const adapter = createTheGroundAdapter({
      config: { mode: "demo", organizationId: null },
      fetchImplementation,
      clock: () => new Date("2030-05-20T00:00:00.000Z"),
    });

    const result = await adapter.getCatalog();

    expect(result.mode).toBe("demo");
    expect(result.freshness).toBe("demo");
    expect(result.data.events.length).toBeGreaterThan(3);
    expect(
      result.data.events.every(
        ({ registrationUrl }) =>
          new URL(registrationUrl).hostname === "bookings.example.com",
      ),
    ).toBe(true);
    expect(JSON.stringify(result)).not.toMatch(/companyId|theground\.io/);
    expect(fetchImplementation).not.toHaveBeenCalled();
  });

  it.each(["", "0", "-1", "12.5", "not-a-number", "1234567890123"])(
    "revalidates malformed direct live organisation identifier %j",
    (organizationId) => {
      expect(() =>
        createTheGroundAdapter({
          config: { mode: "live", organizationId },
          fetchImplementation: vi.fn<typeof fetch>(),
        }),
      ).toThrow(TheGroundConfigurationError);
    },
  );

  it("starts upcoming and past feed requests in parallel", async () => {
    const pending: Array<{
      type: string | null;
      resolve: (response: Response) => void;
    }> = [];
    const fetchImplementation = vi.fn<typeof fetch>(async (input) => {
      const type = new URL(String(input)).searchParams.get("type");
      return await new Promise<Response>((resolve) => {
        pending.push({ type, resolve });
      });
    });
    const adapter = createTheGroundAdapter({
      config: liveConfig,
      fetchImplementation,
    });

    const request = adapter.getCatalog();
    await vi.waitFor(() => expect(pending).toHaveLength(2));
    expect(new Set(pending.map(({ type }) => type))).toEqual(
      new Set(["upcoming", "past"]),
    );
    for (const entry of pending) entry.resolve(jsonResponse(page([])));

    await expect(request).resolves.toMatchObject({
      mode: "live",
      freshness: "fresh",
    });
  });

  it("paginates within bounds, validates the organisation scope, deduplicates and sorts", async () => {
    const responses = new Map([
      [
        "upcoming:1",
        page([providerEvent("later", "2030-06-03T02:00:00Z", "2030-06-03T03:00:00Z")], {
          pageSize: 1,
          total: 2,
          pageCount: 2,
          hasNextPage: true,
          nextPage: 2,
        }),
      ],
      [
        "upcoming:2",
        page([providerEvent("shared", "2030-06-02T02:00:00Z", "2030-06-02T03:00:00Z")], {
          page: 2,
          pageSize: 1,
          total: 2,
          pageCount: 2,
        }),
      ],
      [
        "past:1",
        page([
          providerEvent("earlier", "2030-05-30T02:00:00Z", "2030-05-30T03:00:00Z"),
          providerEvent("shared", "2030-06-02T02:00:00Z", "2030-06-02T03:00:00Z"),
        ]),
      ],
    ]);
    const fetchImplementation = vi.fn<typeof fetch>(async (input, init) => {
      const url = new URL(String(input));
      expect(url.pathname).toBe("/api/organizations/424242/events");
      expect(Number(url.searchParams.get("pageSize"))).toBeLessThanOrEqual(50);
      expect(init).toMatchObject({ method: "GET", redirect: "manual" });
      const key = `${url.searchParams.get("type")}:${url.searchParams.get("page")}`;
      return jsonResponse(responses.get(key));
    });
    const adapter = createTheGroundAdapter({
      config: liveConfig,
      fetchImplementation,
      pageSize: 1,
      clock: () => new Date("2030-05-20T00:00:00.000Z"),
    });

    const result = await adapter.getCatalog();

    expect(result.data.events.map(({ eventId }) => eventId)).toEqual([
      "earlier",
      "shared",
      "later",
    ]);
    expect(fetchImplementation).toHaveBeenCalledTimes(3);
    expect(JSON.stringify(result)).not.toContain("private@example.com");
    expect(JSON.stringify(result)).not.toMatch(/companyId|424242/);
    expect(
      result.data.events.every(
        ({ registrationUrl }) =>
          new URL(registrationUrl).hostname === "www.theground.io",
      ),
    ).toBe(true);
  });

  it("rejects an event outside the requested organisation before public normalisation", async () => {
    const adapter = createTheGroundAdapter({
      config: liveConfig,
      fetchImplementation: vi.fn<typeof fetch>(async (input) => {
        const type = new URL(String(input)).searchParams.get("type");
        return jsonResponse(
          page(
            type === "upcoming"
              ? [providerEvent("wrong-scope", undefined, undefined, 434343)]
              : [],
          ),
        );
      }),
    });

    await expect(adapter.getCatalog()).rejects.toBeInstanceOf(
      TheGroundUnavailableError,
    );
  });

  it("rejects malformed pagination continuation", async () => {
    const adapter = createTheGroundAdapter({
      config: liveConfig,
      fetchImplementation: vi.fn<typeof fetch>(async () =>
        jsonResponse(
          page([providerEvent("cursor-demo")], {
            pageSize: 1,
            total: 2,
            pageCount: 2,
            hasNextPage: true,
            nextPage: 9,
          }),
        ),
      ),
    });

    await expect(adapter.getCatalog()).rejects.toBeInstanceOf(
      TheGroundUnavailableError,
    );
  });

  it("rejects a row when total is zero but pageCount claims a page", async () => {
    const adapter = createTheGroundAdapter({
      config: liveConfig,
      fetchImplementation: vi.fn<typeof fetch>(async () =>
        jsonResponse(
          page([providerEvent("impossible-total")], {
            total: 0,
            pageCount: 1,
          }),
        ),
      ),
    });

    await expect(adapter.getCatalog()).rejects.toBeInstanceOf(
      TheGroundUnavailableError,
    );
  });

  it.each([
    {
      label: "total and pageCount",
      first: { pageSize: 1, total: 2, pageCount: 2 },
      second: {
        page: 2,
        pageSize: 1,
        total: 3,
        pageCount: 3,
        hasNextPage: true,
        nextPage: 3,
      },
    },
    {
      label: "pageSize",
      first: { pageSize: 2, total: 4, pageCount: 2 },
      second: {
        page: 2,
        pageSize: 3,
        total: 4,
        pageCount: 2,
        hasNextPage: false,
        nextPage: null,
      },
    },
  ])("rejects changed $label metadata on a later page", async ({ first, second }) => {
    const fetchImplementation = vi.fn<typeof fetch>(async (input) => {
      const url = new URL(String(input));
      if (url.searchParams.get("type") === "past") {
        return jsonResponse(page([]));
      }
      const requestedPage = Number(url.searchParams.get("page"));
      if (requestedPage === 1) {
        const count = first.pageSize;
        return jsonResponse(
          page(
            Array.from({ length: count }, (_, index) =>
              providerEvent(`first-${index}`),
            ),
            { ...first, hasNextPage: true, nextPage: 2 },
          ),
        );
      }
      if (requestedPage === 3) {
        return jsonResponse(
          page([providerEvent("third-0")], {
            page: 3,
            pageSize: 1,
            total: 3,
            pageCount: 3,
          }),
        );
      }
      const finalCount = second.total - second.pageSize * (second.pageCount - 1);
      return jsonResponse(
        page(
          Array.from({ length: finalCount }, (_, index) =>
            providerEvent(`second-${index}`),
          ),
          second,
        ),
      );
    });
    const adapter = createTheGroundAdapter({
      config: liveConfig,
      fetchImplementation,
      pageSize: first.pageSize,
    });

    await expect(adapter.getCatalog()).rejects.toBeInstanceOf(
      TheGroundUnavailableError,
    );
  });

  it.each([
    {
      label: "incomplete",
      events: [providerEvent("only-one")],
      meta: { page: 2, pageSize: 2, total: 4, pageCount: 2 },
    },
    {
      label: "excess",
      events: [providerEvent("one"), providerEvent("two")],
      meta: { page: 2, pageSize: 2, total: 3, pageCount: 2 },
    },
  ])("rejects an $label final page", async ({ events, meta }) => {
    const fetchImplementation = vi.fn<typeof fetch>(async (input) => {
      const url = new URL(String(input));
      if (url.searchParams.get("type") === "past") {
        return jsonResponse(page([]));
      }
      if (url.searchParams.get("page") === "1") {
        return jsonResponse(
          page([providerEvent("first"), providerEvent("second")], {
            pageSize: 2,
            total: meta.total,
            pageCount: 2,
            hasNextPage: true,
            nextPage: 2,
          }),
        );
      }
      return jsonResponse(page(events, meta));
    });
    const adapter = createTheGroundAdapter({
      config: liveConfig,
      fetchImplementation,
      pageSize: 2,
    });

    await expect(adapter.getCatalog()).rejects.toBeInstanceOf(
      TheGroundUnavailableError,
    );
  });

  it("keeps upcoming and past pagination totals independent", async () => {
    const fetchImplementation = vi.fn<typeof fetch>(async (input) => {
      const type = new URL(String(input)).searchParams.get("type");
      return jsonResponse(
        type === "upcoming"
          ? page([providerEvent("future")])
          : page([
              providerEvent(
                "past-one",
                "2030-05-30T02:00:00Z",
                "2030-05-30T03:00:00Z",
              ),
              providerEvent(
                "past-two",
                "2030-05-31T02:00:00Z",
                "2030-05-31T03:00:00Z",
              ),
            ]),
      );
    });
    const adapter = createTheGroundAdapter({
      config: liveConfig,
      fetchImplementation,
    });

    await expect(adapter.getCatalog()).resolves.toMatchObject({
      data: { events: [{ eventId: "past-one" }, { eventId: "past-two" }, { eventId: "future" }] },
    });
  });

  it("stops each feed at the 20-page ceiling", async () => {
    let highestUpcomingPage = 0;
    const fetchImplementation = vi.fn<typeof fetch>(async (input) => {
      const url = new URL(String(input));
      const type = url.searchParams.get("type");
      const requestedPage = Number(url.searchParams.get("page"));
      if (type === "past") return jsonResponse(page([]));

      highestUpcomingPage = Math.max(highestUpcomingPage, requestedPage);
      return jsonResponse(
        page([providerEvent(`demo-page-${requestedPage}`)], {
          page: requestedPage,
          pageSize: 1,
          total: 21,
          pageCount: 21,
          hasNextPage: true,
          nextPage: requestedPage + 1,
        }),
      );
    });
    const adapter = createTheGroundAdapter({
      config: liveConfig,
      fetchImplementation,
      pageSize: 1,
    });

    await expect(adapter.getCatalog()).rejects.toBeInstanceOf(
      TheGroundUnavailableError,
    );
    expect(highestUpcomingPage).toBe(20);
    expect(fetchImplementation).toHaveBeenCalledTimes(21);
  });

  it("aborts a provider request after the eight-second contract", async () => {
    vi.useFakeTimers();
    const fetchImplementation = vi.fn<typeof fetch>(async (_input, init) =>
      await new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () =>
          reject(new DOMException("aborted", "AbortError")),
        );
      }),
    );
    const adapter = createTheGroundAdapter({
      config: liveConfig,
      fetchImplementation,
    });
    const request = adapter.getCatalog();
    const rejection = expect(request).rejects.toBeInstanceOf(
      TheGroundUnavailableError,
    );

    await vi.advanceTimersByTimeAsync(8_000);

    await rejection;
    expect(fetchImplementation).toHaveBeenCalledTimes(2);
  });

  it("rejects oversized declared and streamed responses", async () => {
    const declaredAdapter = createTheGroundAdapter({
      config: liveConfig,
      fetchImplementation: vi.fn<typeof fetch>(async () =>
        jsonResponse(page([]), {
          "content-length": String(THE_GROUND_MAX_RESPONSE_BYTES + 1),
        }),
      ),
    });
    await expect(declaredAdapter.getCatalog()).rejects.toBeInstanceOf(
      TheGroundUnavailableError,
    );

    const oversized = new Uint8Array(THE_GROUND_MAX_RESPONSE_BYTES + 1);
    const streamedAdapter = createTheGroundAdapter({
      config: liveConfig,
      fetchImplementation: vi.fn<typeof fetch>(async () =>
        new Response(
          new ReadableStream<Uint8Array>({
            start(controller) {
              controller.enqueue(oversized);
              controller.close();
            },
          }),
          { status: 200 },
        ),
      ),
    });
    await expect(streamedAdapter.getCatalog()).rejects.toBeInstanceOf(
      TheGroundUnavailableError,
    );
  });

  it("serves a five-minute fresh cache and only a last-valid stale snapshot on failure", async () => {
    let now = Date.parse("2030-05-20T00:00:00.000Z");
    let providerIsAvailable = true;
    const fetchImplementation = vi.fn<typeof fetch>(async (input) => {
      if (!providerIsAvailable) throw new Error("provider unavailable");
      const type = new URL(String(input)).searchParams.get("type");
      return jsonResponse(
        page(
          type === "upcoming"
            ? [providerEvent("warm-demo")]
            : [],
        ),
      );
    });
    const adapter = createTheGroundAdapter({
      config: liveConfig,
      fetchImplementation,
      snapshotStore: createInMemoryTheGroundSnapshotStore(),
      clock: () => new Date(now),
    });

    const first = await adapter.getCatalog();
    const cached = await adapter.getCatalog();
    expect(first.freshness).toBe("fresh");
    expect(cached).toEqual(first);
    expect(fetchImplementation).toHaveBeenCalledTimes(2);

    now += 5 * 60 * 1_000 + 1;
    providerIsAvailable = false;
    const stale = await adapter.getCatalog();
    expect(stale).toEqual({ ...first, freshness: "stale" });
    expect(fetchImplementation).toHaveBeenCalledTimes(4);
  });

  it("reports honest unavailability on a cold live failure and never substitutes demo data", async () => {
    const adapter = createTheGroundAdapter({
      config: liveConfig,
      fetchImplementation: vi.fn<typeof fetch>(async () => {
        throw new Error("provider unavailable");
      }),
      snapshotStore: createInMemoryTheGroundSnapshotStore(),
    });

    await expect(adapter.getCatalog()).rejects.toMatchObject({
      name: "TheGroundUnavailableError",
    });
  });
});
