import { expect, test, type Locator, type Page } from "@playwright/test";
import type { MaybePromise, Tail } from "@schema-benchmarks/utils";
import { getOrInsertComputed } from "@schema-benchmarks/utils";

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

  matchesUrl(url: URL) {
    return url.pathname === this.url;
  }

  static defineBreakpoints<const T extends Record<string, ReadonlyArray<Breakpoint>>>(
    breakpoints: T,
  ) {
    return breakpoints;
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

  @cache()
  get tabLink() {
    return this.parent.tabs.getByRole("tab", { name: this.tabName });
  }

  @cache()
  get tabPanel() {
    return this.page.getByRole("tabpanel", { name: this.tabName });
  }

  async select() {
    await test.step(`Select ${this.tabName} tab`, async () => {
      await expect(async () => {
        await this.tabLink.click();
        await expect(this.tabLink).toHaveAttribute("aria-selected", "true");
        await expect(this.tabPanel).toBeVisible();
      }).toPass();
    });
  }
}

type StepOptions = Parameters<typeof test.step>[2];

export function step(title: string, options?: StepOptions) {
  return function decorator<TThis, TArgs extends Array<any>, TReturn>(
    target: (this: TThis, ...args: TArgs) => MaybePromise<TReturn>,
    _context: ClassMethodDecoratorContext<
      TThis,
      (this: TThis, ...args: TArgs) => MaybePromise<TReturn>
    >,
  ) {
    return function decoratedFunction(this: TThis, ...args: TArgs): Promise<TReturn> {
      return test.step(title, () => target.apply(this, args), options);
    };
  };
}

function shallowEqualArrays<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/**
 * Caches the result of a getter based on the values returned by a function.
 * Each value is compared by reference.
 */
export function cache<T extends object, TDeps extends Array<unknown> = []>(
  getDeps: (target: T) => TDeps = () => [] as unknown as TDeps,
  areDepsEqual: (a: TDeps, b: TDeps) => boolean = shallowEqualArrays,
) {
  return function decorate<R>(get: (this: T) => R, _context: ClassGetterDecoratorContext<T, R>) {
    const cached = new WeakMap<
      T,
      {
        deps: TDeps;
        result: R;
      }
    >();

    return function decoratedGetter(this: T) {
      const deps = getDeps(this);
      const previous = cached.get(this);
      if (previous && !areDepsEqual(previous.deps, deps)) {
        cached.delete(this);
      }
      return getOrInsertComputed(cached, this, () => ({ deps, result: get.call(this) })).result;
    };
  };
}
