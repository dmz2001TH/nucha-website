// Service Worker - empty placeholder
// Prevents 404 errors from browser auto-detection via manifest.json
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())
