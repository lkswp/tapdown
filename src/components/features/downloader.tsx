"use client"

import { useState } from "react"
import { DownloaderInput } from "./downloader-input"
import { VideoResult } from "./video-result"
import { getSocialVideo } from "@/app/actions"
import type { VideoData } from "@/app/actions"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export function Downloader() {
    const t = useTranslations('Errors')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<VideoData | null>(null)

    const handleDownload = async (url: string) => {
        setLoading(true)
        setResult(null)

        try {
            const response = await getSocialVideo(url)

            if (response.success && response.data) {
                setResult(response.data)
            } else {
                console.error(response.error)
                toast.error(response.error || t('general'))
            }
        } catch (error) {
            console.error(error)
            toast.error(t('general'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full space-y-8">
            <DownloaderInput onDownload={handleDownload} isLoading={loading} />
            {result && <VideoResult data={result} />}
        </div>
    )
}
