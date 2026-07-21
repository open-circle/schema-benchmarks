import type { Page } from "@playwright/test";

import { expect } from ".";
import { BasePOM } from "./base";

export class Sidebar extends BasePOM {
  constructor(
    page: Page,
    public sidebar = page.getByRole("complementary"),
    public nav = sidebar.getByRole("navigation"),
    public menuButton = page.getByRole("button", { name: "Expand sidebar" }),
  ) {
    super(page);
  }

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
