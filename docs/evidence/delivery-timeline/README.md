# How the delivery dates were checked

[**English**](README.md) · [繁體中文](README.zh-Hant.md)

This note explains how I checked the public delivery timeline without publishing private client messages.

## Sources reviewed

The chronology was reconstructed on 18 September 2026 from:

- timestamped project-group and direct project correspondence inspected through owner-authorised read-only access;
- the owner's first-hand delivery record, including sole-development responsibility, the home-server preview and web preparation of supplied print assets;
- the dated operational record for the 27 August Error 1102 incident and the matching implementation history for Worker CPU reduction;
- the authorised Porkbun invoice retained in the [billing and domain summary](../production-metrics/billing-and-domain-summary.json);
- the public event dates recorded by ELLE Hong Kong; and
- the authorised post-event Cloudflare and Search Console captures retained elsewhere in the project-records directory.

## What is retained publicly

- milestone dates needed to understand the delivery sequence;
- a distinction between the first reviewable MVP, the public production release and subsequent operational refinement;
- a narrow on-time statement: a working production URL was shared on 20 August, before the stated 21 August internal target; and
- a narrow operational statement: the site briefly returned Error 1102 on 27 August, the shared account moved to Workers Paid and CPU-heavy request paths were reduced before the event; and
- source categories and interpretation limits.

## What is excluded

- chat screenshots, transcripts and direct quotations;
- participant identities, phone numbers, email addresses and account details;
- voice notes, attachments and private Drive links;
- credentials, private infrastructure details and client-only handover material; and
- any inference about hours worked, attendance, conversion, revenue, ROI or causal business impact.

## Interpretation limits

The 5 August preview was a reviewable vertical slice, not the final system. The 20 August production milestone was a working public release, not a final content freeze: smaller corrections and operational hardening continued before the event opened on 30 August. "On time" refers only to that release-versus-target comparison. The 27 August record does not prove that the paid-plan change or the code change alone resolved the resource-limit incident.

The underlying private correspondence remains with the owner and is not redistributed by this portfolio edition. Readers can inspect the public implementation, tests, domain record, aggregate production figures and documentary media, but not the private messages themselves.

Continue with the [public delivery timeline](../../case-study/delivery-timeline.md) or inspect the [delivery-evolution diagram](../../diagrams/delivery-evolution.svg).
