"use client"

import { Downloader } from "@/components/features/downloader"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

export function Hero() {
    const t = useTranslations('Hero')

    return (
        <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 overflow-hidden">
            {/* Background moved to layout.tsx */}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center space-y-8 max-w-4xl relative z-10"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg mb-4">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    <span className="text-sm font-medium text-white/80">{t('badge')}</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50 drop-shadow-2xl">
                    {t('titleStart')} <br className="hidden md:block" />
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {t('titleEnd')}
                    </span>
                </h1>

                <div className="w-full relative group max-w-2xl mx-auto">
                    {/* Impeccable Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-3xl blur-xl opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300 animate-pulse"></div>
                    <div className="relative transform group-hover:-translate-y-1 transition-transform duration-300">
                        <Downloader />
                    </div>
                </div>

                {/* Supported Platforms */}
                <div className="pt-8">
                    <p className="text-sm text-muted-foreground mb-4 font-medium uppercase tracking-wider">{t('supportedPlatforms')}</p>
                    <div className="flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        {/* Icons would go here */}
                        <span className="text-xs font-semibold">TikTok</span>
                        <span className="text-xs font-semibold">Instagram</span>
                        <span className="text-xs font-semibold">YouTube</span>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
