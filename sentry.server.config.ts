import * as Sentry from "@sentry/nextjs";

// Server-side Sentry init. No-op when NEXT_PUBLIC_SENTRY_DSN is absent, so dev
// and CI never send events and never fail for a missing DSN.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  // Lower in production if event volume/cost becomes a concern.
  tracesSampleRate: 0.1,
});
