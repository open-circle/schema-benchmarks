import type { Page } from "@playwright/test";

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
    try {
      await this.sidebar.waitFor({ timeout: 1000 });
    } catch {
      await this.menuButton.click();
      await this.sidebar.waitFor({ timeout: 1000 });
    }
  }

  getLinkByName(name: string) {
    return this.nav.getByRole("link", { name });
  }

  async selectLinkByName(name: string) {
    const link = this.getLinkByName(name);
    await link.scrollIntoViewIfNeeded();
    await link.click({ timeout: 5000 });
    return link;
  }
}
