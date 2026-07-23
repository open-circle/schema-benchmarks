import { serve } from "srvx";
import { staticMiddleware } from "srvx/static";

// @ts-expect-error untyped
import tanstackHandler from "./dist/server/server.js";

const server = serve({
  fetch: tanstackHandler.fetch,
  middleware: [staticMiddleware({ dir: "./dist/client" })],
});

await server.ready();

console.log(`Server ready at ${server.url}`);
