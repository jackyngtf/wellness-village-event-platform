import { describe, expect, it } from "vitest";

import {
  TheGroundConfigurationError,
  resolveTheGroundConfig,
} from "./config";

describe("The Ground public configuration", () => {
  it("uses the local synthetic catalogue unless live mode is explicitly enabled", () => {
    expect(resolveTheGroundConfig({})).toEqual({
      mode: "demo",
      organizationId: null,
    });
    expect(
      resolveTheGroundConfig({ THE_GROUND_ORGANIZATION_ID: "424242" }),
    ).toEqual({ mode: "demo", organizationId: null });
  });

  it("requires a bounded positive numeric identifier after explicit live opt-in", () => {
    for (const organizationId of [
      undefined,
      "",
      "0",
      "-4",
      "12.5",
      "not-an-id",
      "1234567890123",
    ]) {
      expect(() =>
        resolveTheGroundConfig({
          THE_GROUND_LIVE_ENABLED: "true",
          THE_GROUND_ORGANIZATION_ID: organizationId,
        }),
      ).toThrow(TheGroundConfigurationError);
    }
  });

  it("enables live mode only when both gates are valid", () => {
    expect(
      resolveTheGroundConfig({
        THE_GROUND_LIVE_ENABLED: "true",
        THE_GROUND_ORGANIZATION_ID: "424242",
      }),
    ).toEqual({ mode: "live", organizationId: "424242" });
  });
});
