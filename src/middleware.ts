import { NextRequest, NextResponse } from "next/server";

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  if (!isProtected) return NextResponse.next();

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

  return NextResponse.next();
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
