import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const workerRoot = path.resolve("workers/contact-sheet-consumer");

describe("contact consumer configuration", () => {
  it("keeps neutral, bounded, single-writer Queue and DLQ settings", async () => {
    const config = JSON.parse(
      await readFile(path.join(workerRoot, "wrangler.jsonc"), "utf8"),
    ) as Record<string, unknown>;

    expect(config).not.toHaveProperty("account_id");
    expect(config).toMatchObject({
      name: "portfolio-demo-contact-sheet-consumer",
      main: "src/index.ts",
      workers_dev: false,
      compatibility_date: "2026-09-18",
      compatibility_flags: ["nodejs_compat"],
      observability: { enabled: true },
      secrets: {
        required: [
          "GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_JSON",
          "GOOGLE_SHEET_ID",
          "GOOGLE_SHEET_RANGE",
        ],
      },
      queues: {
        consumers: [
          {
            queue: "portfolio-demo-contact-submissions",
            max_batch_size: 25,
            max_batch_timeout: 10,
            max_retries: 5,
            dead_letter_queue: "portfolio-demo-contact-submissions-dlq",
            max_concurrency: 1,
            retry_delay: 60,
          },
        ],
      },
    });
    expect(config).not.toHaveProperty("queues.producers");
  });

  it("keeps generated binding types and the executable handler in parity", async () => {
    const [types, source] = await Promise.all([
      readFile(path.join(workerRoot, "worker-configuration.d.ts"), "utf8"),
      readFile(path.join(workerRoot, "src/index.ts"), "utf8"),
    ]);

    expect(types).toContain("interface GeneratedEnv");
    expect(types).toContain("GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_JSON: string");
    expect(types).toContain("GOOGLE_SHEET_ID: string");
    expect(types).toContain("GOOGLE_SHEET_RANGE: string");
    expect(source).toContain(
      "satisfies ExportedHandler<GeneratedEnv, unknown>",
    );
  });

  it("uses the current Workers Vitest plugin and not the deprecated pool package", async () => {
    const packageJson = JSON.parse(
      await readFile(path.resolve("package.json"), "utf8"),
    ) as {
      devDependencies?: Record<string, string>;
      scripts?: Record<string, string>;
    };
    expect(packageJson.devDependencies).toHaveProperty(
      "@cloudflare/vitest-plugin",
    );
    expect(packageJson.devDependencies).not.toHaveProperty(
      "@cloudflare/vitest-pool-workers",
    );
    expect(packageJson.scripts).toHaveProperty("contact-consumer:typegen");
    expect(packageJson.scripts).toHaveProperty("contact-consumer:dry-run");
  });
});
