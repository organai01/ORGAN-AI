# ORGAN AI - Local Network Server (Node.js edition)
# Run this script to serve the website on your local WiFi network
# Your phone must be on the SAME WiFi as this computer

$webRoot = "c:\Users\utsab\.antigravity\ai-tools-hub"
$port    = 8181

# Get local WiFi IP address
$localIP = (Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*" } |
    Sort-Object PrefixLength |
    Select-Object -First 1).IPAddress

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   ORGAN AI - Server Running!" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Local (PC):   " -NoNewline -ForegroundColor Gray
Write-Host "http://localhost:$port" -ForegroundColor Green
Write-Host ""
Write-Host "  Phone URL:    " -NoNewline -ForegroundColor Gray
Write-Host "http://${localIP}:$port" -ForegroundColor Yellow
Write-Host ""
Write-Host "  -> Open the phone URL on your device" -ForegroundColor White
Write-Host "  -> Your phone must be on the same WiFi!" -ForegroundColor White
Write-Host ""
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Open browser on local machine
Start-Process "http://localhost:$port"

# Use Node.js built-in server (no admin rights, no packages needed)
node -e @"
const http = require('http');
const fs   = require('fs');
const path = require('path');

const ROOT = String.raw``$webRoot``;
const PORT = $port;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
};

http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';
  const file = path.join(ROOT, urlPath);
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('404 Not Found');
      console.log('  [404]', req.url);
      return;
    }
    const ext  = path.extname(file).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, {'Content-Type': mime, 'Access-Control-Allow-Origin': '*'});
    res.end(data);
    console.log('  [OK] ', req.url);
  });
}).listen(PORT, '0.0.0.0', () => {
  console.log('Node.js server listening on port ' + PORT);
});
"@
