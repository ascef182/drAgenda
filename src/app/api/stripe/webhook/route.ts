import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

export const POST = async (request: Request) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Missing config is an operator error (our fault, not Stripe's). Return 500 +
  // log so it surfaces in monitoring; Stripe will retry until the env is fixed.
  if (!secretKey || !webhookSecret) {
    console.error(
      "[stripe/webhook] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET",
    );
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  const stripe = new Stripe(secretKey);
  // Signature is verified against the RAW request body — never parse it first.
  const body = await request.text();

  // A failure here almost always means STRIPE_WEBHOOK_SECRET does not match this
  // endpoint's signing secret in the Stripe Dashboard (or a test/live mismatch).
  // Return 400 — NOT 500 — so Stripe stops retrying the same bad request in a loop.
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    console.error(
      "[stripe/webhook] Signature verification failed:",
      message,
    );
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "invoice.paid": {
        const invoice = event.data.object as unknown as {
          customer: string | null;
          subscription: string | null;
          subscription_details: { metadata?: { userId?: string } } | null;
        };
        const subscriptionId = invoice.subscription;
        const userId = invoice.subscription_details?.metadata?.userId;

        // Not every invoice.paid is a subscription we own. If we can't map it to
        // a user, acknowledge (200) and log — don't make Stripe retry forever.
        if (!subscriptionId || !userId) {
          console.warn(
            "[stripe/webhook] invoice.paid without subscription/userId",
            { eventId: event.id },
          );
          break;
        }

        await db
          .update(usersTable)
          .set({
            stripeSubscriptionId: subscriptionId,
            stripeCustomerId: invoice.customer,
            plan: "essential",
          })
          .where(eq(usersTable.id, userId));
        break;
      }

      case "customer.subscription.deleted": {
        // The event already carries the subscription object (with its metadata),
        // so there is no need for an extra stripe.subscriptions.retrieve() call.
        const subscription = event.data.object as unknown as {
          id: string;
          metadata?: { userId?: string };
        };
        const userId = subscription.metadata?.userId;

        if (!userId) {
          console.warn(
            "[stripe/webhook] subscription.deleted without userId",
            { eventId: event.id },
          );
          break;
        }

        await db
          .update(usersTable)
          .set({
            stripeSubscriptionId: null,
            stripeCustomerId: null,
            plan: null,
          })
          .where(eq(usersTable.id, userId));
        break;
      }

      default:
        // Unhandled event types are acknowledged so Stripe stops retrying them.
        break;
    }
  } catch (err) {
    // The event was valid but we failed to persist it. Return 500 so Stripe
    // retries later (this is a transient failure worth retrying).
    console.error("[stripe/webhook] Handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
};
