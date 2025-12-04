/// <reference lib="webworker" />
const broadcastChannel = new BroadcastChannel("benchmarks");
broadcastChannel.addEventListener("message", (event) => {
  console.log("Received message:", event.data);
  broadcastChannel.postMessage("Hello from the service worker!");
});
