"use client"

import { Downloader } from "@/components/features/downloader"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"
import BlurText from "@/components/reactbits/BlurText"
import Magnet from "@/components/reactbits/Magnet"
import { Instagram, Youtube, Twitter, Facebook } from "lucide-react"
import { RecentDownloads } from "@/components/features/recent-downloads"

const TikTokIcon = () => (
    <svg className="h-6 w-6 text-black dark:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
)

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
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent inline-block drop-shadow-lg">
                        {t('titleEnd')}
                    </span>
                </h1>

                <div className="w-full relative group max-w-3xl mx-auto mt-12">
                    {/* Impeccable Glow effect */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary via-accent to-primary rounded-[2.5rem] blur-2xl opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-300 animate-pulse"></div>
                    <div className="relative transform group-hover:-translate-y-1 transition-transform duration-500">
                        <div className="glass-panel p-3 rounded-[2rem] glow-border">
                            <Downloader />
                        </div>
                    </div>
                </div>

                {/* Supported Platforms */}
                <div className="pt-16">
                    <p className="text-sm text-muted-foreground mb-8 font-semibold uppercase tracking-widest">{t('supportedPlatforms')}</p>
                    <div className="flex items-center justify-center gap-10">
                        <Magnet magnetStrength={8}>
                            <div className="group flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-all cursor-pointer hover:scale-110">
                                <TikTokIcon />
                                <span className="text-xs font-bold tracking-wide group-hover:text-white transition-colors">TikTok</span>
                            </div>
                        </Magnet>
                        <Magnet magnetStrength={8}>
                            <div className="group flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-all cursor-pointer hover:scale-110">
                                <Instagram className="h-6 w-6 text-pink-500 drop-shadow-none group-hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.8)] transition-all" />
                                <span className="text-xs font-bold tracking-wide group-hover:text-pink-400 transition-colors">Instagram</span>
                            </div>
                        </Magnet>
                        <Magnet magnetStrength={8}>
                            <div className="group flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-all cursor-pointer hover:scale-110">
                                <Youtube className="h-6 w-6 text-red-500 drop-shadow-none group-hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-all" />
                                <span className="text-xs font-bold tracking-wide group-hover:text-red-400 transition-colors">YouTube</span>
                            </div>
                        </Magnet>
                        <Magnet magnetStrength={8}>
                            <div className="group flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-all cursor-pointer hover:scale-110">
                                <Twitter className="h-6 w-6 text-sky-500 drop-shadow-none group-hover:drop-shadow-[0_0_10px_rgba(14,165,233,0.8)] transition-all" />
                                <span className="text-xs font-bold tracking-wide group-hover:text-sky-400 transition-colors">Twitter</span>
                            </div>
                        </Magnet>
                        <Magnet magnetStrength={8}>
                            <div className="group flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-all cursor-pointer hover:scale-110">
                                <Facebook className="h-6 w-6 text-blue-600 drop-shadow-none group-hover:drop-shadow-[0_0_10px_rgba(37,99,235,0.8)] transition-all" />
                                <span className="text-xs font-bold tracking-wide group-hover:text-blue-500 transition-colors">Facebook</span>
                            </div>
                        </Magnet>
                    </div>
                </div>
            </motion.div>

            {/* Display local download history if available */}
            <div className="w-full relative z-20">
                <RecentDownloads />
            </div>
        </section>
    )
}
