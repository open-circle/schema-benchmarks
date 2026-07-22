import type { Page } from "@playwright/test";

export class BasePOM {
  constructor(
    protected page: Page,
    public main = page.locator("main"),
    public documentElement = page.locator("html"),
  ) {}
}
