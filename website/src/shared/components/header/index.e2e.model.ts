import { ComponentObjectModel } from "#e2e/fixtures/base";

export class Header extends ComponentObjectModel {
  header = this.page.locator("header").first();
  breadcrumbs = this.header.getByRole("navigation");
}
