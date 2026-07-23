import type { Page } from "@playwright/test";

import type { Breakpoint } from "#src/shared/hooks/use-breakpoints";

export class BasePOM {
  constructor(
    protected page: Page,
    public main = page.locator("main"),
    public documentElement = page.locator("html"),
  ) {}

  static defineBreakpoints<const T extends Record<string, ReadonlyArray<Breakpoint>>>(
    breakpoints: T,
  ) {
    return breakpoints;
  }
}
