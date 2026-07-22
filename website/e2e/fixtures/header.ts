import { BasePOM } from "#e2e/fixtures/base";

export class Header extends BasePOM {
  public header = this.page.locator("header").first();
  public breadcrumbs = this.header.getByRole("navigation");
}
