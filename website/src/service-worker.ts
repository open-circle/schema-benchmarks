/// <reference lib="webworker" />
import * as broadcast from "./features/broadcast/channel";

broadcast.worker.when("greeting").subscribe((payload) => {
  console.log("Received greeting:", payload);
  broadcast.worker.postMessage("response", "Hello from the service worker!");
});
