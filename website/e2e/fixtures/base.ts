import type { Page } from "@playwright/test";
import type { Tail } from "@schema-benchmarks/utils";

import type { Breakpoint } from "#src/shared/hooks/use-breakpoints";

class ObjectModel {
  protected page: Page;
  constructor(page: Page) {
    this.page = page;
  }
}

export class ComponentObjectModel extends ObjectModel {
  main = this.page.locator("main");
  documentElement = this.page.locator("html");
}

export abstract class PageObjectModel extends ComponentObjectModel {
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
