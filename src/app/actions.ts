"use server"

// @ts-ignore
const { instagramGetUrl } = require("instagram-url-direct")
import ytdl from "@distube/ytdl-core"

export interface VideoData {
    url: string;
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

async function downloadYouTube(url: string): Promise<{ success: boolean; data?: VideoData; error?: string }> {
    try {
        if (!ytdl.validateURL(url)) {
            return { success: false, error: "Invalid YouTube URL" };
        }

        // Try to use an agent to avoid 403s
        const agent = ytdl.createAgent([
            { name: "cookie", value: "VISITOR_INFO1_LIVE=; YSC=;" }
        ]);

        const info = await ytdl.getInfo(url, { agent });
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });

        const thumbnail = info.videoDetails.thumbnails.length > 0
            ? info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url
            : "";

        return {
            success: true,
            data: {
                platform: 'youtube',
                url: format.url,
                thumbnail: thumbnail,
                title: info.videoDetails.title,
                author: info.videoDetails.author.name
            }
        };
    } catch (e: any) {
        console.error("YouTube Fetch Error Stack:", e.stack);
        console.error("YouTube Fetch Error Message:", e.message);
        return { success: false, error: `Failed to fetch from YouTube: ${e.message}` };
    }
}
