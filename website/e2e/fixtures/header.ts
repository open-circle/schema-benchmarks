import type { Page } from "@playwright/test";

import { BasePOM } from "#e2e/fixtures/base";

export class Header extends BasePOM {
  constructor(
    page: Page,
    public header = page.locator("header").first(),
    public breadcrumbs = header.getByRole("navigation"),
  ) {
    super(page);
  }
}
