import { ComponentObjectModel } from "#e2e/fixtures/base";
import { expect } from "#e2e/fixtures/expect";

export class Sidebar extends ComponentObjectModel {
  sidebar = this.page.getByRole("complementary");

  nav = this.sidebar.getByRole("navigation");

  menuButton = this.page.getByRole("button", { name: "Expand sidebar" });

  async open() {
    if ((await this.sidebar.getAttribute("aria-hidden")) === "true") {
      await this.menuButton.click();
    }

    await expect(this.sidebar).not.toHaveAttribute("aria-hidden", "true");
    await expect(this.sidebar).toBeInViewport();
  }

  getLinkByName(name: string) {
    return this.nav.getByRole("link", { name });
  }
}
