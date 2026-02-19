"use server"

// @ts-ignore
const { instagramGetUrl } = require("instagram-url-direct")
import ytdl from "@distube/ytdl-core"

export interface VideoData {
    url: string;
    hdUrl?: string; // New field for HD download
    audioUrl?: string; // New field for audio download
    thumbnail?: string;
    title?: string;
    author?: string;
    platform: 'tiktok' | 'instagram' | 'youtube' | 'twitter' | 'facebook' | 'other';
}

export async function getSocialVideo(url: string): Promise<{ success: boolean; data?: VideoData; error?: string }> {
    try {
        const cleanUrl = url.trim();

        if (cleanUrl.includes("tiktok.com")) {
            return await downloadTikTok(cleanUrl);
        } else if (cleanUrl.includes("instagram.com")) {
            return await downloadInstagram(cleanUrl);
        } else if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be")) {
            return await downloadYouTube(cleanUrl);
        } else {
            return { success: false, error: "Unsupported platform" };
        }

    } catch (error) {
        console.error("Download error:", error);
        return { success: false, error: "Failed to process URL. Please try again." };
    }
}

async function downloadTikTok(url: string): Promise<{ success: boolean; data?: VideoData; error?: string }> {
    try {
        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
        const response = await fetch(apiUrl);
        const json = await response.json();

        if (json.code === 0) {
            return {
                success: true,
                data: {
                    platform: 'tiktok',
                    url: json.data.play,
                    hdUrl: json.data.hdplay,
                    audioUrl: json.data.music, // TikTok provides audio URL
                    thumbnail: json.data.cover,
                    title: json.data.title,
                    author: json.data.author?.nickname || json.data.author?.unique_id
                }
            };
        } else {
            return { success: false, error: json.msg || "TikTok API error" };
        }
    } catch (e) {
        console.error("TikTok Fetch Error:", e);
        return { success: false, error: "Failed to fetch from TikTok" };
    }
}

async function downloadInstagram(url: string): Promise<{ success: boolean; data?: VideoData; error?: string }> {
    try {
        const result = await instagramGetUrl(url);

        if (result && result.url_list && result.url_list.length > 0) {
            const videoUrl = result.url_list[0];
            return {
                success: true,
                data: {
                    platform: 'instagram',
                    url: videoUrl,
                    // Instagram doesn't provide separate audio URL easily
                    thumbnail: "",
                    title: "Instagram Reel",
                    author: "Instagram User"
                }
            };
        } else {
            return { success: false, error: "No video found in Instagram link" };
        }
    } catch (e: any) {
        console.error("Instagram Fetch Error:", e);
        return { success: false, error: `Failed to fetch from Instagram: ${e.message || "Unknown error"}` };
    }
}

// Helper to fetch from Cobalt API
async function downloadFromCobalt(url: string, quality: '480' | 'max' = 'max', isAudioOnly: boolean = false): Promise<string | undefined> {
    try {
        const response = await fetch("https://api.cobalt.tools/api/json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "User-Agent": "TapDown/1.0"
            },
            body: JSON.stringify({
                url: url,
                vQuality: quality,
                isAudioOnly: isAudioOnly,
            })
        });

        const data = await response.json();
        if (data.status === "error" || !data.url) {
            console.error(`Cobalt API error for ${quality}:`, data);
            return undefined;
        }
        return data.url;
    } catch (e) {
        console.error(`Cobalt Fetch Error (${quality}):`, e);
        return undefined;
    }
}

async function downloadYouTube(url: string): Promise<{ success: boolean; data?: VideoData; error?: string }> {
    try {
        // Cobalt handles validation, but we can keep a basic check
        if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
            return { success: false, error: "Invalid YouTube URL" };
        }

        // Parallel fetch for SD, HD, and Audio to make it fast
        const [sdUrl, hdUrl, audioUrl] = await Promise.all([
            downloadFromCobalt(url, '480'),
            downloadFromCobalt(url, 'max'),
            downloadFromCobalt(url, 'max', true)
        ]);

        if (!sdUrl && !hdUrl) {
            return { success: false, error: "Failed to fetch video from Cobalt API. Content might be restricted." };
        }

        // We need metadata. Cobalt returns it sometimes, but let's try to get basic info if possible or use fallbacks
        // Since we are ditching ytdl, we might lose some metadata if Cobalt doesn't provide it in this endpoint mode.
        // For now, let's return generic title if missing, or we can use ytdl JUST for metadata (lightweight) if it works, 
        // but ytdl getInfo might also be blocked. Let's assume Cobalt works for now.

        // Note: Cobalt's /api/json response doesn't always strictly return metadata in the simple mode. 
        // We will mock the title/author if missing for now to prioritize the download working.

        return {
            success: true,
            data: {
                platform: 'youtube',
                url: sdUrl || hdUrl!, // safe fallback
                hdUrl: hdUrl || sdUrl,
                audioUrl: audioUrl,
                thumbnail: `https://img.youtube.com/vi/${getVideoId(url)}/hqdefault.jpg`, // Manual thumbnail
                title: "YouTube Video", // Cobalt doesn't always give this in simple JSON mode
                author: "YouTube Creator"
            }
        };
    } catch (e: any) {
        console.error("YouTube Fetch Error:", e);
        return { success: false, error: "Failed to process YouTube video." };
    }
}

function getVideoId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
