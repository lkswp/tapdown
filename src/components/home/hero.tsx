"use client"

import { Downloader } from "@/components/features/downloader"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"
import BlurText from "@/components/reactbits/BlurText"
import Magnet from "@/components/reactbits/Magnet"

const Waves = dynamic(() => import('@/components/reactbits/Waves'), { ssr: false })

export function Hero() {
    const t = useTranslations('Hero')

    return (
        <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 overflow-hidden">
            {/* Reactbits Waves Background */}
            <Waves />

            {/* Overlay to ensure text readability if needed */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center space-y-10 max-w-5xl relative z-10"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg mb-4">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    <span className="text-sm font-medium text-white/80">{t('badge')}</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50 drop-shadow-2xl">
                    <BlurText
                        text={t('titleStart')}
                        className="inline-block text-white"
                        delay={50}
                    />
                    <br className="hidden md:block" />
                    <br className="hidden md:block" />
                    <span className="inline-block relative">
                        <BlurText
                            text={t('titleEnd')}
                            className="text-primary inline-block drop-shadow-2xl"
                            delay={50}
                        />
                    </span>
                </h1>

                <div className="w-full relative group max-w-2xl mx-auto mt-8">
                    {/* Impeccable Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-300 animate-pulse"></div>
                    <div className="relative transform group-hover:-translate-y-1 transition-transform duration-300">
                        <Downloader />
                    </div>
                </div>

                {/* Supported Platforms */}
                <div className="pt-12">
                    <p className="text-sm text-muted-foreground mb-6 font-medium uppercase tracking-wider">{t('supportedPlatforms')}</p>
                    <div className="flex items-center justify-center gap-8">
                        <Magnet magnetStrength={5}>
                            <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                                {/* Using text for now, could be replaced with proper SVGs */}
                                <span className="text-xs font-bold">TikTok</span>
                            </div>
                        </Magnet>
                        <Magnet magnetStrength={5}>
                            <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                                <span className="text-xs font-bold">Instagram</span>
                            </div>
                        </Magnet>
                        <Magnet magnetStrength={5}>
                            <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                                <span className="text-xs font-bold">YouTube</span>
                            </div>
                        </Magnet>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
