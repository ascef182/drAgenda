/**
 * Environment validation and dev-mode utilities.
 *
 * DEV MODE activates automatically when Stripe or Twilio keys are placeholders.
 * In DEV MODE, external API calls are replaced with console logs — safe for local development.
 */

/** Returns true if a value looks like a placeholder/dummy credential. */
export function isDummyValue(value: string | undefined): boolean {
  if (!value) return true;
  return (
    value === "dummy" ||
    value === "sk_test_dummy" ||
    value === "pk_test_dummy" ||
    value === "whsec_dummy" ||
    value === "price_dummy" ||
    value.startsWith("dev_")
  );
}

/**
 * DEV MODE is active when Stripe key is a dummy placeholder.
 * Prevents any real charges or external side effects during development.
 */
export function isDevMode(): boolean {
  return isDummyValue(process.env.STRIPE_SECRET_KEY);
}

/**
 * Returns the value of a required environment variable.
 * Throws a descriptive error if the variable is missing.
 */
export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
        `→ Copy .env.example to .env.local and set the value.`,
    );
  }
  return value;
}
