import { BasePOM } from "#e2e/fixtures/base";

import { expect } from ".";

export class Sidebar extends BasePOM {
  sidebar = this.page.getByRole("complementary");

  nav = this.sidebar.getByRole("navigation");

  menuButton = this.page.getByRole("button", { name: "Expand sidebar" });

  async open() {
    await expect(async () => {
      try {
        await expect(this.sidebar).toBeInViewport({ ratio: 0.1, timeout: 1000 });
      } catch {
        await this.menuButton.click();
        await expect(this.sidebar).toBeInViewport({ ratio: 0.1, timeout: 5000 });
      }
    }).toPass();
  }

  getLinkByName(name: string) {
    return this.nav.getByRole("link", { name });
  }
}
