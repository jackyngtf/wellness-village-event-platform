# Private contact-to-Sheets consumer reference

This standalone Cloudflare Worker demonstrates the private half of a bounded contact-interest workflow. For a genuine non-honeypot submission, the website producer returns `202 Accepted` only after awaited Cloudflare Queue acceptance; a honeypot decoy deliberately receives the same `202` without enqueueing. This consumer later validates an enqueued exact 14-field message, obtains a least-scope Google OAuth token, reads column A for stable submission IDs and appends unseen rows to `A:N` with `valueInputOption=RAW`.

It avoids introducing a general-purpose application database for this deliberately small workflow; it does not remove persistence. Cloudflare Queue provides durable asynchronous transport, and Google Sheets remains the operational destination owned by the client.

## Trust boundary

Only this Worker may receive these secrets:

```text
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_JSON
GOOGLE_SHEET_ID=replace-with-approved-sheet-id
GOOGLE_SHEET_RANGE=Contacts!A:N
```

No credential JSON example is included. Store each value with Cloudflare's secret mechanism; never place it in browser code, website-producer variables, logs, fixtures or committed environment files.

The service account should be granted access only to the approved destination Sheet. OAuth requests use the single `https://www.googleapis.com/auth/spreadsheets` scope.

## Delivery semantics

Cloudflare Queues deliver at least once. The consumer:

1. rejects messages outside the exact 14-field contract;
2. retries invalid messages so Wrangler's configured `max_retries` can move them to the dead-letter Queue;
3. collapses duplicate IDs inside one batch;
4. acknowledges IDs already present in Sheet column A;
5. appends only unseen `A:N` rows with `RAW` values; and
6. acknowledges those messages only after the append response succeeds.

If an append commits but the response times out, the message is retried. The next attempt reads column A, sees the stable ID and acknowledges without another append. This is idempotent convergence for ordinary retries, not a distributed exactly-once guarantee.

`max_concurrency` is intentionally `1`. Cloudflare normally recommends leaving concurrency open for autoscaling, but this design uses serial read-before-append convergence against one Sheet. Multiple concurrent consumers could race between the ID read and append. Higher-throughput workloads should use a destination with transactional uniqueness rather than copy this exception.

## Local verification

All tests use synthetic values and local fetch doubles. They never call Google, Cloudflare, Turnstile or a real Sheet.

```sh
npm run contact-consumer:typegen
npm run contact-consumer:typegen:check
npm run contact-consumer:test
npm run contact-consumer:typecheck
npm run contact-consumer:dry-run
```

The dry run bundles locally and does not deploy. Logs are structured and limited to event names, counts and upstream status; they exclude message bodies, IDs, names, contact details, tokens, Sheet identifiers, credential material and raw errors.

## Limits

- Sheet retention, withdrawal, access review, dead-letter recovery and monitoring remain operational responsibilities.
- Read-before-append is not a transaction and is suitable only for this bounded single-writer shape.
- The public portfolio keeps website collection disabled by default and contains no live resource identifiers or credentials.
