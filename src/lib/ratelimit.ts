import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiting backed by Upstash Redis (REST/HTTPS — only URL + TOKEN needed).
 *
 * Everything degrades gracefully: when the Upstash env vars are absent (local
 * dev / CI), `redis` is null and the limiters become no-ops, so nothing breaks.
 */
const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
);

export const redis = hasUpstash ? Redis.fromEnv() : null;

const actionLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "10 s"),
      prefix: "rl:action",
      analytics: false,
    })
  : null;

/**
 * Returns true if the request is allowed, false if the limit is exceeded.
 * No-op (always allows) when Upstash is not configured.
 */
export async function checkActionLimit(identifier: string): Promise<boolean> {
  if (!actionLimiter) return true;
  const { success } = await actionLimiter.limit(identifier);
  return success;
}
