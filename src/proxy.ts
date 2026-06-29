import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";

// Routes that require an authenticated session
const PROTECTED_PATHS = [
  "/dashboard",
  "/doctors",
  "/patients",
  "/appointments",
  "/subscription",
  "/clinic-form",
  "/new-subscription",
];

function getLocaleFromPath(pathname: string): string {
  // Check for locale prefix
  const localePrefix = routing.locales.find(
    (l) => l !== routing.defaultLocale && pathname.startsWith(`/${l}/`),
  );
  if (localePrefix) return localePrefix;
  // Check exact match (e.g., /es)
  const localeExact = routing.locales.find(
    (l) => l !== routing.defaultLocale && pathname === `/${l}`,
  );
  if (localeExact) return localeExact;
  return routing.defaultLocale;
}

export async function proxy(request: NextRequest) {
  // 1. Internationalization — set locale header for next-intl
  const locale = getLocaleFromPath(request.nextUrl.pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-next-intl-locale", locale);

  // 2. Auth check for protected routes
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  if (isProtected) {
    try {
      // Calls our own better-auth endpoint — same server, low latency.
      // Full session validation (signature + expiry) happens inside better-auth.
      const response = await fetch(
        new URL("/api/auth/get-session", request.nextUrl.origin),
        {
          headers: { cookie: request.headers.get("cookie") ?? "" },
        },
      );

      const session = await response.json();

      if (!session?.user) {
        return NextResponse.redirect(
          new URL("/authentication", request.url),
        );
      }
    } catch {
      // If the auth endpoint is unreachable, fail closed (redirect to login).
      return NextResponse.redirect(new URL("/authentication", request.url));
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes (auth, stripe webhooks)
     * - Next.js internals (_next/static, _next/image)
     * - Static files (favicon, images, fonts)
     */
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)$).*)",
  ],
};
