import type { ContactRateLimiter } from "./rate-limit";
import type { InterestSubmissionsQueue } from "./queue";

declare global {
  interface CloudflareEnv {
    PORTFOLIO_CONTACT_SUBMISSIONS_QUEUE?: InterestSubmissionsQueue;
    PORTFOLIO_CONTACT_PRE_RATE_LIMITER?: ContactRateLimiter;
    PORTFOLIO_CONTACT_RATE_LIMITER?: ContactRateLimiter;
  }
}

export {};
