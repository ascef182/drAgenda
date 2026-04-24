import { headers } from "next/headers";
import { cache } from "react";

import { auth } from "@/lib/auth";

// React cache deduplicates within a single request/render cycle.
// This means if multiple server components or one action calls these helpers,
// the DB roundtrip only happens once per request.
const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

/**
 * Requires an authenticated user.
 * Use only for actions that run before a clinic exists (e.g., create-clinic, stripe checkout).
 */
export async function requireUser() {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

/**
 * Requires an authenticated user AND an active clinic.
 * Use for all clinic-scoped server actions (doctors, patients, appointments, etc.).
 * Throws consistent, safe error messages on failure.
 */
export async function requireClinic() {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (!session.user.clinic?.id) throw new Error("Clinic not found");
  return {
    ...session,
    user: {
      ...session.user,
      clinic: session.user.clinic as { id: string; name: string | undefined },
    },
  };
}
