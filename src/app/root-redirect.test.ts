import {
  getRedirectUrl,
  unstable_getResponseFromNextConfig,
} from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";

describe("the unlocalised root route", () => {
  it("redirects / to the English default route", async () => {
    const response = await unstable_getResponseFromNextConfig({
      url: "https://reference.example.com/",
      nextConfig,
    });

    expect(response.status).toBe(307);
    expect(getRedirectUrl(response)).toBe("https://reference.example.com/en");
  });
});
