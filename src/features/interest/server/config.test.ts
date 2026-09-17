import { describe, expect, it } from "vitest";

import { portfolioConsentVersion } from "../schema";
import { getInterestServerConfig } from "./config";

const enabledEnvironment = {
  PORTFOLIO_CONTACT_COLLECTION_ENABLED: "true",
  PORTFOLIO_CONTACT_CONSENT_VERSION: portfolioConsentVersion,
  PORTFOLIO_TURNSTILE_SECRET_KEY: "example-turnstile-credential",
  PORTFOLIO_TURNSTILE_EXPECTED_HOSTNAME: "portfolio.example.com",
} as const;

describe("interest server configuration", () => {
  it("keeps collection disabled by default", () => {
    expect(getInterestServerConfig({})).toEqual({ enabled: false });
  });

  it.each([
    ["feature flag", { ...enabledEnvironment, PORTFOLIO_CONTACT_COLLECTION_ENABLED: "false" }],
    ["published consent version", { ...enabledEnvironment, PORTFOLIO_CONTACT_CONSENT_VERSION: "other" }],
    ["Turnstile secret", { ...enabledEnvironment, PORTFOLIO_TURNSTILE_SECRET_KEY: "" }],
    ["Turnstile hostname", { ...enabledEnvironment, PORTFOLIO_TURNSTILE_EXPECTED_HOSTNAME: "portfolio.example.com/path" }],
  ])("fails closed when %s is invalid", (_label, environment) => {
    expect(getInterestServerConfig(environment)).toEqual({ enabled: false });
  });

  it("resolves the neutral published contract when every gate is valid", () => {
    expect(getInterestServerConfig(enabledEnvironment)).toMatchObject({
      enabled: true,
      turnstile: {
        expectedAction: "portfolio_contact_submit",
        expectedHostname: "portfolio.example.com",
      },
    });
  });
});
