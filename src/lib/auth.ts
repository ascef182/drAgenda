import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  accountsTable,
  sessionsTable,
  usersTable,
  usersToClinicsTable,
  verificationsTable,
} from "@/db/schema";
import { redis } from "@/lib/ratelimit";

const isDevelopment = process.env.NODE_ENV !== "production";
const DEV_ORIGIN = "http://localhost:3000";

// In development the auth base URL must stay on the dev origin (localhost) so the
// OAuth callback and the state cookie share the same host. Otherwise, when .env
// points NEXT_PUBLIC_APP_URL/BETTER_AUTH_URL at the production domain, local
// logins bounce to production and fail with "please_restart_the_process".
function resolveBaseURL() {
  if (isDevelopment) return DEV_ORIGIN;
  return process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
}

// Origins better-auth is allowed to accept requests from. Production trusts only
// the configured app URL; development also trusts localhost/127.0.0.1 so login
// works regardless of which hostname reaches the dev server.
function buildTrustedOrigins() {
  const configured =
    process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
  const origins = new Set<string>();
  if (configured) origins.add(configured);
  if (isDevelopment) {
    origins.add(DEV_ORIGIN);
    origins.add("http://127.0.0.1:3000");
  }
  return Array.from(origins);
}

// Upstash-backed shared storage so better-auth's rate limiting works across
// serverless instances. Falls back to in-memory when Upstash is not configured.
function buildSecondaryStorage() {
  const r = redis;
  if (!r) return undefined;
  return {
    get: async (key: string) => (await r.get<string>(key)) ?? null,
    set: async (key: string, value: string, ttl?: number) => {
      if (ttl) await r.set(key, value, { ex: ttl });
      else await r.set(key, value);
    },
    delete: async (key: string) => {
      await r.del(key);
    },
  };
}

const secondaryStorage = buildSecondaryStorage();

export const auth = betterAuth({
  baseURL: resolveBaseURL(),
  trustedOrigins: buildTrustedOrigins(),
  ...(secondaryStorage ? { secondaryStorage } : {}),
  // Brute-force protection. Tight limit on sign-in/sign-up; lenient global limit
  // so normal session traffic is not throttled.
  rateLimit: {
    enabled: true,
    storage: secondaryStorage ? "secondary-storage" : "memory",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 5 },
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: usersTable,
      session: sessionsTable,
      account: accountsTable,
      verification: verificationsTable,
    },
  }),
  socialProviders: {
    // Google login is optional — disabled gracefully when credentials are absent
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const [userData, clinics] = await Promise.all([
        db.query.usersTable.findFirst({
          where: eq(usersTable.id, user.id),
        }),
        db.query.usersToClinicsTable.findMany({
          where: eq(usersToClinicsTable.userId, user.id),
          with: {
            clinic: true,
            user: true,
          },
        }),
      ]);
      // TODO: Ao adaptar para o usuário ter múltiplas clínicas, mudar este código
      const clinic = clinics?.[0];
      return {
        user: {
          ...user,
          plan: userData?.plan,
          clinic: clinic?.clinicId
            ? {
                id: clinic?.clinicId,
                name: clinic?.clinic?.name,
              }
            : undefined,
        },
        session,
      };
    }),
  ],
  user: {
    additionalFields: {
      stripeCustomerId: {
        type: "string",
        fieldName: "stripeCustomerId",
        required: false,
      },
      stripeSubscriptionId: {
        type: "string",
        fieldName: "stripeSubscriptionId",
        required: false,
      },
      plan: {
        type: "string",
        fieldName: "plan",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});
