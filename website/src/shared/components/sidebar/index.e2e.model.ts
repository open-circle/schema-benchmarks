import { ComponentObjectModel } from "#e2e/fixtures/base";
import { expect } from "#e2e/fixtures/expect";

export class Sidebar extends ComponentObjectModel {
  sidebar = this.page.getByRole("complementary");

  nav = this.sidebar.getByRole("navigation");

  menuButton = this.page.getByRole("button", { name: "Expand sidebar" });

  async open() {
    await expect(async () => {
      if (!(await this.sidebar.isVisible())) {
        await this.menuButton.click();
      }
      await expect(this.sidebar).toBeVisible({ timeout: 5000 });
    }).toPass();
  }

  getLinkByName(name: string) {
    return this.nav.getByRole("link", { name });
  }
}
