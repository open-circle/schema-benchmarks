/// <reference lib="webworker" />
import * as broadcast from "./src/features/broadcast/channel";

broadcast.worker.addEventListener("greeting", (payload) => {
  console.log("Received greeting:", payload);
  broadcast.worker.postMessage("response", "Hello from the service worker!");
});
