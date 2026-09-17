import type { ContactSubmission } from "./submission";

export const syntheticSubmission: ContactSubmission = {
  submission_id: "018f47a2-6b4d-7c8e-9f10-1234567890ab",
  submitted_at_utc: "2030-06-20T02:03:04.000Z",
  submitted_at_hkt: "2030-06-20T10:03:04.000+08:00",
  last_name: "Ng",
  first_name: "Casey",
  display_name: "Casey Ng",
  email: "casey.ng@example.com",
  phone: "+1 202-555-0147",
  locale: "en",
  source_page: "/en/visit",
  consent: true,
  consent_version: "portfolio-demo-contact-v1",
  purpose: "portfolio-demo-contact-interest",
  marketing_opt_in: true,
};
