"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";

import { createStripeCheckout } from "@/actions/create-stripe-checkout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ESSENTIAL_PLAN } from "@/lib/plans";

interface SubscriptionPlanProps {
  active?: boolean;
  className?: string;
  userEmail: string;
}

export function SubscriptionPlan({
  active = false,
  className,
  userEmail,
}: SubscriptionPlanProps) {
  const router = useRouter();
  const createStripeCheckoutAction = useAction(createStripeCheckout, {
    onSuccess: ({ data }) => {
      if (!data?.url) {
        throw new Error("Checkout URL not found");
      }
      window.location.assign(data.url);
    },
  });
  const plan = ESSENTIAL_PLAN;

  const handleSubscribeClick = () => {
    createStripeCheckoutAction.execute();
  };

  const handleManagePlanClick = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL}?prefilled_email=${userEmail}`,
    );
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-primary/30 shadow-xl shadow-primary/10 ring-1 ring-primary/10",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
      />
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
          {active && (
            <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15">
              Atual
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">{plan.tagline}</p>
        <div className="flex items-baseline gap-1">
          {plan.currency && (
            <span className="text-2xl font-bold text-foreground">
              {plan.currency}
            </span>
          )}
          <span className="text-4xl font-extrabold tracking-tight text-foreground">
            {plan.price}
          </span>
          {plan.period && (
            <span className="ml-1 text-muted-foreground">{plan.period}</span>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 border-t border-border pt-6">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="ml-3 text-foreground">{feature}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button
            className="h-12 w-full text-base shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-primary/50 hover:brightness-110"
            onClick={active ? handleManagePlanClick : handleSubscribeClick}
            disabled={createStripeCheckoutAction.isPending}
          >
            {createStripeCheckoutAction.isExecuting ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : active ? (
              "Gerenciar assinatura"
            ) : (
              "Fazer assinatura"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
