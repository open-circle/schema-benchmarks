import type { Tail } from "@schema-benchmarks/utils";
import type { Locator, Page } from "playwright";

import { expect } from "#e2e/fixtures/expect";

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
  abstract title: string | RegExp;
  async goto(...args: Tail<Parameters<Page["goto"]>>) {
    const response = await this.page.goto(this.url, ...args);

    await expect(this.page).toHaveTitle(this.title);

    return response;
  }

  matchesUrl(url: URL) {
    return url.pathname === this.url;
  }
}

export abstract class TabObjectModel<
  TParent extends { tabs: Locator },
> extends ComponentObjectModel {
  parent: TParent;

  constructor(page: Page, parent: TParent) {
    super(page);
    this.parent = parent;
  }

  abstract url: string;

  matchesUrl(url: URL) {
    return url.pathname === this.url;
  }

  abstract tabName: string;

  get tabLink() {
    return this.parent.tabs.getByRole("tab", { name: this.tabName });
  }

  get tabPanel() {
    return this.page.getByRole("tabpanel", { name: this.tabName, includeHidden: true });
  }

  async select() {
    await this.tabLink.click();
    await expect(this.page).toHaveURL((url) => this.matchesUrl(url), { timeout: 15_000 });
    await expect(this.tabLink).toHaveAttribute("aria-selected", "true", { timeout: 15_000 });
    await expect(this.tabPanel).toBeVisible({ timeout: 15_000 });
  }
}

export function withFilters<
  Constructor extends abstract new (...args: Array<any>) => ComponentObjectModel,
>(Base: Constructor) {
  abstract class WithFilters extends Base {
    filters = this.main.getByRole("search", { name: "Filters" });
  }
  return WithFilters;
}
