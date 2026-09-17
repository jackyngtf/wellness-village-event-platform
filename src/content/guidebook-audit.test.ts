import { describe, expect, it } from "vitest";

import {
  publicGuidebookAudit,
  publicGuidebookAuditSummary,
} from "./guidebook-audit";

describe("sanitised Guidebook audit contract", () => {
  it("preserves the historical aggregate without publishing identities or destinations", () => {
    expect(publicGuidebookAuditSummary).toEqual({
      guidebookPages: 184,
      pillars: 4,
      profiles: 48,
      clientConfirmedInstagramDestinations: 48,
      independentlyVerifiedOfficialWebsites: 29,
      profilesWithoutWebsiteAction: 19,
    });

    expect(JSON.stringify(publicGuidebookAudit)).not.toMatch(
      /https?:\/\/|www\.|@/i,
    );
  });

  it("keeps pseudonymous records unique and mapped to exact two-page ranges", () => {
    expect(
      new Set(publicGuidebookAudit.map(({ profileId }) => profileId)).size,
    ).toBe(48);

    const pages = publicGuidebookAudit.flatMap(({ pageRange }) => pageRange);
    expect(new Set(pages).size).toBe(96);

    for (const record of publicGuidebookAudit) {
      expect(Object.keys(record).sort()).toEqual([
        "instagramStatus",
        "pageRange",
        "pillarId",
        "profileId",
        "websiteStatus",
      ]);
      expect(record.pageRange[1]).toBe(record.pageRange[0] + 1);
      expect(record.instagramStatus).toBe("client-confirmed");
    }
  });

  it("preserves the four-pillar distribution and the 29/19 website boundary", () => {
    const pillarDistribution = Object.fromEntries(
      ["pillar-01", "pillar-02", "pillar-03", "pillar-04"].map(
        (pillarId) => [
          pillarId,
          publicGuidebookAudit.filter((record) => record.pillarId === pillarId)
            .length,
        ],
      ),
    );

    expect(pillarDistribution).toEqual({
      "pillar-01": 4,
      "pillar-02": 12,
      "pillar-03": 9,
      "pillar-04": 23,
    });
    expect(
      publicGuidebookAudit.filter(
        ({ websiteStatus }) => websiteStatus === "independently-verified",
      ),
    ).toHaveLength(29);
    expect(
      publicGuidebookAudit.filter(
        ({ websiteStatus }) => websiteStatus === "no-qualifying-live-site",
      ),
    ).toHaveLength(19);
  });
});
