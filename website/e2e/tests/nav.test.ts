import { test, expect } from "../fixtures";

test("homepage is selected", async ({ page, sidebar }) => {
  await page.goto("/");

  await expect(sidebar.getLinkByName("Home")).toBeCurrent("page");
});

test("navigation links are correct", async ({ page, sidebar }) => {
  await page.goto("/");

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
  ]) {
    const link = sidebar.getLinkByName(name);
    await link.click();
    await expect(page).toHaveURL((url) => url.pathname === path);
    await expect(link).toBeCurrent("page");
  }
});
