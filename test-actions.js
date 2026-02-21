require('ts-node').register();
const { getSocialVideo } = require('./src/app/actions.ts');

async function test() {
    console.log("Testing YouTube...");
    const res = await getSocialVideo("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    console.log(JSON.stringify(res, null, 2));

    console.log("\nTesting Twitter (Video)...");
    const res2 = await getSocialVideo("https://twitter.com/SpaceX/status/1780775928810848039");
    console.log(JSON.stringify(res2, null, 2));
}

test();
