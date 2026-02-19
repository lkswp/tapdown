"use server"

// @ts-ignore
const { instagramGetUrl } = require("instagram-url-direct")
const YTDlpWrap = require('yt-dlp-wrap').default;
const path = require('path');
// import ytdl from "@distube/ytdl-core" // Removed

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
        console.log(`Downloading YouTube video with yt-dlp: ${url}`);

        // Locate yt-dlp binary
        const binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
        const binaryPath = path.join(process.cwd(), 'bin', binaryName);

        const ytDlpWrap = new YTDlpWrap(binaryPath);

        // Use Node.js as the JS runtime
        const nodePath = process.execPath;

        const args = [
            url,
            '--dump-json',
            '--no-playlist',
            '--js-runtimes', `node:${nodePath}`
        ];

        // Ensure we retrieve formats that have both video and audio if possible (pre-merged)
        // or just rely on 'best' which might be pre-merged 720p/360p.
        // We'll let yt-dlp decide default best, and we pick from available formats in JSON.

        const stdout = await ytDlpWrap.execPromise(args);
        const metadata = JSON.parse(stdout);

        if (!metadata) {
            return { success: false, error: "Failed to fetch video metadata from yt-dlp." };
        }

        // Find best format with video+audio
        // mp4 preferred for compatibility
        let formats = metadata.formats || [];

        // 1. Try to find a format with both vcodec and acodec (pre-merged)
        let bestFormat = formats.find((f: any) => f.vcodec !== 'none' && f.acodec !== 'none' && f.ext === 'mp4' && (f.format_id === '22' || f.height >= 720)); // HD 720p

        if (!bestFormat) {
            // Fallback to SD with audio
            bestFormat = formats.find((f: any) => f.vcodec !== 'none' && f.acodec !== 'none' && f.ext === 'mp4');
        }

        // If still nothing, take ANY format with both
        if (!bestFormat) {
            bestFormat = formats.find((f: any) => f.vcodec !== 'none' && f.acodec !== 'none');
        }

        // 2. Find audio only format
        const audioFormat = formats.find((f: any) => f.acodec !== 'none' && f.vcodec === 'none' && (f.ext === 'm4a' || f.ext === 'mp3'));

        if (!bestFormat) {
            return { success: false, error: "No suitable video format found." };
        }

        return {
            success: true,
            data: {
                platform: 'youtube',
                url: bestFormat.url,
                hdUrl: bestFormat.url, // yt-dlp usually gives best available as single file
                audioUrl: audioFormat?.url,
                thumbnail: metadata.thumbnail,
                title: metadata.title,
                author: metadata.uploader
            }
        };

    } catch (e: any) {
        console.error("YouTube Fetch Error (yt-dlp):", e);
        // Clean up error message
        const msg = e.stderr || e.message || "Unknown error";
        return { success: false, error: `Failed to process YouTube video.` };
    }
}

function getVideoId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
