const ytdl = require('@distube/ytdl-core');

async function testYTDL(url) {
    console.log(`Testing URL: ${url}`);
    try {
        // Try basic info fetch
        console.log("Fetching info...");
        const info = await ytdl.getInfo(url);
        console.log("Title:", info.videoDetails.title);
        console.log("Formats found:", info.formats.length);

        const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
        console.log("Selected format URL:", format ? "Yes" : "No");

    } catch (e) {
        console.error("Basic Fetch Failed:", e.message);

        // experiment with agent
        console.log("\nRetrying with Agent options...");
        try {
            const agent = ytdl.createAgent([
                { name: "cookie", value: "YOUR_COOKIE_HERE" } // Placeholder
            ]);

            const info = await ytdl.getInfo(url, { agent });
            console.log("Agent Fetch Success!");
            console.log("Title:", info.videoDetails.title);
        } catch (e2) {
            console.error("Agent Fetch Failed:", e2.message);
        }
    }
}

testYTDL('https://www.youtube.com/watch?v=dQw4w9WgXcQ'); // Rick Roll as test
