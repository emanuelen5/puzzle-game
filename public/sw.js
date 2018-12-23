const version = "0.1"
const cacheName = "sliding-puzzle-" + version

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js"
);

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  
  workbox.setConfig({ debug: true });
//   workbox.precaching.precacheAndRoute([
//   {
//     "url": "manifest.json"
//   },
//   {
//     "url": "js/client.js"
//   },
//   {
//     "url": "css/style.css"
//   },
//   {
//     "url": "views/index.html"
//   }
// ]);
  
  workbox.routing.registerNavigationRoute('/views/index.html');
  
  workbox.routing.registerRoute(
  /\.(?:js|css|json|html)$/,
  workbox.strategies.staleWhileRevalidate({
      // Use a custom cache name
      cacheName: cacheName
  }),
); 

  workbox.routing.registerRoute(
    // Cache image files
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    // Use the cache if it's available
    workbox.strategies.staleWhileRevalidate({
      // Use a custom cache name
      cacheName: cacheName,
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
