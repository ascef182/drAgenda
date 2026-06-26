import * as Sentry from "@sentry/nextjs";
import { headers } from "next/headers";
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";

import { checkActionLimit } from "./ratelimit";

/** Thrown when a caller exceeds the per-IP action rate limit. */
class RateLimitError extends Error {}

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    // Rate-limit hits are expected, not bugs — surface a friendly message and
    // don't report them to Sentry.
    if (e instanceof RateLimitError) {
      return "Muitas requisições. Aguarde um momento e tente novamente.";
    }
    // Report real errors to Sentry, but keep the client message generic so we
    // never leak internals (consistent with the error rules in CLAUDE.md).
    Sentry.captureException(e);
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
}).use(async ({ next }) => {
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  const allowed = await checkActionLimit(`action:${ip}`);
  if (!allowed) throw new RateLimitError();
  return next();
});
