import "server-only";

import { portfolioConsentVersion } from "../schema";
import {
  portfolioTurnstileAction,
  type TurnstileServerConfig,
} from "./turnstile";

export type InterestServerConfig =
  | Readonly<{ enabled: false }>
  | Readonly<{ enabled: true; turnstile: TurnstileServerConfig }>;

function parseHostname(value: string | undefined): string | null {
  const candidate = value?.trim().toLowerCase() ?? "";
  if (candidate.length === 0 || candidate.length > 253) return null;

  try {
    const url = new URL(`https://${candidate}`);
    if (
      url.hostname !== candidate ||
      url.port !== "" ||
      url.username !== "" ||
      url.password !== "" ||
      url.pathname !== "/" ||
      url.search !== "" ||
      url.hash !== ""
    ) {
      return null;
    }
    return candidate;
  } catch {
    return null;
  }
}

/**
 * Native collection is disabled unless every pre-body privacy and Turnstile
 * gate is explicitly configured. The Queue binding is resolved separately by
 * the route before the request body is read.
 */
export function getInterestServerConfig(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): InterestServerConfig {
  if (environment.PORTFOLIO_CONTACT_COLLECTION_ENABLED !== "true") {
    return { enabled: false };
  }
  if (
    environment.PORTFOLIO_CONTACT_CONSENT_VERSION !== portfolioConsentVersion
  ) {
    return { enabled: false };
  }

  const siteverifyCredential =
    environment.PORTFOLIO_TURNSTILE_SECRET_KEY?.trim() ?? "";
  const expectedHostname = parseHostname(
    environment.PORTFOLIO_TURNSTILE_EXPECTED_HOSTNAME,
  );
  if (siteverifyCredential.length < 20 || !expectedHostname) {
    return { enabled: false };
  }

  return {
    enabled: true,
    turnstile: {
      siteverifyCredential,
      expectedAction: portfolioTurnstileAction,
      expectedHostname,
    },
  };
}
