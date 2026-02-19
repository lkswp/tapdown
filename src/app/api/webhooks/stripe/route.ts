import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    const signature = (await headers()).get("Stripe-Signature") as string;

    // Read raw body as ArrayBuffer to avoid encoding issues
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const body = buffer.toString("utf-8");

    let event: Stripe.Event;

    try {
        // DEBUG LOGGING
        const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
        console.log(`[STRIPE WEBHOOK] Secret loaded: ${secret.length > 0}, Starts with: ${secret.substring(0, 8)}...`);
        console.log(`[STRIPE WEBHOOK] Signature: ${signature ? "Present" : "Missing"}, Length: ${signature?.length}`);

        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error(`[STRIPE WEBHOOK ERROR] Message: ${error.message}`);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const client = await clerkClient();

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.userId) {
            return new NextResponse("User id is required", { status: 400 });
        }

        await client.users.updateUserMetadata(session.metadata.userId, {
            publicMetadata: {
                isPro: true,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripeCurrentPeriodEnd: new Date(
                    (subscription as any).current_period_end * 1000
                ),
            },
        });
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        // If there is a userId in the metadata (from initial checkout), update it. 
        // Note: invoice events might not always have the metadata from the session directly attached in the same way,
        // usually we rely on looking up the customer in our DB. 
        // Since we are using Clerk Metadata as our "DB", we need to find the user by stripeCustomerId.
        // Clerk listing users by metadata is possible but rate limited. 
        // For a simple MVP, checkout.session.completed is the most critical for immediate access.
        // Handling recurring renewals without a DB mapping stripeCustomerId -> userId is tricky with just Clerk Metadata.

        // For this MVP, we will rely on the fact that if the subscription is active, they are Pro.
        // A robust production app should definitely have a `users` table in a real DB (Postgres/MySQL).
    }

    // Handle subscription cancellation/expiration
    if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription;
        // We need to find the user who has this subscription ID and remove their Pro status.
        // This is the limitation of not having a DB.
        // For now, we accept this limitation or we'd need to fetch all users and filter (bad).
        // PROPOSAL: The user will lose access when their metadata naturally expires or if we implement a user lookup.
        // For this specific iteration, we will implement the critical "Grant Access" flow.
        // "Revoke Access" is a TODO for when a DB is added.
    }

    return new NextResponse(null, { status: 200 });
}
