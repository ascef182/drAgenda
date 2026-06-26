"use server";

import Stripe from "stripe";

import { isDevMode } from "@/lib/env";
import { actionClient } from "@/lib/next-safe-action";
import { requireUser } from "@/lib/session";

export const createStripeCheckout = actionClient.action(async () => {
  const session = await requireUser();

  // DEV MODE: skip the real Stripe API and simulate a successful checkout by
  // returning a redirect URL (same contract as production: { url }). This keeps
  // the subscribe flow testable end-to-end locally without charging anything.
  if (isDevMode()) {
    console.log("[DEV] Stripe checkout simulated for user:", session.user.id);
    return { url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    subscription_data: {
      metadata: {
        userId: session.user.id,
      },
    },
    line_items: [
      {
        price: process.env.STRIPE_ESSENTIAL_PLAN_PRICE_ID,
        quantity: 1,
      },
    ],
  });

  return { url: checkoutSession.url };
});
