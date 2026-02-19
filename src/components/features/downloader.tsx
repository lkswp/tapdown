"use client"

import { useState } from "react"
import { DownloaderInput } from "./downloader-input"
import { VideoResult } from "./video-result"
import { getSocialVideo } from "@/app/actions"
import type { VideoData } from "@/app/actions"
import { toast } from "sonner" // We might need to install sonner, but let's use standard alerts or install it next

export function Downloader() {
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
                // Handle error (e.g., show toast)
                console.error(response.error)
                alert(response.error || "Something went wrong")
            }
        } catch (error) {
            console.error(error)
            alert("An unexpected error occurred")
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
