# Security policy

[**English**](SECURITY.md) · [繁體中文](SECURITY.zh-Hant.md)

This portfolio edition is a sanitised reference implementation with synthetic fixtures and disabled-by-default integrations. It is not a production security programme or an invitation to test the historical event website.

## Reporting

If you find a security or privacy issue in the published reference implementation, contact the repository owner privately through the contact method on their GitHub profile. Include the affected file or route, likely impact, version or commit and a minimal reproduction using synthetic data.

Do not put any credential, token, private key, personal information, private client material, production endpoint or production resource identifier in a public issue, pull request, discussion, screenshot or log. If safe private contact is unavailable, report only that a private channel is required.

## Scope

Supported reports include:

- credential or identifier exposure;
- personal-data handling or logging regressions;
- validation, Turnstile, rate-limit or Queue-boundary bypasses;
- unsafe canonical-link generation;
- dependency or deployment issues that affect the curated public implementation.

Documentation corrections that do not describe a vulnerability may use the repository's normal contribution path, provided they contain no private information.

## Authorised testing and out-of-scope targets

Authorised testing is limited to source review and to local or tester-controlled instances of this public edition using synthetic data and resources the tester owns or is explicitly authorised to use.

The historical event website, client infrastructure and third-party platforms are not authorised testing targets. Do not probe or submit test data to production services, The Ground, Google Sheets, Cloudflare accounts, client social accounts or any endpoint discovered from old media.

This repository contains demo configuration only. A checked-in resource name, placeholder hostname or synthetic form destination must not be treated as proof that a corresponding live resource exists.

## Response expectations

This independent portfolio repository does not promise a service-level response time. The owner will acknowledge a reproducible in-scope report when practical, assess exposure privately and publish a sanitised fix or advisory where appropriate.
