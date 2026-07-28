import type { Page } from "@playwright/test";
import type { Tail } from "@schema-benchmarks/utils";

import type { Breakpoint } from "#src/shared/hooks/use-breakpoints";

export abstract class BasePOM {
  constructor(
    protected page: Page,
    public main = page.locator("main"),
    public documentElement = page.locator("html"),
  ) {}

  abstract url: string;
  goto(...args: Tail<Parameters<Page["goto"]>>) {
    return this.page.goto(this.url, ...args);
  }

  static defineBreakpoints<const T extends Record<string, ReadonlyArray<Breakpoint>>>(
    breakpoints: T,
  ) {
    return breakpoints;
  }
}
