const express = require('express');

const https = require('https');

const http = require('http');

const app = express();

const PORT = process.env.PORT || 3000;

const TARGET_URL = process.env.TARGET_URL || 'https://teamspring23fe.onrender.com/';

const PING_INTERVAL = 14 * 60 * 1000;

function pingTarget() {

const url = new URL(TARGET_URL);

 const protocol = url.protocol === 'https:' ? https : http;

 

 const now = new Date().toLocaleString();

 console.log(`[${now}] Pinging: ${TARGET_URL}`);

 

 protocol.get(TARGET_URL, (res) => {
 console.log(`✓ Success! Status: ${res.statusCode}`);
 }).on('error', (err) => {

console.log(`✗ Failed: ${err.message}`);
 });

}

pingTarget();

setInterval(pingTarget, PING_INTERVAL);

app.get('/', (req, res) => {
 res.json({ 
 status: 'running',
 target: TARGET_URL,
 interval: '14 minutes'
 });

});

app.listen(PORT, () => {
 console.log(`🚀 Pinger service running on port ${PORT}`);
 console.log(`📍 Target: ${TARGET_URL}`);
 console.log(`⏰ Pinging every 14 minutes`);

});

