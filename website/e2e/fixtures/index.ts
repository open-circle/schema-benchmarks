import type { Locator, TestFixture, Page, ExpectMatcherState } from "@playwright/test";
import { test as baseTest, expect as baseExpect } from "@playwright/test";
import type { Autocomplete, IfMaybeUndefined } from "@schema-benchmarks/utils";

import { waitForFontsLoaded } from "#e2e/utils";
import type { CurrentValue } from "#test/common/matchers/to-be-current";

import { Header } from "./header";
import * as pages from "./pages";
import { PrefsDialog } from "./prefs";
import { Sidebar } from "./sidebar";

const POMs = {
  sidebar: Sidebar,
  header: Header,
  prefs: PrefsDialog,
  ...pages,
} satisfies Record<string, new (page: Page) => any>;

type POMFixtures = {
  [K in keyof typeof POMs]: InstanceType<(typeof POMs)[K]>;
};

const pomFixtures = Object.fromEntries(
  Object.entries(POMs).map(
    ([name, POM]): [string, TestFixture<POMFixtures[keyof POMFixtures], { page: Page }>] => [
      name,
      ({ page }, use) => use(new POM(page)),
    ],
  ),
) as {
  [K in keyof POMFixtures]: TestFixture<POMFixtures[K], { page: Page }>;
};

interface UtilFixtures {
  fontsLoaded: () => Promise<void>;
}

export const test = baseTest.extend<POMFixtures & UtilFixtures>({
  ...pomFixtures,
  fontsLoaded: async ({ page }, use) => use(() => waitForFontsLoaded(page)),
});

test.beforeEach("Mock external download APIs", async ({ context }) => {
  await context.route("https://api.npmjs.org/downloads/point/last-week/**", (route) =>
    route.fulfill({ json: { downloads: 0 } }),
  );

  await context.route("https://api.jsr.io/scopes/**/downloads", (route) =>
    route.fulfill({ json: { total: [] } }),
  );
});

function createAttributeMatcher<ExpectedValue extends string | undefined>(
  assertionName: string,
  attributeName: string,
) {
  return async function toHaveAttribute(
    this: ExpectMatcherState,
    locator: Locator,
    ...[expectedValue]: IfMaybeUndefined<
      ExpectedValue,
      [expectedValue?: ExpectedValue],
      [expectedValue: ExpectedValue]
    >
  ) {
    let pass: boolean;
    let matcherResult: any;
    try {
      // oxlint-disable-next-line playwright/valid-expect
      const expectation = this.isNot ? baseExpect(locator).not : baseExpect(locator);
      const promise = expectedValue
        ? expectation.toHaveAttribute(attributeName, expectedValue)
        : expectation.toHaveAttribute(attributeName);
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
        attributeName,
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
  };
}

type PressedValue = Autocomplete.String<"true" | "false" | "mixed">;
type SortValue = Autocomplete.String<"ascending" | "descending" | "none" | "other">;

export const expect = baseExpect.extend({
  toBeCurrent: createAttributeMatcher<CurrentValue | undefined>("toBeCurrent", "aria-current"),
  toBePressed: createAttributeMatcher<PressedValue | undefined>("toBePressed", "aria-pressed"),
  toHaveSort: createAttributeMatcher<SortValue | undefined>("toHaveSort", "aria-sort"),
});
