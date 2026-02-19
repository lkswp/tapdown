"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Link2, Loader2, Instagram, Facebook, Youtube, Twitter } from "lucide-react"
// Actually Lucide has Instagram, Facebook, Youtube, Twitter.
// TikTok is often missing. Use a generic Video icon or custom SVG for TikTok.
import { useTranslations } from "next-intl"

interface DownloaderInputProps {
    onDownload: (url: string) => void
    isLoading: boolean
}

export function DownloaderInput({ onDownload, isLoading }: DownloaderInputProps) {
    const t = useTranslations('Input')
    const [url, setUrl] = useState("")
    const [platform, setPlatform] = useState<string | null>(null)

    useEffect(() => {
        if (!url) {
            setPlatform(null)
            return
        }

        const lowerUrl = url.toLowerCase()
        if (lowerUrl.includes("tiktok.com")) setPlatform("tiktok")
        else if (lowerUrl.includes("instagram.com")) setPlatform("instagram")
        else if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) setPlatform("youtube")
        else if (lowerUrl.includes("facebook.com") || lowerUrl.includes("fb.watch")) setPlatform("facebook")
        else if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) setPlatform("twitter")
        else setPlatform("other")
    }, [url])

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setUrl(text)
        } catch (err) {
            console.error("Failed to read clipboard", err)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!url) return
        onDownload(url)
    }

    const getPlatformIcon = () => {
        switch (platform) {
            case "instagram": return <Instagram className="h-5 w-5 text-pink-500" />
            case "facebook": return <Facebook className="h-5 w-5 text-blue-500" />
            case "youtube": return <Youtube className="h-5 w-5 text-red-500" />
            case "twitter": return <Twitter className="h-5 w-5 text-white" />
            case "tiktok": return <svg className="h-5 w-5 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg> // Custom TikTok SVG
            default: return <Link2 className="h-5 w-5" />
        }
    }

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
            <div className="relative flex items-center group">
                <div className="absolute left-4 transition-colors duration-300 z-10">
                    {getPlatformIcon()}
                </div>
                <Input
                    type="url"
                    placeholder={t('placeholder')}
                    className="h-14 pl-12 pr-32 rounded-2xl bg-secondary/50 border-white/10 backdrop-blur-md text-lg focus-visible:ring-primary/50 transition-all font-medium group-hover:bg-secondary/70"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <div className="absolute right-2 flex items-center gap-2">
                    {!url && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground hidden sm:flex"
                            onClick={handlePaste}
                        >
                            {t('paste')}
                        </Button>
                    )}
                    <Button
                        type="submit"
                        size="icon"
                        className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-[0_0_20px_-5px_var(--primary)]"
                        disabled={isLoading || !url}
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                    </Button>
                </div>
            </div>
        </form>
    )
}
