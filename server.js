const express = require('express');

const https = require('https');

const http = require('http');

const app = express();

const PORT = process.env.PORT || 3000;

// Add multiple target URLs here
const TARGET_URLS = [
  process.env.TARGET_URL_1 || 'https://teamspring23fe.onrender.com/',
  process.env.TARGET_URL_2 || 'https://patternpage.netlify.app/'
];

const PING_INTERVAL = 14 * 60 * 1000;

function pingTarget(targetUrl) {
  const url = new URL(targetUrl);
  const protocol = url.protocol === 'https:' ? https : http;
  
  const now = new Date().toLocaleString();
  console.log(`[${now}] Pinging: ${targetUrl}`);
  
  protocol.get(targetUrl, (res) => {
    console.log(`✓ Success! ${targetUrl} - Status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.log(`✗ Failed: ${targetUrl} - ${err.message}`);
  });
}

function pingAllTargets() {
  TARGET_URLS.forEach(url => pingTarget(url));
}

// Ping immediately on startup
pingAllTargets();

// Ping every 14 minutes
setInterval(pingAllTargets, PING_INTERVAL);

app.get('/', (req, res) => {
  res.json({ 
    status: 'running',
    targets: TARGET_URLS,
    interval: '14 minutes',
    nextPing: new Date(Date.now() + PING_INTERVAL).toLocaleString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Pinger service running on port ${PORT}`);
  console.log(`📍 Targets: ${TARGET_URLS.join(', ')}`);
  console.log(`⏰ Pinging every 14 minutes`);
});

