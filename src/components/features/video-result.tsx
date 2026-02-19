"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Music, Video } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

interface VideoResultProps {
    data: {
        url: string
        thumbnail?: string
        title?: string
        author?: string
        platform: string
    }
}

export function VideoResult({ data }: VideoResultProps) {
    const handleDownload = async (usage: 'video' | 'audio') => {
        // For audio, we would ideally need a separate URL or transcoding. 
        // For MVP, we'll just download the video file but name it appropriately if the user asked for audio (though it will still be mp4 unless converted).
        // TODO: proper audio extraction

        const ext = usage === 'audio' ? 'mp3' : 'mp4';
        const filename = `tapdown-${data.platform}-${Date.now()}.${ext}`;

        // Use the proxy endpoint to force download
        // Encode URL to ensure special characters don't break the query param
        const downloadUrl = `/api/download?url=${encodeURIComponent(data.url)}&filename=${filename}`;

        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', filename); // This attribute is often ignored for cross-origin, hence the proxy
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto mt-8"
        >
            <Card className="bg-background/40 backdrop-blur-xl border-white/10 overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative w-full md:w-48 aspect-[9/16] md:aspect-square rounded-xl overflow-hidden bg-muted">
                            {data.thumbnail ? (
                                <Image
                                    src={data.thumbnail}
                                    alt={data.title || "Video thumbnail"}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    No Preview
                                </div>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between py-2">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase border border-primary/20">
                                        {data.platform}
                                    </span>
                                    {data.author && (
                                        <span className="text-sm text-muted-foreground">by {data.author}</span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-lg line-clamp-2 md:line-clamp-3">
                                    {data.title || "Social Media Video"}
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <Button
                                    onClick={() => handleDownload('video')}
                                    className="w-full gap-2 bg-primary hover:bg-primary/90"
                                >
                                    <Video className="h-4 w-4" />
                                    Download Video
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleDownload('audio')}
                                    className="w-full gap-2 border-white/10 bg-white/5 hover:bg-white/10"
                                >
                                    <Music className="h-4 w-4" />
                                    Download Audio
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
