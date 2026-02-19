import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock_key_for_build", {
    apiVersion: '2026-01-28.clover' as any, // Cast to any to silence the error if it persists, but this is the string it wants.
    typescript: true,
});
