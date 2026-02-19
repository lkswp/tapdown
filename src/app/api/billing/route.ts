import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const user = await currentUser();

        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const stripeCustomerId = user.publicMetadata.stripeCustomerId as string;

        if (!stripeCustomerId) {
            return new NextResponse("No subscription found", { status: 400 });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("[BILLING_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
