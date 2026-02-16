import { serve } from "srvx";
import { serveStatic } from "srvx/static";

// @ts-expect-error untyped
import tanstackHandler from "./dist/server/server.js";

const server = serve({
  fetch: tanstackHandler.fetch,
  middleware: [serveStatic({ dir: "./dist/client" })],
});

await server.ready();

console.log(`Server ready at http://localhost:${server.url}`);
