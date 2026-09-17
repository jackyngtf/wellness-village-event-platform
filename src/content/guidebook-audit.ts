type PublicPillarId =
  | "pillar-01"
  | "pillar-02"
  | "pillar-03"
  | "pillar-04";

type PublicWebsiteStatus =
  | "independently-verified"
  | "no-qualifying-live-site";

function profile(
  profileId: `profile-${string}`,
  pillarId: PublicPillarId,
  pageStart: number,
  websiteStatus: PublicWebsiteStatus,
) {
  return {
    profileId,
    pillarId,
    pageRange: [pageStart, pageStart + 1] as const,
    instagramStatus: "client-confirmed" as const,
    websiteStatus,
  };
}

/**
 * A pseudonymous aggregate derived from the private, source-backed production
 * content audit. It preserves the count, pillar, page-range and destination
 * status evidence used by this case study without publishing brand identity,
 * client copy, social handles, website URLs or Guidebook source material.
 */
export const publicGuidebookAudit = [
  profile("profile-01", "pillar-01", 30, "independently-verified"),
  profile("profile-02", "pillar-01", 32, "independently-verified"),
  profile("profile-03", "pillar-01", 34, "independently-verified"),
  profile("profile-04", "pillar-01", 36, "independently-verified"),
  profile("profile-05", "pillar-02", 40, "independently-verified"),
  profile("profile-06", "pillar-02", 42, "independently-verified"),
  profile("profile-07", "pillar-02", 44, "independently-verified"),
  profile("profile-08", "pillar-02", 46, "independently-verified"),
  profile("profile-09", "pillar-02", 48, "independently-verified"),
  profile("profile-10", "pillar-02", 50, "independently-verified"),
  profile("profile-11", "pillar-02", 52, "independently-verified"),
  profile("profile-12", "pillar-02", 54, "no-qualifying-live-site"),
  profile("profile-13", "pillar-02", 56, "no-qualifying-live-site"),
  profile("profile-14", "pillar-02", 58, "independently-verified"),
  profile("profile-15", "pillar-02", 60, "no-qualifying-live-site"),
  profile("profile-16", "pillar-02", 62, "independently-verified"),
  profile("profile-17", "pillar-03", 66, "independently-verified"),
  profile("profile-18", "pillar-03", 68, "no-qualifying-live-site"),
  profile("profile-19", "pillar-03", 70, "no-qualifying-live-site"),
  profile("profile-20", "pillar-03", 72, "independently-verified"),
  profile("profile-21", "pillar-03", 74, "no-qualifying-live-site"),
  profile("profile-22", "pillar-03", 76, "independently-verified"),
  profile("profile-23", "pillar-03", 78, "independently-verified"),
  profile("profile-24", "pillar-03", 80, "independently-verified"),
  profile("profile-25", "pillar-03", 82, "independently-verified"),
  profile("profile-26", "pillar-04", 86, "independently-verified"),
  profile("profile-27", "pillar-04", 88, "independently-verified"),
  profile("profile-28", "pillar-04", 90, "no-qualifying-live-site"),
  profile("profile-29", "pillar-04", 92, "independently-verified"),
  profile("profile-30", "pillar-04", 94, "independently-verified"),
  profile("profile-31", "pillar-04", 96, "no-qualifying-live-site"),
  profile("profile-32", "pillar-04", 98, "independently-verified"),
  profile("profile-33", "pillar-04", 100, "no-qualifying-live-site"),
  profile("profile-34", "pillar-04", 102, "independently-verified"),
  profile("profile-35", "pillar-04", 104, "no-qualifying-live-site"),
  profile("profile-36", "pillar-04", 106, "independently-verified"),
  profile("profile-37", "pillar-04", 108, "no-qualifying-live-site"),
  profile("profile-38", "pillar-04", 110, "independently-verified"),
  profile("profile-39", "pillar-04", 112, "no-qualifying-live-site"),
  profile("profile-40", "pillar-04", 114, "no-qualifying-live-site"),
  profile("profile-41", "pillar-04", 116, "no-qualifying-live-site"),
  profile("profile-42", "pillar-04", 118, "no-qualifying-live-site"),
  profile("profile-43", "pillar-04", 120, "independently-verified"),
  profile("profile-44", "pillar-04", 122, "no-qualifying-live-site"),
  profile("profile-45", "pillar-04", 124, "independently-verified"),
  profile("profile-46", "pillar-04", 126, "no-qualifying-live-site"),
  profile("profile-47", "pillar-04", 128, "no-qualifying-live-site"),
  profile("profile-48", "pillar-04", 130, "no-qualifying-live-site"),
] as const;

export const publicGuidebookAuditSummary = {
  guidebookPages: 184,
  pillars: 4,
  profiles: 48,
  clientConfirmedInstagramDestinations: 48,
  independentlyVerifiedOfficialWebsites: 29,
  profilesWithoutWebsiteAction: 19,
} as const;
