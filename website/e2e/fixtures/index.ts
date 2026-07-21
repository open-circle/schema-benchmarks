import type { Locator } from "@playwright/test";
import { test as baseTest, expect as baseExpect } from "@playwright/test";

import type { CurrentValue } from "../../test/common/matchers/to-be-current";
import { PrefsDialog } from "./prefs";
import { Sidebar } from "./sidebar";

const POMs = {
  sidebar: Sidebar,
  prefs: PrefsDialog,
};

type POMFixtures = {
  [K in keyof typeof POMs]: InstanceType<(typeof POMs)[K]>;
};

export const test = baseTest.extend<POMFixtures>({
  sidebar: async ({ page }, use) => {
    const sidebar = new Sidebar(page);
    await use(sidebar);
  },
  prefs: async ({ page }, use) => {
    const prefs = new PrefsDialog(page);
    await use(prefs);
  },
});

export const expect = baseExpect.extend({
  async toBeCurrent(locator: Locator, expectedValue?: CurrentValue) {
    const assertionName = "toBeCurrent";
    let pass: boolean;
    let matcherResult: any;
    try {
      const expectation = this.isNot ? expect(locator).not : expect(locator);
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
      const expectation = this.isNot ? expect(locator).not : expect(locator);
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
