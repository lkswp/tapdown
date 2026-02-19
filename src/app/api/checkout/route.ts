import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const user = await currentUser();

        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const priceId = "price_1T2XJW3tzj0M35ujE3gtqJOx"; // Hardcoded for this MVP based on the fetched ID

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?canceled=1`,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            metadata: {
                userId: user.id,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("[CHECKOUT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
