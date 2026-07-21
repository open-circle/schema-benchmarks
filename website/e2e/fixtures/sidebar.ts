import type { Page } from "@playwright/test";

import { BasePOM } from "./base";

export class Sidebar extends BasePOM {
  constructor(
    page: Page,
    public sidebar = page.getByRole("complementary"),
    public nav = sidebar.getByRole("navigation"),
  ) {
    super(page);
  }

  getLinkByName(name: string) {
    return this.nav.getByRole("link", { name });
  }
}
