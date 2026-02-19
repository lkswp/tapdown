const https = require('https');

function testTikWM(videoUrl) {
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}&hd=1`;

    https.get(apiUrl, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log(`Status: ${res.statusCode}`);
            try {
                const json = JSON.parse(body);
                console.log('Success:', json.code === 0);
                if (json.data) {
                    console.log('Video URL:', json.data.play);
                    console.log('Title:', json.data.title);
                } else {
                    console.log('Response:', json);
                }
            } catch (e) {
                console.error('Failed to parse JSON');
                console.log('Body:', body);
            }
        });
    }).on('error', (e) => {
        console.error(`Error: ${e.message}`);
    });
}

console.log("Testing TikWM with TikTok URL...");
testTikWM('https://www.tiktok.com/@tiktok/video/7106603000624565546');
