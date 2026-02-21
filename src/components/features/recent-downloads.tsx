"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { VideoData } from "@/app/actions"
import { PlayCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RecentDownloads() {
    const [history, setHistory] = useState<VideoData[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        loadHistory()

        // Listen to local storage changes from other tabs or same tab manual events
        const handleStorage = () => loadHistory()
        window.addEventListener('storage', handleStorage)
        window.addEventListener('tapdown_history_updated', handleStorage)

        return () => {
            window.removeEventListener('storage', handleStorage)
            window.removeEventListener('tapdown_history_updated', handleStorage)
        }
    }, [])

    const loadHistory = () => {
        try {
            const h = localStorage.getItem('tapdown_history')
            if (h) setHistory(JSON.parse(h))
        } catch (e) { }
    }

    const clearHistory = () => {
        localStorage.removeItem('tapdown_history')
        setHistory([])
        window.dispatchEvent(new Event('tapdown_history_updated'))
    }

    if (!mounted || history.length === 0) return null

    return (
        <div className="w-full max-w-5xl mx-auto pt-16">
            <div className="flex items-center justify-between mb-6 px-4">
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-widest">
                    Recent
                </p>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-xs text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors h-8"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                </Button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 px-4 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <AnimatePresence>
                    {history.map((item, idx) => (
                        <motion.div
                            key={`${item.url}-${idx}`}
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                            className="min-w-[200px] w-[200px] sm:min-w-[240px] sm:w-[240px] snap-center shrink-0"
                        >
                            <div className="glass-panel group relative overflow-hidden rounded-2xl aspect-[4/5] glow-border flex flex-col p-2 transition-all hover:-translate-y-2 cursor-pointer"
                                onClick={() => window.open(item.url, '_blank')}
                            >
                                <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative w-full h-[65%] rounded-xl overflow-hidden bg-black/40">
                                    {item.thumbnail ? (
                                        <Image
                                            src={item.thumbnail}
                                            alt={item.title || "Video"}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground bg-white/5">
                                            <PlayCircle className="w-8 h-8 opacity-50" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white uppercase border border-white/10">
                                        {item.platform}
                                    </div>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                                </div>

                                <div className="flex-1 flex flex-col justify-between pt-3 px-1 w-full space-y-2 relative z-10">
                                    <h4 className="text-sm font-bold line-clamp-2 leading-tight text-white/90 group-hover:text-white transition-colors">
                                        {item.title || "Social Video"}
                                    </h4>
                                    <p className="text-xs text-muted-foreground truncate font-medium">
                                        {item.author || "Unknown"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            {/* Custom CSS to hide scrollbar cross-browser if external utilities miss it */}
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    )
}
