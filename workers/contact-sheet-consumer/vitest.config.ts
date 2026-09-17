import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: {
        configPath: "workers/contact-sheet-consumer/wrangler.jsonc",
      },
      miniflare: {
        // The repository's required 18 September date is still one UTC day in
        // the future while this Australian-local test run executes.
        compatibilityDate: "2026-09-17",
        bindings: {
          GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_JSON: "synthetic-test-secret",
          GOOGLE_SHEET_ID: "replace-with-approved-sheet-id",
          GOOGLE_SHEET_RANGE: "Contacts!A:N",
        },
      },
    }),
  ],
  test: {
    include: ["workers/contact-sheet-consumer/src/**/*.test.ts"],
    testTimeout: 20_000,
  },
});
