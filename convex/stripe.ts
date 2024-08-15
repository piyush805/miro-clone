"use node";

import { Stripe } from "stripe";
import { v } from "convex/values";

import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

const url = process.env.NEXT_PUBLIC_APP_URL!;
const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2024-06-20",
});

/**
 * Allow users to cancel their subscription
 */
export const portal = action({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (!args.orgId) {
      throw new Error("No organization Id");
    }

    const orgSubscription = await ctx.runQuery(internal.subscriptions.get, {
      orgId: args.orgId,
    });

    if (!orgSubscription) {
      throw new Error("No subscription found");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: orgSubscription.stripeCustomerId,
      return_url: url, // Next_public_app_url
    });
    return session.url;
  },
});

export const pay = action({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    if (!args.orgId) {
      throw new Error("No organization Id");
    }
    const session = await stripe.checkout.sessions.create({
      success_url: url,
      cancel_url: url,
      customer_email: identity.email,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Board Pro",
              description: "Unlimited boards for your organization",
            },
            unit_amount: 2000, // $ 20
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        orgId: args.orgId,
        // payments are done using webhooks so that's why we need to pass the orgId as metadata
        // payments are not done using promises
        // Payments confirmation comes on the webhook and backend needs to know which orgId to update
      },
      mode: "subscription",
    });

    return session.url;
  },
});

export const fulfill = internalAction({
  args: {
    signature: v.string(),
    payload: v.string(),
  },
  handler: async (ctx, { signature, payload }) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
      const session = event.data.object as Stripe.Checkout.Session;

      if (event.type === "checkout.session.completed") {
        // 1s time payment callback
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        if (!session?.metadata?.orgId) {
          throw new Error("No orgId in metadata");
        }

        await ctx.runMutation(internal.subscriptions.create, {
          orgId: session.metadata.orgId as string,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id as string,
          stripePriceId: subscription.items.data[0].price.id as string,
          stripeCurrentPeriodEnd: (subscription.current_period_end *
            1000) as number,
        });
      }

      if (event.type === "invoice.payment_succeeded") {
        // when stripe tries to renew the subscription
        // we need less info here
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await ctx.runMutation(internal.subscriptions.update, {
          stripeSubscriptionId: subscription.id as string,
          stripeCurrentPeriodEnd: (subscription.current_period_end *
            1000) as number,
        });
      }

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  },
});
