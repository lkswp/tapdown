"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Link2, Loader2 } from "lucide-react"

interface DownloaderInputProps {
    onDownload: (url: string) => void
    isLoading: boolean
}

export function DownloaderInput({ onDownload, isLoading }: DownloaderInputProps) {
    const [url, setUrl] = useState("")

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

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
            <div className="relative flex items-center">
                <div className="absolute left-4 text-muted-foreground">
                    <Link2 className="h-5 w-5" />
                </div>
                <Input
                    type="url"
                    placeholder="Paste video URL here (TikTok, Instagram, etc.)"
                    className="h-14 pl-12 pr-32 rounded-2xl bg-secondary/50 border-white/10 backdrop-blur-md text-lg focus-visible:ring-primary/50 transition-all font-medium"
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
                            Paste
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
