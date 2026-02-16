import type { Autocomplete } from "@schema-benchmarks/utils";
import type { ExpectationResult, MatcherState } from "@vitest/expect";
import type { Locator } from "vitest/browser";
import { getElementFromUserInput, getMessage } from "./utils";

type CurrentValue =
  | boolean
  | Autocomplete.String<"true" | "false" | "page" | "step" | "location" | "date" | "time">;
const attribute = "aria-current";

export function toBeCurrent(
  this: MatcherState,
  actual: Element | Locator,
  expectedValue?: CurrentValue,
): ExpectationResult {
  const htmlElement = getElementFromUserInput(actual, toBeCurrent, this);
  const isExpectedValuePresent = expectedValue !== undefined;
  const hasAttribute = htmlElement.hasAttribute(attribute);
  const receivedValue = htmlElement.getAttribute(attribute);
  return {
    pass: isExpectedValuePresent
      ? hasAttribute && this.equals(receivedValue, expectedValue, this.customTesters)
      : hasAttribute,
    message: () => {
      const to = this.isNot ? "not to" : "to";
      const receivedAttribute = hasAttribute
        ? printAttribute(this.utils.stringify, attribute, receivedValue)
        : null;
      const matcher = this.utils.matcherHint(
        `${this.isNot ? ".not" : ""}.toHaveAttribute`,
        "element",
        this.utils.printExpected(attribute),
        {
          secondArgument: isExpectedValuePresent
            ? this.utils.printExpected(expectedValue)
            : undefined,
          comment: getAttributeComment(this.utils.stringify, attribute, expectedValue),
        },
      );
      return getMessage(
        this,
        matcher,
        `Expected the element ${to} have attribute`,
        printAttribute(this.utils.stringify, attribute, expectedValue),
        "Received",
        receivedAttribute,
      );
    },
  };
}

function printAttribute(stringify: (obj: unknown) => string, name: string, value: unknown) {
  return value === undefined ? name : `${name}=${stringify(value)}`;
}

function getAttributeComment(stringify: (obj: unknown) => string, name: string, value: unknown) {
  return value === undefined
    ? `element.hasAttribute(${stringify(name)})`
    : `element.getAttribute(${stringify(name)}) === ${stringify(value)}`;
}

declare module "vitest" {
  // oxlint-disable-next-line no-unused-vars
  interface Assertion<T> {
    toBeCurrent: {
      /**
       * @description
       * Asserts that the element has the `aria-current` attribute.
       *
       * @example
       * <a href="/about" aria-current="page">About</a>
       *
       * await expect.element(page.getByRole("link", { name: "About" })).toBeCurrent();
       */
      (): void;
      /**
       * @description
       * Asserts that the element has the `aria-current` attribute with the given value.
       *
       * @example
       * <a href="/about" aria-current="page">About</a>
       *
       * await expect.element(page.getByRole("link", { name: "About" })).toBeCurrent("page");
       */
      (value: CurrentValue): void;
    };
  }
}
