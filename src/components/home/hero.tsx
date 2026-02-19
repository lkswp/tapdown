"use client"

import { Downloader } from "@/components/features/downloader"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

export function Hero() {
    const t = useTranslations('Hero')

    return (
        <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 h-96 w-96 bg-primary/30 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 h-96 w-96 bg-accent/30 rounded-full blur-[128px] animate-pulse delay-1000" />
            </div>

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

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    {t('description')}
                </p>
                <span className="text-sm">TikTok</span>
                <span className="text-sm">Instagram</span>
                <span className="text-sm">YouTube</span>
                <span className="text-sm">Facebook</span>
            </motion.div>
        </section>
    )
}
