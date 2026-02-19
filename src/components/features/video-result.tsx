"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Music, Video, Lock, Timer, Sparkles } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { useRouter } from "@/i18n/routing"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface VideoResultProps {
    data: {
        url: string
        hdUrl?: string
        audioUrl?: string
        thumbnail?: string
        title?: string
        author?: string;
        platform: string
    }
}

export const VideoResult: React.FC<VideoResultProps> = ({ data }) => {
    const t = useTranslations('Result');
    const { user, isLoaded } = useUser();
    const router = useRouter();

    const [isTimerOpen, setIsTimerOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(20);
    const [downloadReady, setDownloadReady] = useState(false);
    const [activeDownloadType, setActiveDownloadType] = useState<'video' | 'audio'>('video');

    // Check if user is Pro
    const isPro = user?.publicMetadata?.isPro === true;

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerOpen && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setDownloadReady(true);
        }
        return () => clearInterval(interval);
    }, [isTimerOpen, timeLeft]);

    const initiateDownload = (url: string, filename: string) => {
        const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${filename}`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadClick = (type: 'video' | 'audio', isHd: boolean = false) => {
        if (isHd && !isPro) {
            router.push('/pricing');
            return;
        }

        const targetUrl = type === 'audio'
            ? (data.audioUrl || data.url)
            : (isHd ? (data.hdUrl || data.url) : data.url);

        const ext = type === 'audio' ? 'mp3' : 'mp4';
        const filename = `tapdown-${data.platform}-${Date.now()}.${ext}`;

        if (isPro) {
            // Instant download for Pro users
            initiateDownload(targetUrl, filename);
        } else {
            // Free users wait
            setActiveDownloadType(type);
            setTimeLeft(20);
            setDownloadReady(false);
            setIsTimerOpen(true);
        }
    };

    const handleTimerCompleteDownload = () => {
        const targetUrl = activeDownloadType === 'audio' ? (data.audioUrl || data.url) : data.url;
        const ext = activeDownloadType === 'audio' ? 'mp3' : 'mp4';
        const filename = `tapdown-${data.platform}-${Date.now()}.${ext}`;

        initiateDownload(targetUrl, filename);
        setIsTimerOpen(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto mt-8"
        >
            <Card className="bg-background/40 backdrop-blur-xl border-white/10 overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative w-full md:w-48 aspect-[9/16] md:aspect-square rounded-xl overflow-hidden bg-muted group">
                            {data.thumbnail ? (
                                <Image
                                    src={data.thumbnail}
                                    alt={data.title || "Video thumbnail"}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    {t('noPreview')}
                                </div>
                            )}
                            {!isPro && (
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                                    <Timer className="w-3 h-3" />
                                    <span>Free Mode</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between py-2">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase border border-primary/20">
                                        {data.platform}
                                    </span>
                                    {isPro && (
                                        <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold uppercase flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> PRO
                                        </span>
                                    )}
                                    {data.author && (
                                        <span className="text-sm text-muted-foreground">{t('by', { author: data.author })}</span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-lg line-clamp-2 md:line-clamp-3">
                                    {data.title || "Social Media Video"}
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-6">
                                {/* Standard Video Download (Free with Timer, Pro Instant) */}
                                <Button
                                    onClick={() => handleDownloadClick('video', false)}
                                    className="w-full gap-2 bg-primary hover:bg-primary/80 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25 relative overflow-hidden group/btn"
                                >
                                    <Video className="h-4 w-4" />
                                    {t('downloadVideo')}
                                </Button>

                                {/* HD Video Download (Pro Only) */}
                                <Button
                                    onClick={() => handleDownloadClick('video', true)}
                                    className={`w-full gap-2 transition-all duration-300 hover:scale-105 border 
                                        ${isPro
                                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-transparent shadow-lg shadow-purple-500/25"
                                            : "bg-background/50 border-white/10 text-muted-foreground hover:bg-background/80"
                                        }`}
                                >
                                    {isPro ? <Sparkles className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                    Download HD
                                </Button>

                                {/* Audio Download */}
                                <Button
                                    variant="outline"
                                    onClick={() => handleDownloadClick('audio', false)}
                                    disabled={!data.audioUrl && data.platform === 'instagram'}
                                    className="col-span-2 w-full gap-2 border-white/10 bg-white/5 hover:bg-white/20 hover:scale-[1.02] transition-all duration-300 hover:border-white/30"
                                >
                                    <Music className="h-4 w-4" />
                                    {t('downloadAudio')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Timer Modal for Free Users */}
            <Dialog open={isTimerOpen} onOpenChange={(open) => { if (!open) setIsTimerOpen(false) }}>
                <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-center flex flex-col items-center gap-4">
                            <Timer className="w-12 h-12 text-primary animate-pulse" />
                            <span>{downloadReady ? "Download Ready!" : "Preparing Download..."}</span>
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            {downloadReady
                                ? "Your file is ready nicely baked."
                                : "Free users wait 20 seconds. Upgrade to Pro for instant downloads."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {!downloadReady ? (
                            <div className="space-y-2">
                                <div className="text-4xl font-bold text-center tabular-nums">{timeLeft}s</div>
                                <Progress value={((20 - timeLeft) / 20) * 100} className="h-2" />
                            </div>
                        ) : (
                            <Button onClick={handleTimerCompleteDownload} className="w-full bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-6 animate-in zoom-in duration-300">
                                Download Now
                            </Button>
                        )}

                        {!downloadReady && (
                            <div className="pt-4 border-t border-white/10">
                                <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary" onClick={() => router.push('/pricing')}>
                                    Skip the wait with Pro &rarr;
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
