import type { Locator, TestFixture, Page } from "@playwright/test";
import { test as baseTest, expect as baseExpect } from "@playwright/test";

import type { Breakpoint } from "#/shared/hooks/use-breakpoints";
import { matchBreakpoints } from "#e2e/utils";
import type { CurrentValue } from "#test/common/matchers/to-be-current";

import { Header } from "./header";
import { BlogPage } from "./pages/blog";
import { DownloadPage } from "./pages/download";
import { PrefsDialog } from "./prefs";
import { Sidebar } from "./sidebar";

const POMs = {
  sidebar: Sidebar,
  prefs: PrefsDialog,
  blogPage: BlogPage,
  header: Header,
  downloadPage: DownloadPage,
} satisfies Record<string, new (page: Page) => any>;

type POMFixtures = {
  [K in keyof typeof POMs]: InstanceType<(typeof POMs)[K]>;
};

const pomFixtures = Object.fromEntries(
  Object.entries(POMs).map(
    ([name, POM]): [string, TestFixture<POMFixtures[keyof POMFixtures], { page: Page }>] => [
      name,
      async ({ page }, use) => use(new POM(page)),
    ],
  ),
) as {
  [K in keyof POMFixtures]: TestFixture<POMFixtures[K], { page: Page }>;
};

interface UtilFixtures {
  matchBreakpoints: (breakpoints: ReadonlyArray<Breakpoint>) => Promise<boolean>;
}

export const test = baseTest.extend<POMFixtures & UtilFixtures>({
  ...pomFixtures,
  matchBreakpoints: async ({ page }, use) =>
    use((breakpoints) => matchBreakpoints(page, breakpoints)),
});

export const expect = baseExpect.extend({
  async toBeCurrent(locator: Locator, expectedValue?: CurrentValue) {
    const assertionName = "toBeCurrent";
    let pass: boolean;
    let matcherResult: any;
    try {
      // oxlint-disable-next-line playwright/valid-expect
      const expectation = this.isNot ? baseExpect(locator).not : baseExpect(locator);
      const promise = expectedValue
        ? expectation.toHaveAttribute("aria-current", expectedValue)
        : expectation.toHaveAttribute("aria-current");
      await promise;
      pass = true;
    } catch (e: any) {
      ({ matcherResult } = e);
      pass = false;
    }
    if (this.isNot) {
      pass = !pass;
    }

    const message = () =>
      this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
      "\n\n" +
      `Expected the element ${this.isNot ? "not " : ""}to have attribute "${this.utils.printExpected(
        "aria-current",
      )}"` +
      (expectedValue !== undefined
        ? ` with value ${this.utils.printExpected(expectedValue)}`
        : "") +
      `\n` +
      (matcherResult?.message ? `Received: ${matcherResult.message}` : "");

    return {
      pass,
      message,
      name: assertionName,
      expected: expectedValue,
      actual: matcherResult?.actual,
    };
  },
  async toBePressed(locator: Locator) {
    const assertionName = "toBePressed";
    let pass: boolean;
    let matcherResult: any;
    try {
      // oxlint-disable-next-line playwright/valid-expect
      const expectation = this.isNot ? baseExpect(locator).not : baseExpect(locator);
      await expectation.toHaveAttribute("aria-pressed", "true");
      pass = true;
    } catch (e: any) {
      ({ matcherResult } = e);
      pass = false;
    }
    if (this.isNot) {
      pass = !pass;
    }

    const message = () =>
      this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
      "\n\n" +
      `Expected the element ${this.isNot ? "not " : ""}to have attribute "${this.utils.printExpected(
        "aria-pressed",
      )}" with value ${this.utils.printExpected("true")}` +
      `\n` +
      (matcherResult?.message ? `Received: ${matcherResult.message}` : "");

    return {
      pass,
      message,
      name: assertionName,
      expected: "true",
      actual: matcherResult?.actual,
    };
  },
});
