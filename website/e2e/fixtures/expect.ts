import type { Locator, ExpectMatcherState } from "@playwright/test";
import { expect as baseExpect } from "@playwright/test";
import type { Autocomplete, IfMaybeUndefined } from "@schema-benchmarks/utils";

import type { CurrentValue } from "#test/common/matchers/to-be-current";

function createAttributeMatcher<ExpectedValue extends string | undefined>(
  assertionName: string,
  attributeName: string,
  defaultExpectedValue?: ExpectedValue,
) {
  return async function toHaveAttribute(
    this: ExpectMatcherState,
    locator: Locator,
    ...[expectedValue = defaultExpectedValue]: IfMaybeUndefined<
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

type MixedBooleanValue = Autocomplete.String<"true" | "false" | "mixed">;
type SortValue = Autocomplete.String<"ascending" | "descending" | "none" | "other">;

export const expect = baseExpect.extend({
  toBeCurrent: createAttributeMatcher<CurrentValue | undefined>("toBeCurrent", "aria-current"),
  toBePressed: createAttributeMatcher<MixedBooleanValue | undefined>("toBePressed", "aria-pressed"),
  toHaveSort: createAttributeMatcher<SortValue | undefined>("toHaveSort", "aria-sort"),
  toBeSelected: createAttributeMatcher<MixedBooleanValue | undefined>(
    "toBeSelected",
    "aria-selected",
    "true",
  ),
});
