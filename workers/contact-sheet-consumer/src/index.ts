import { getUpstreamErrorMetadata } from "./errors";
import { getGoogleAccessToken } from "./google-auth";
import {
  appendRows,
  readSubmissionIds,
  type AppendRowsInput,
  type ReadSubmissionIdsInput,
} from "./google-sheets";
import {
  parseContactSubmission,
  submissionToRow,
  type ContactSubmission,
} from "./submission";

type LogEntry = Readonly<{
  event: string;
  message_count: number;
  appended_count?: number;
  deduplicated_count?: number;
  upstream_status?: number;
  reason?: "invalid_payload";
}>;

type SafeLogger = Readonly<{
  info(entry: LogEntry): void;
  warn(entry: LogEntry): void;
  error(entry: LogEntry): void;
}>;

const consoleLogger: SafeLogger = {
  info: (entry) => console.info(entry),
  warn: (entry) => console.warn(entry),
  error: (entry) => console.error(entry),
};

type QueueHandlerDependencies = Readonly<{
  fetch?: typeof fetch;
  crypto?: Crypto;
  logger?: SafeLogger;
  acquireAuthorization?: typeof getGoogleAccessToken;
  appendRows?: (
    input: AppendRowsInput,
    fetchApi?: typeof fetch,
  ) => Promise<void>;
  readSubmissionIds?: (
    input: ReadSubmissionIdsInput,
    fetchApi?: typeof fetch,
  ) => Promise<ReadonlySet<string>>;
}>;

function requireSecret(value: string): string {
  if (value.trim().length === 0) {
    throw new Error("required consumer configuration is missing");
  }
  return value;
}

function retryMessages(
  messages: readonly Message<unknown>[],
  retryAfterSeconds?: number,
): void {
  for (const message of messages) {
    if (retryAfterSeconds === undefined) message.retry();
    else message.retry({ delaySeconds: retryAfterSeconds });
  }
}

export function createQueueHandler(
  dependencies: QueueHandlerDependencies = {},
): NonNullable<ExportedHandler<GeneratedEnv, unknown>["queue"]> {
  const fetchApi = dependencies.fetch ?? globalThis.fetch;
  const cryptoApi = dependencies.crypto ?? crypto;
  const logger = dependencies.logger ?? consoleLogger;
  const acquireAuthorization =
    dependencies.acquireAuthorization ?? getGoogleAccessToken;
  const append = dependencies.appendRows ?? appendRows;
  const readIds = dependencies.readSubmissionIds ?? readSubmissionIds;

  return async function queue(
    batch: MessageBatch<unknown>,
    env: GeneratedEnv,
  ): Promise<void> {
    const validMessages: Array<{
      message: Message<unknown>;
      submission: ContactSubmission;
    }> = [];

    for (const message of batch.messages) {
      try {
        validMessages.push({
          message,
          submission: parseContactSubmission(message.body),
        });
      } catch {
        message.retry();
        logger.warn({
          event: "contact_sheet_message_quarantined",
          message_count: 1,
          reason: "invalid_payload",
        });
      }
    }
    if (validMessages.length === 0) return;

    let authorizationCredential: string;
    let spreadsheetId: string;
    let range: string;
    let existingIds: ReadonlySet<string>;
    try {
      authorizationCredential = await acquireAuthorization(
        requireSecret(env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_JSON),
        { fetch: fetchApi, crypto: cryptoApi },
      );
      spreadsheetId = requireSecret(env.GOOGLE_SHEET_ID);
      range = requireSecret(env.GOOGLE_SHEET_RANGE);
      existingIds = await readIds(
        { authorizationCredential, spreadsheetId, range },
        fetchApi,
      );
    } catch (error) {
      const metadata = getUpstreamErrorMetadata(error);
      retryMessages(
        validMessages.map(({ message }) => message),
        metadata.retryAfterSeconds,
      );
      logger.error({
        event: "contact_sheet_batch_retry",
        message_count: validMessages.length,
        ...(metadata.status === undefined
          ? {}
          : { upstream_status: metadata.status }),
      });
      return;
    }

    const groups = new Map<
      string,
      { submission: ContactSubmission; messages: Message<unknown>[] }
    >();
    for (const { message, submission } of validMessages) {
      const current = groups.get(submission.submission_id);
      if (current) current.messages.push(message);
      else {
        groups.set(submission.submission_id, {
          submission,
          messages: [message],
        });
      }
    }

    const unseenGroups: Array<{
      submission: ContactSubmission;
      messages: Message<unknown>[];
    }> = [];
    let deduplicatedCount = 0;
    for (const [submissionId, group] of groups) {
      if (existingIds.has(submissionId)) {
        for (const message of group.messages) message.ack();
        deduplicatedCount += group.messages.length;
      } else {
        unseenGroups.push(group);
        deduplicatedCount += Math.max(0, group.messages.length - 1);
      }
    }

    if (unseenGroups.length === 0) {
      logger.info({
        event: "contact_sheet_batch_deduplicated",
        message_count: validMessages.length,
        deduplicated_count: deduplicatedCount,
      });
      return;
    }

    try {
      await append(
        {
          authorizationCredential,
          spreadsheetId,
          range,
          rows: unseenGroups.map(({ submission }) =>
            submissionToRow(submission),
          ),
        },
        fetchApi,
      );
    } catch (error) {
      const metadata = getUpstreamErrorMetadata(error);
      const unconfirmed = unseenGroups.flatMap(({ messages }) => messages);
      retryMessages(unconfirmed, metadata.retryAfterSeconds);
      logger.error({
        event: "contact_sheet_batch_retry",
        message_count: unconfirmed.length,
        ...(metadata.status === undefined
          ? {}
          : { upstream_status: metadata.status }),
      });
      return;
    }

    for (const { messages } of unseenGroups) {
      for (const message of messages) message.ack();
    }
    logger.info({
      event: "contact_sheet_batch_appended",
      message_count: validMessages.length,
      appended_count: unseenGroups.length,
      deduplicated_count: deduplicatedCount,
    });
  };
}

const queue = createQueueHandler();

export default {
  queue,
} satisfies ExportedHandler<GeneratedEnv, unknown>;
