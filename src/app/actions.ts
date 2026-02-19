"use server"

// @ts-ignore
import { TikTok, Instagram, YouTube, Twitter, Facebook } from "social-downloader-cherry";

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
        let result;
        let platform: VideoData['platform'] = 'other';

        if (cleanUrl.includes("tiktok.com")) {
            platform = 'tiktok';
            // TikTok.getVideo returns a promise with data
            const res = await TikTok.getVideo(cleanUrl);
            result = res?.data;
        } else if (cleanUrl.includes("instagram.com")) {
            platform = 'instagram';
            // Instagram.getAny returns a promise with data
            const res = await Instagram.getAny(cleanUrl);
            result = res?.data;
        } else if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be")) {
            platform = 'youtube';
            const res = await YouTube.getVideo(cleanUrl);
            result = res?.data;
        } else if (cleanUrl.includes("twitter.com") || cleanUrl.includes("x.com")) {
            platform = 'twitter';
            const res = await Twitter.getVideo(cleanUrl);
            result = res?.data;
        } else if (cleanUrl.includes("facebook.com")) {
            platform = 'facebook';
            const res = await Facebook.getVideo(cleanUrl);
            result = res?.data;
        } else {
            return { success: false, error: "Unsupported platform" };
        }

        if (!result) {
            return { success: false, error: "Failed to fetch video data" };
        }

        // Normalize data structure based on what the library returns
        // Note: The library returns different structures for different platforms.
        // We need to inspect the result to map it correctly.
        // For now, returning the raw result mapped to our structure as best as possible.

        return {
            success: true,
            data: {
                url: result.url || result.link || result.video || result.videoUrl || "", // Adjust based on actual API response
                thumbnail: result.thumbnail || result.cover || result.picture || "",
                title: result.title || result.text || result.caption || "",
                author: result.author || result.owner || "",
                platform
            }
        };

    } catch (error) {
        console.error("Download error:", error);
        return { success: false, error: "Failed to process URL. Please try again." };
    }
}
