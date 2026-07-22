import { test, expect } from "#e2e/fixtures";

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
    ["Libraries", "/libraries"],
    ["Blog", "/blog"],
  ] as const) {
    const link = sidebar.getLinkByName(name);

    await link.click();

    await expect(page).toHaveURL((url) => url.pathname === path);

    await expect(link).toBeCurrent("page");
  }
});
