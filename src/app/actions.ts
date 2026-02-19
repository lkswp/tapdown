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

async function downloadYouTube(url: string): Promise<{ success: boolean; data?: VideoData; error?: string }> {
    try {
        if (!ytdl.validateURL(url)) {
            return { success: false, error: "Invalid YouTube URL" };
        }

        // Use a real browser User-Agent to avoid "Sign in to confirm you’re not a bot"
        const requestOptions = {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
            }
        };

        const info = await ytdl.getInfo(url, { requestOptions });

        // SD Quality: Prefer 360p or 480p (itag 18 is usually 360p/MP4)
        // We use 'lowest' as a fallback to ensure it's distinct from HD
        let sdFormat = ytdl.chooseFormat(info.formats, { quality: '18' });
        if (!sdFormat) {
            sdFormat = ytdl.chooseFormat(info.formats, { quality: 'lowestvideo' });
        }

        // HD Quality: Highest available video
        const hdFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });

        // Audio
        const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });

        const thumbnail = info.videoDetails.thumbnails.length > 0
            ? info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url
            : "";

        return {
            success: true,
            data: {
                platform: 'youtube',
                url: sdFormat ? sdFormat.url : hdFormat.url, // Fallback to HD if SD not found
                hdUrl: hdFormat.url,
                audioUrl: audioFormat ? audioFormat.url : undefined,
                thumbnail: thumbnail,
                title: info.videoDetails.title,
                author: info.videoDetails.author.name
            }
        };
    } catch (e: any) {
        console.error("YouTube Fetch Error Stack:", e.stack);
        console.error("YouTube Fetch Error Message:", e.message);

        // Retry logic or friendly error
        if (e.message.includes("Sign in")) {
            return { success: false, error: "YouTube is currently rate-limiting this server. Please try again later or use a different video." };
        }

        return { success: false, error: `Failed to fetch from YouTube: ${e.message}` };
    }
}
