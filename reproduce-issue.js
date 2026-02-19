const { TikTok, Instagram, YouTube } = require('social-downloader-cherry');

async function testDownload() {
    console.log("Testing TikTok download...");
    try {
        // Using the URL from the library's own test file
        const tiktokUrl = 'https://www.tiktok.com/@lucas_automobile/video/6923946880527289605';
        const res = await TikTok.getVideo(tiktokUrl);
        console.log("TikTok Result:", res);
    } catch (error) {
        console.error("TikTok Error:", error);
    }

    console.log("\nTesting Instagram download...");
    try {
        // Just a random recent reel or the one from test.js if available (test.js uses 'jlo' for stories)
        // Let's try a reel URL format
        const instaUrl = 'https://www.instagram.com/reel/C8_1a2bC3dE/'; // Dummy URL pattern, likely 404 but checking error format
        const res = await Instagram.getAny(instaUrl);
        console.log("Instagram Result:", res);
    } catch (error) {
        console.error("Instagram Error:", error);
    }
}

testDownload();
