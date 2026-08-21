import { createTest, expect } from "#e2e/fixtures";
import { Header } from "#src/shared/components/header/index.e2e.model";

import { BlogPage } from "./-index.e2e.model";

const test = createTest({ blogPage: BlogPage, header: Header });

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
