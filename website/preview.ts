import express from "express";
import { toNodeHandler } from "srvx/node";

const PORT = Number.parseInt(process.env.PORT || "3000", 10);

// Create express app
const app = express();

// Import the prebuilt SSR handler from the production build.
// @ts-expect-error untyped
const { default: handler } = await import("./dist/server/server.js");

// Convert TanStack Start's fetch-style handler to an Express handler.
const nodeHandler = toNodeHandler(handler.fetch);

// Serve static assets (JS, CSS, images) from the built client directory.
app.use(express.static("dist/client"));

// Handle all other requests via SSR.
// Any request not matched by static assets will be rendered
// using the TanStack Start server handler.
app.use(async (req, res, next) => {
  try {
    await nodeHandler(req, res);
  } catch (error) {
    next(error);
  }
});

// Boot server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
