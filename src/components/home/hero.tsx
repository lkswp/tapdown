"use client"

import { Downloader } from "@/components/features/downloader"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

export function Hero() {
    const t = useTranslations('Hero')

    return (
        <section className="relative flex flex-col items-center justify-center py-20 md:py-32 text-center space-y-8">
            {/* Background decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
            >
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 backdrop-blur-sm">
                    {t('badge')}
                </span>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
                    {t('titleStart')} <br />
                    <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                        {t('titleEnd')}
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                    {t('description')}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full"
            >
                <Downloader />
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-6 justify-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
            >
                {/* Placeholder for platform icons - simple text for now or SVG later */}
                <span className="text-sm font-semibold">{t('supportedPlatforms')}:</span>
                <span className="text-sm">TikTok</span>
                <span className="text-sm">Instagram</span>
                <span className="text-sm">YouTube</span>
                <span className="text-sm">Facebook</span>
            </motion.div>
        </section>
    )
}
