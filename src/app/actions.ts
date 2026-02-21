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
        } else if (
            cleanUrl.includes("youtube.com") ||
            cleanUrl.includes("youtu.be") ||
            cleanUrl.includes("twitter.com") ||
            cleanUrl.includes("x.com") ||
            cleanUrl.includes("facebook.com") ||
            cleanUrl.includes("fb.watch")
        ) {
            return await downloadYtDlp(cleanUrl);
        } else {
            return { success: false, error: "Unsupported platform or invalid URL." };
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
    } catch (e: any) {
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

async function downloadYtDlp(url: string): Promise<{ success: boolean; data?: VideoData; error?: string }> {
    try {
        console.log(`Downloading video with yt-dlp: ${url}`);

        // Ascertain platform for frontend icon/display
        let currentPlatform: VideoData['platform'] = 'other';
        if (url.includes('youtube.com') || url.includes('youtu.be')) currentPlatform = 'youtube';
        if (url.includes('twitter.com') || url.includes('x.com')) currentPlatform = 'twitter';
        if (url.includes('facebook.com') || url.includes('fb.watch')) currentPlatform = 'facebook';

        // Locate yt-dlp binary
        const binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
        const binaryPath = path.join(process.cwd(), 'bin', binaryName);

        const ytDlpWrap = new YTDlpWrap(binaryPath);
        const nodePath = process.execPath;

        const args = [
            url,
            '--dump-json',
            '--no-playlist',
            '--js-runtimes', `node:${nodePath}`
        ];

        const stdout = await ytDlpWrap.execPromise(args);
        const metadata = JSON.parse(stdout);

        if (!metadata) {
            return { success: false, error: "Failed to fetch video metadata from yt-dlp." };
        }

        let formats = metadata.formats || [];

        // Simple format selection logic that works universally:
        // 1. Try to find a pre-merged mp4 with video and audio
        let bestFormat = formats.find((f: any) => f.vcodec !== 'none' && f.acodec !== 'none' && f.ext === 'mp4' && (f.format_id === '22' || f.height >= 720));

        if (!bestFormat) {
            bestFormat = formats.find((f: any) => f.vcodec !== 'none' && f.acodec !== 'none' && f.ext === 'mp4');
        }

        // 2. If no pre-merged mp4, try ANY pre-merged
        if (!bestFormat) {
            bestFormat = formats.find((f: any) => f.vcodec !== 'none' && f.acodec !== 'none');
        }

        // 3. Twitter/Facebook sometimes just return a single url as 'url' in metadata, or formats with just 'video'
        if (!bestFormat && metadata.url) {
            bestFormat = { url: metadata.url }; // Fallback for simple structures
        }

        // 4. If all else fails, just find the first thing that has a video codec
        if (!bestFormat) {
            bestFormat = formats.find((f: any) => f.vcodec !== 'none');
        }

        const audioFormat = formats.find((f: any) => f.acodec !== 'none' && f.vcodec === 'none' && (f.ext === 'm4a' || f.ext === 'mp3'));

        if (!bestFormat || !bestFormat.url) {
            return { success: false, error: "No suitable video format could be found for this link." };
        }

        return {
            success: true,
            data: {
                platform: currentPlatform,
                url: bestFormat.url,
                hdUrl: bestFormat.url,
                audioUrl: audioFormat?.url,
                thumbnail: metadata.thumbnail,
                title: metadata.title || `${currentPlatform} Video`,
                author: metadata.uploader || metadata.channel || "Unknown Author"
            }
        };

    } catch (e: any) {
        console.error("yt-dlp Fetch Error:", e);
        const errorString = e.stderr || e.message;

        let userFacingError = `Failed to process ${url}.`;
        if (errorString.includes("No video could be found in this tweet")) {
            userFacingError = "No video could be found in this Twitter/X link.";
        } else if (errorString.includes("Requested format is not available")) {
            userFacingError = "The requested video format is not available.";
        } else if (errorString.includes("Private video") || errorString.includes("Login required")) {
            userFacingError = "This video is private or requires login.";
        }

        return { success: false, error: userFacingError };
    }
}

function getVideoId(url: any) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
