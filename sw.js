const CACHE = "limco-1921a7bc78";
const ASSETS = ["./","./app.js","./apple-touch-icon.png","./config.js","./icon-192.png","./icon-512.png","./index.html","./manifest.webmanifest","./maskable-512.png","./noto-sans-georgian-georgian-400-normal.woff2","./noto-sans-georgian-georgian-500-normal.woff2","./noto-sans-georgian-georgian-600-normal.woff2","./noto-sans-georgian-georgian-700-normal.woff2","./noto-sans-georgian-latin-400-normal.woff2","./noto-sans-georgian-latin-500-normal.woff2","./noto-sans-georgian-latin-600-normal.woff2","./noto-sans-georgian-latin-700-normal.woff2","./noto-serif-georgian-georgian-600-normal.woff2","./noto-serif-georgian-georgian-700-normal.woff2","./noto-serif-georgian-latin-600-normal.woff2","./noto-serif-georgian-latin-700-normal.woff2","./style.css"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("limco-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // Firebase traffic goes straight to network
  if (req.mode === "navigate") {
    e.respondWith(caches.match("./index.html").then(r => r || fetch(req)));
    return;
  }
  // config.js: network first so a changed config is picked up, cache as fallback
  if (url.pathname.endsWith("/config.js")) {
    e.respondWith(fetch(req).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return res; }).catch(() => caches.match(req, { ignoreSearch: true })));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req)));
});
