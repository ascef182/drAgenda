import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Supported locales. Portuguese is the default and stays unprefixed (`/`),
  // Spanish and English are served under `/es` and `/en`.
  locales: ["pt", "es", "en"],
  defaultLocale: "pt",
  // `as-needed` keeps every Portuguese URL identical to before (no `/pt`
  // prefix), so the authenticated app is unaffected by the locale segment.
  localePrefix: "as-needed",
  // Disable Accept-Language auto-redirect: `/` is always Portuguese and the
  // language is changed explicitly through the switcher. Predictable for SEO
  // and avoids interfering with the app routes.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
