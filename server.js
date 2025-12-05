const express = require('express');

const https = require('https');

const http = require('http');

const app = express();

const PORT = process.env.PORT || 3000;

const TARGET_URLS = [
    process.env.TARGET_URL_1 || 'https://teamspring23.onrender.com/api/buyer/farmers/search',
    process.env.TARGET_URL_2 || 'https://patternbackend.onrender.com/api/pattern'
];

const PING_INTERVAL = 10 * 60 * 1000;

function pingTarget(targetUrl) {
    const url = new URL(targetUrl);
    const protocol = url.protocol === 'https:' ? https : http;

    const now = new Date().toLocaleString();
    console.log(`[${now}] Pinging: ${targetUrl}`);

    const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'GET',
        headers: {
            'User-Agent': 'Koyeb-Pinger/1.0',
            'Accept': '*/*'
        },
        timeout: 30000
    };

    const req = protocol.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log(`✓ Success! ${targetUrl} - Status: ${res.statusCode} - Response length: ${data.length} bytes`);
        });
    });

    req.on('error', (err) => {
        console.log(`✗ Failed: ${targetUrl} - ${err.message}`);
    });

    req.on('timeout', () => {
        console.log(`⏱ Timeout: ${targetUrl} - Server took too long to respond`);
        req.destroy();
    });

    req.end();
}

function pingAllTargets() {
    TARGET_URLS.forEach(url => pingTarget(url));
}

pingAllTargets();

setInterval(pingAllTargets, PING_INTERVAL);

app.get('/', (req, res) => {
    res.json({
        status: 'running',
        targets: TARGET_URLS,
        interval: '10 minutes',
        nextPing: new Date(Date.now() + PING_INTERVAL).toLocaleString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Pinger service running on port ${PORT}`);
    console.log(`📍 Targets: ${TARGET_URLS.join(', ')}`);
    console.log(`⏰ Pinging every 10 minutes`);
});

