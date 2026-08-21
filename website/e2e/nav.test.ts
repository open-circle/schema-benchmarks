import { createTest, expect } from "#e2e/fixtures";
import { Sidebar } from "#e2e/fixtures/components/sidebar.ts";

const test = createTest({ sidebar: Sidebar });

test.beforeEach("Go to homepage", async ({ page, fontsLoaded }) => {
  await page.goto("/");

  await fontsLoaded();
});

test("homepage is selected", { tag: "@smoke" }, async ({ sidebar }) => {
  await sidebar.open();

  await expect(sidebar.getLinkByName("Home")).toBeCurrent("page");
});

test("navigation links work", { tag: "@smoke" }, async ({ page, sidebar }) => {
  await sidebar.open();

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
    ["Libraries", "/libraries"],
    ["Blog", "/blog"],
  ] as const) {
    await test.step(`Navigate to ${name}`, async () => {
      const link = sidebar.getLinkByName(name);

      await link.click();

      await expect(page).toHaveURL((url) => url.pathname === path);

      await expect(link).toBeCurrent("page");
    });
  }
});
