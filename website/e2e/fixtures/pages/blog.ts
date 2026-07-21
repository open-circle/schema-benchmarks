import type { Page } from "@playwright/test";

import { BasePOM } from "../base";

export class BlogPage extends BasePOM {
  constructor(
    page: Page,
    public blogGrid = page.locator("main").getByRole("list"),
  ) {
    super(page);
  }

  getBlogCardByTitle(title: string) {
    return this.blogGrid.getByRole("listitem", { name: title });
  }
}
