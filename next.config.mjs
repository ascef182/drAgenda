import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */

// Baseline security headers applied to every route. These are safe defaults that
// don't require per-page tuning. NOTE: a Content-Security-Policy is intentionally
// NOT set here yet — the app uses an inline boot script (see layout.tsx), so a
// strict CSP needs a nonce/hash setup to avoid breaking it. Tracked as a follow-up.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // HSTS only takes effect over HTTPS (Vercel serves HTTPS). `preload` is omitted
  // on purpose — add it only when ready to submit to the HSTS preload list.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

// Source map upload is disabled (no SENTRY_AUTH_TOKEN yet) — stack traces stay
// minified in prod for now. Wrapping is inert at runtime without a DSN.
export default withNextIntl(
  withSentryConfig(nextConfig, {
    silent: true,
    sourcemaps: { disable: true },
  }),
);
