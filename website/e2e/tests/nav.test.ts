import { test, expect } from "#e2e/fixtures";

test("homepage is selected", async ({ page, sidebar }) => {
  await page.goto("/");

  await sidebar.open();

  await expect(sidebar.getLinkByName("Home")).toBeCurrent("page");
});

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
  test(`navigation link: ${name}`, async ({ page, sidebar }) => {
    await page.goto("/");

    await sidebar.open();

    const link = await sidebar.selectLinkByName(name);

    await expect(page).toHaveURL((url) => url.pathname === path);

    await expect(link).toBeCurrent("page");
  });
}
