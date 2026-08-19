import { test, expect } from "#e2e/fixtures";

test.beforeEach("Go to blog page", async ({ blogPage, fontsLoaded }) => {
  await blogPage.goto();

  await fontsLoaded();
});

test(
  "should navigate to blog post when clicking on card",
  { tag: "@smoke" },
  async ({ blogPage, page, header }) => {
    const card = blogPage.getBlogCardByTitle("Welcome");

    await expect(card).toBeVisible();

    await card.click();

    await expect(page).toHaveURL("/blog/welcome");

    await expect(header.breadcrumbs.getByText("Welcome").filter({ visible: true })).toBeVisible();
  },
);
