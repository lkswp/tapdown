const https = require('https');

function fetchInstances() {
    https.get('https://instances.cobalt.tools', (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            try {
                const instances = JSON.parse(body);
                console.log(`Found ${instances.length} instances.`);
                // Filter for healthy ones with high score
                const healthy = instances.filter(i => i.score === 100 && i.version.startsWith('10'));
                console.log('Healthy v10 instances:', healthy.map(h => h.url));
            } catch (e) {
                console.error('Failed to parse instances:', e);
                console.log('Body:', body);
            }
        });
    }).on('error', (e) => {
        console.error('Error fetching instances:', e);
    });
}

fetchInstances();
