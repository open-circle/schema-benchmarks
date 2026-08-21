import { ComponentObjectModel } from "#e2e/fixtures/base";
import { expect } from "#e2e/fixtures/expect";
import { getViewportRatio } from "#e2e/utils/index.ts";

export class Sidebar extends ComponentObjectModel {
  sidebar = this.page.getByRole("complementary");

  nav = this.sidebar.getByRole("navigation");

  menuButton = this.page.getByRole("button", { name: "Expand sidebar" });

  async open() {
    await expect(async () => {
      if ((await getViewportRatio(this.sidebar)) < 0.1) {
        await this.menuButton.click();
      }
      await expect(this.sidebar).toBeInViewport({ ratio: 0.1, timeout: 5000 });
    }).toPass();
  }

  getLinkByName(name: string) {
    return this.nav.getByRole("link", { name });
  }
}
