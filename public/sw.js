importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js"
);

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  
  workbox.setConfig({ debug: true });
  workbox.precaching.precacheAndRoute([
  {
    "url": "manifest.json",
    "revision": "710e5b639b8dcad0bac52233be661c08"
  },
  {
    "url": "js/client.js",
    "revision": "e5dc0c1438f5adc4c363d5fd96523851"
  },
  {
    "url": "css/style.css",
    "revision": "3252195698027fce397b36b06fc44110"
  },
  {
    "url": "views/index.html",
    "revision": "f5b2dada82a9999b5b2b2d73b04a8a0a"
  }
]);

  // workbox.routing.registerRoute(
  //   new RegExp(".*.(js|html|css)"),
  //   workbox.strategies.networkFirst()
  // );
  
  workbox.routing.registerNavigationRoute('/views/index.html');

  workbox.routing.registerRoute(
    // Cache image files
    "https://cdn.glitch.com/b1283791-ff27-4ee5-b9cb-906713391a97%2FIMG_20180826_104348.jpg?1537214398686",
    // Use the cache if it's available
    workbox.strategies.staleWhileRevalidate({
      // Use a custom cache name
      cacheName: "image-cache",
      plugins: [
        new workbox.expiration.Plugin({
          // Cache only 20 images
          maxEntries: 20,
          // Cache for a maximum of a week
          maxAgeSeconds: 7 * 24 * 60 * 60
        })
      ]
    })
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
