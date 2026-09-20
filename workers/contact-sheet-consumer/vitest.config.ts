import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: {
        configPath: "workers/contact-sheet-consumer/wrangler.jsonc",
      },
      miniflare: {
        // Match the bundled workerd test runtime (2026-09-17). The deployment
        // config's 2026-09-18 date is checked separately by the config tests.
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
