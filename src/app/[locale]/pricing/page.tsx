"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { motion } from "framer-motion"

export default function PricingPage() {
    const handleUpgrade = async () => {
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("No checkout URL returned");
            }
        } catch (error) {
            console.error("Upgrade failed:", error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[80vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 space-y-4"
            >
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    Unlock <span className="text-primary">TapDown Pro</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Downloads without limits. Get the best quality, instantly.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Free Plan */}
                <Card className="bg-background/40 backdrop-blur-xl border-white/10 relative overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-2xl">Free</CardTitle>
                        <CardDescription>Basic downloading for casual users</CardDescription>
                        <div className="mt-4 text-3xl font-bold">$0 <span className="text-sm font-normal text-muted-foreground">/ month</span></div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-muted-foreground">
                                <Check className="w-5 h-5 text-green-500" />
                                <span>Unlimited Downloads</span>
                            </li>
                            <li className="flex items-center gap-2 text-muted-foreground">
                                <Check className="w-5 h-5 text-green-500" />
                                <span>Standard Quality (SD)</span>
                            </li>
                            <li className="flex items-center gap-2 text-muted-foreground">
                                <X className="w-5 h-5 text-red-500" />
                                <span>Wait 20 seconds per download</span>
                            </li>
                            <li className="flex items-center gap-2 text-muted-foreground">
                                <X className="w-5 h-5 text-red-500" />
                                <span>No HD Available</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                    </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="bg-black/60 backdrop-blur-xl border-primary/50 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="relative">
                        <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-bl-xl">
                            POPULAR
                        </div>
                        <CardTitle className="text-2xl text-primary">Pro</CardTitle>
                        <CardDescription>For creators and power users</CardDescription>
                        <div className="mt-4 text-3xl font-bold">$9.99 <span className="text-sm font-normal text-muted-foreground">/ month</span></div>
                    </CardHeader>
                    <CardContent className="space-y-4 relative">
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-primary" />
                                <span className="font-medium">Instant Downloads (No Timer)</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-primary" />
                                <span className="font-medium">Original HD Quality</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-primary" />
                                <span>Priority Support</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-primary" />
                                <span>Ad-free Experience</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter className="relative">
                        <Button
                            onClick={handleUpgrade}
                            className="w-full bg-primary hover:bg-primary/80 font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-all"
                        >
                            Upgrade Now
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
