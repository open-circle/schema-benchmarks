import { test, type Locator, type Page } from "@playwright/test";
import type { Tail } from "@schema-benchmarks/utils";
import { getOrInsertComputed } from "@schema-benchmarks/utils";

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

  @lazy
  get tabLink() {
    return this.parent.tabs.getByRole("tab", { name: this.tabName });
  }

  @lazy
  get tabPanel() {
    return this.page.getByRole("tabpanel", { name: this.tabName });
  }

  @step(({ tabName }) => `Select ${tabName} tab`)
  async select() {
    await expect(async () => {
      await this.tabLink.click();
      await expect(this.tabLink).toBeSelected();
      await expect(this.tabPanel).toBeVisible();
    }).toPass();
  }
}

type StepOptions = Parameters<typeof test.step>[2];

export function step<TThis>(
  title: string | ((this: TThis, target: TThis) => string),
  options?: StepOptions,
) {
  return function decorator<TArgs extends Array<any>, TReturn>(
    target: (this: TThis, ...args: TArgs) => Promise<TReturn>,
    _context: ClassMethodDecoratorContext<TThis, (this: TThis, ...args: TArgs) => Promise<TReturn>>,
  ) {
    return function decoratedFunction(this: TThis, ...args: TArgs): Promise<TReturn> {
      return test.step(
        typeof title === "function" ? title.call(this, this) : title,
        () => target.apply(this, args),
        options,
      );
    };
  };
}

function shallowEqualArrays<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export function lazy<T extends object, R>(
  get: (this: T) => R,
  { name }: ClassGetterDecoratorContext<T, R>,
) {
  return function decoratedGetter(this: T) {
    const result = get.call(this);
    Object.defineProperty(this, name, {
      value: result,
      configurable: true,
      enumerable: false,
      writable: false,
    });
    return result;
  };
}

/**
 * Caches the result of a getter based on the values returned by a function.
 * Each value is compared by reference.
 */
export function cache<T extends object, TDeps extends Array<unknown>>(
  getDeps: (target: T) => TDeps,
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
