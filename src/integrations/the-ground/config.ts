import type { TheGroundConfig } from "./types";

const ORGANIZATION_ID_PATTERN = /^[1-9]\d{0,11}$/;

export class TheGroundConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TheGroundConfigurationError";
  }
}

export function parseTheGroundOrganizationId(
  value: string | null | undefined,
): string {
  const organizationId = value?.trim();
  if (!organizationId || !ORGANIZATION_ID_PATTERN.test(organizationId)) {
    throw new TheGroundConfigurationError(
      "Live The Ground mode requires a positive numeric organisation identifier of at most 12 digits.",
    );
  }

  return organizationId;
}

export function resolveTheGroundConfig(
  environment: Readonly<Record<string, string | undefined>>,
): TheGroundConfig {
  if (environment.THE_GROUND_LIVE_ENABLED !== "true") {
    return { mode: "demo", organizationId: null };
  }

  const organizationId = parseTheGroundOrganizationId(
    environment.THE_GROUND_ORGANIZATION_ID,
  );

  return { mode: "live", organizationId };
}
