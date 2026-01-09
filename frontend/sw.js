self.addEventListener("install", event => {
  console.log("Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log("Service Worker activated");
});

self.addEventListener("push", event => {
  const data = event.data?.json() || {};

  self.registration.showNotification(data.title || "Daily Quote", {
    body: data.body || "Your daily quote is ready",
    icon: "/icon.png"
  });
});
