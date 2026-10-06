import { serve } from "srvx";
import { staticMiddleware } from "srvx/static";

import tanstackHandler from "./dist/server/server.js";

const server = serve({
  // oxlint-disable-next-line typescript/unbound-method
  fetch: tanstackHandler.fetch,
  middleware: [staticMiddleware({ dir: "./dist/client" })],
});

await server.ready();

console.log(`Server ready at ${server.url}`);
