"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { motion } from "framer-motion"

import { useTranslations } from "next-intl"

export default function PricingPage() {
    const t = useTranslations('PricingPage');

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
                    {t.rich('title', {
                        span: (chunks) => <span className="text-primary">{chunks}</span>
                    })}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {t('subtitle')}
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Free Plan */}
                <Card className="bg-background/40 backdrop-blur-xl border-white/10 relative overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-2xl">{t('freeTitle')}</CardTitle>
                        <CardDescription>{t('freeDesc')}</CardDescription>
                        <div className="mt-4 text-3xl font-bold">
                            {t.rich('freePrice', {
                                span: (chunks) => <span className="text-sm font-normal text-muted-foreground">{chunks}</span>
                            })}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-muted-foreground">
                                <Check className="w-5 h-5 text-green-500" />
                                <span>{t('featureUnlimited')}</span>
                            </li>
                            <li className="flex items-center gap-2 text-muted-foreground">
                                <Check className="w-5 h-5 text-green-500" />
                                <span>{t('featureSD')}</span>
                            </li>
                            <li className="flex items-center gap-2 text-muted-foreground">
                                <X className="w-5 h-5 text-red-500" />
                                <span>{t('featureWait')}</span>
                            </li>
                            <li className="flex items-center gap-2 text-muted-foreground">
                                <X className="w-5 h-5 text-red-500" />
                                <span>{t('featureNoHD')}</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" disabled>{t('currentPlan')}</Button>
                    </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="bg-black/60 backdrop-blur-xl border-primary/50 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="relative">
                        <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-bl-xl">
                            {t('popular')}
                        </div>
                        <CardTitle className="text-2xl text-primary">{t('proTitle')}</CardTitle>
                        <CardDescription>{t('proDesc')}</CardDescription>
                        <div className="mt-4 text-3xl font-bold">
                            {t.rich('proPrice', {
                                span: (chunks) => <span className="text-sm font-normal text-muted-foreground">{chunks}</span>
                            })}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 relative">
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-primary" />
                                <span className="font-medium">{t('featureInstant')}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-primary" />
                                <span className="font-medium">{t('featureHD')}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-primary" />
                                <span>{t('featurePriority')}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-primary" />
                                <span>{t('featureAdFree')}</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter className="relative">
                        <Button
                            onClick={handleUpgrade}
                            className="w-full bg-primary hover:bg-primary/80 font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-all"
                        >
                            {t('upgradeNow')}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
