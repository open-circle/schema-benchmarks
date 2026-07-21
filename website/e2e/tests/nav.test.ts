import { test, expect } from "#e2e/fixtures";

test("homepage is selected", { tag: "@smoke" }, async ({ page, sidebar }) => {
  await page.goto("/");

  await sidebar.open();

  await expect(sidebar.getLinkByName("Home")).toBeCurrent("page");
});

test("navigation links work", { tag: "@smoke" }, async ({ page, sidebar }) => {
  await page.goto("/");
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

    await link.click({ timeout: 5000 });

    await expect(page).toHaveURL((url) => url.pathname === path);

    await expect(link).toBeCurrent("page");
  }
});
