import { createTest, expect } from "#e2e/fixtures";

import { Sidebar } from "./index.e2e.model";

const test = createTest({ sidebar: Sidebar });

test.beforeEach("Go to homepage", async ({ page, fontsLoaded }) => {
  await page.goto("/");

  await fontsLoaded();
});

test("homepage is selected", { tag: "@smoke" }, async ({ sidebar }) => {
  await sidebar.open();

  await expect(sidebar.getLinkByName("Home")).toBeCurrent("page", { timeout: 15_000 });
});

test("navigation links work", { tag: "@smoke" }, async ({ page, sidebar }) => {
  test.setTimeout(120_000);

  for (const [name, path] of [
    ["Download", "/download"],
    ["Initialization", "/initialization"],
    ["Validation", "/validation"],
    ["Parsing", "/parsing"],
    ["Codec", "/codec"],
    ["Standard Schema", "/standard"],
    ["String", "/string"],
    ["Stack", "/stack"],
    ["Schema to Json", "/json-schema/to-json/matrix"],
    ["Json to Schema", "/json-schema/from-json"],
    ["Compliance", "/json-schema/compliance/validation"],
    ["TypeScript", "/typescript"],
    ["Libraries", "/libraries"],
    ["Blog", "/blog"],
  ] as const) {
    await test.step(`Navigate to ${name}`, async () => {
      await sidebar.open();

      const link = sidebar.getLinkByName(name);

      await link.click();

      await expect(page).toHaveURL((url) => url.pathname === path, { timeout: 30_000 });

      await expect(link).toBeCurrent("page", { timeout: 30_000 });
    });
  }
});
