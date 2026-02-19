const YTDlpWrap = require('yt-dlp-wrap').default;
const fs = require('fs');
const path = require('path');

// Ensure bin directory exists
const binDir = path.join(__dirname, 'bin');
if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir);
}

const binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
const binaryPath = path.join(binDir, binaryName);

console.log(`Downloading latest yt-dlp binary to ${binaryPath}...`);

// Get the latest release from GitHub
YTDlpWrap.downloadFromGithub(binaryPath).then(() => {
    console.log('Success! yt-dlp downloaded.');

    // Make executable on Linux/Mac
    if (process.platform !== 'win32') {
        fs.chmodSync(binaryPath, '755');
    }
}).catch(err => {
    console.error('Error downloading yt-dlp:', err);
});
