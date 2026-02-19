const instagramlib = require("instagram-url-direct");

async function testInsta(url) {
    console.log(`Testing Instagram URL: ${url}`);
    try {
        // Based on previous output: { instagramGetUrl: [AsyncFunction: instagramGetUrl] }
        const result = await instagramlib.instagramGetUrl(url);
        console.log("Result:", JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("Instagram Fetch Failed:", e.message);
    }
}

testInsta('https://www.instagram.com/reel/C8_1a2bC3dE/'); 
