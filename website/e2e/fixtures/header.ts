import { BasePOM } from "#e2e/fixtures/base";

export class Header extends BasePOM {
  header = this.page.locator("header").first();
  breadcrumbs = this.header.getByRole("navigation");
}
