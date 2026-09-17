import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@fixtures": fileURLToPath(new URL("./fixtures", import.meta.url)),
      "server-only": fileURLToPath(
        new URL("./src/test/server-only.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    include: [
      "tests/**/*.test.ts",
      "src/**/*.test.{ts,tsx}",
      "fixtures/**/*.test.ts",
      "workers/contact-sheet-consumer/wrangler-config.test.ts",
    ],
  },
});
