const https = require('https');

function testCobalt(videoUrl) {
    const data = JSON.stringify({
        url: videoUrl
    });

    const options = {
        hostname: 'api.cobalt.tools',
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://cobalt.tools/',
            'Origin': 'https://cobalt.tools'
        }
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log(`[api.cobalt.tools] Status: ${res.statusCode}`);
            console.log('Headers:', res.headers);
            console.log('Body:', body);
            try {
                const json = JSON.parse(body);
                console.log('Parsed:', json);
            } catch (e) {
                console.error('Failed to parse JSON');
            }
        });
    });

    req.on('error', (e) => {
        console.error(`Error: ${e.message}`);
    });

    req.write(data);
    req.end();
}

console.log("Testing Cobalt with Origin/Referer headers...");
testCobalt('https://www.tiktok.com/@tiktok/video/7106603000624565546');
