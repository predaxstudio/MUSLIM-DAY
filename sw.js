importScripts('https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey: "AIzaSyABal1158Y5H-lmgMS5Lsfxx3wyr26VpAg",
  authDomain: "muslim-day-365.firebaseapp.com",
  projectId: "muslim-day-365",
  storageBucket: "muslim-day-365.firebasestorage.app",
  messagingSenderId: "220100633187",
  appId: "1:220100633187:web:256f3b20c00472ab308e56",
});
firebase.messaging(); // كيعرض الإشعارات اللي فيها notification payload وهو في الخلفية

const CACHE_NAME = 'salati-shell-v36';
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './version.js',
  './i18n.js',
  './script.js',
  './features.js',
  './features2.js',
  './features3.js',
  './quiet.js',
  './features4.js',
  './native.js',
  './notes.js',
  './notes.css',
  './azkar-data.js',
  './theme-init.js',
  './firebase-init.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/app-logo.png',
  './icons/hero-logo.png',
  './icons/icon-180.png',
  './icons/favicon-32.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // لا نتدخل أبدًا في الطلبات الخارجية: مواقيت الصلاة (AlAdhan)، خرائط المساجد (Overpass/OSM)، ملفات الأذان.
  // هذه يجب أن تبقى مباشرة من الشبكة دائمًا لتبقى دقيقة ومحدّثة.
  if (url.origin !== self.location.origin || req.method !== 'GET') {
    return;
  }

  // استراتيجية "الكاش أولاً مع تحديث في الخلفية" لملفات التطبيق الأساسية فقط
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

// أزرار إشعار الأذان المحلي: «إيقاف» و«صلّيت». نُبلغ الصفحة المفتوحة، وإلا نفتح التطبيق مع تسجيل الصلاة
self.addEventListener('notificationclick', (event) => {
  const n = event.notification;
  if(!n || n.tag !== 'salati-adhan') return;
  n.close();
  const prayer = (n.data && n.data.prayer) || null;
  event.waitUntil(
    self.clients.matchAll({ type:'window', includeUncontrolled:true }).then((list) => {
      if(event.action === 'stop'){ list.forEach((c) => c.postMessage({ type:'stop-adhan' })); return; }
      if(event.action === 'prayed' && prayer){
        if(list.length){ list.forEach((c) => c.postMessage({ type:'mark-prayed', prayer })); return; }
        return self.clients.openWindow('./?prayed=' + encodeURIComponent(prayer));
      }
      for(const c of list){ if('focus' in c) return c.focus(); }
      return self.clients.openWindow('./');
    })
  );
});
