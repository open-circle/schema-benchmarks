import { test } from "./test";

test.beforeEach("Mock external download APIs", async ({ context }) => {
  await context.route("https://api.npmjs.org/downloads/point/last-week/**", (route) =>
    route.fulfill({ json: { downloads: 0 } }),
  );

  await context.route("https://api.jsr.io/scopes/**/downloads", (route) =>
    route.fulfill({ json: { total: [] } }),
  );
});

export { test } from "./test";
export { expect } from "./expect";
