import { ComponentObjectModel } from "#e2e/fixtures/base";
import { expect } from "#e2e/fixtures/expect";

export class Sidebar extends ComponentObjectModel {
  sidebar = this.page.getByRole("complementary");

  nav = this.sidebar.getByRole("navigation");

  menuButton = this.page.getByRole("button", { name: "Expand sidebar" });

  async open() {
    await expect(async () => {
      if ((await this.sidebar.getAttribute("aria-hidden")) === "true") {
        await this.menuButton.click();
      }
      await expect(this.sidebar).toBeVisible({ timeout: 5000 });
      await expect(this.sidebar).not.toHaveAttribute("aria-hidden", "true");
    }).toPass({ timeout: 5000 });
  }

  getLinkByName(name: string) {
    return this.nav.getByRole("link", { name });
  }
}
