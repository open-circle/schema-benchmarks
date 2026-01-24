import type { ExpectationResult, MatcherState } from "@vitest/expect";
import type { Locator } from "vitest/browser";
import { getElementFromUserInput, getMessage } from "./utils";

export function toBePressed(
  this: MatcherState,
  actual: Element | Locator,
): ExpectationResult {
  const htmlElement = getElementFromUserInput(actual, toBePressed, this);

  const roles = (htmlElement.getAttribute("role") ?? "")
    .split(" ")
    .map((role) => role.trim());

  const canBePressed =
    htmlElement.tagName.toLowerCase() === "button" ||
    (htmlElement.tagName.toLowerCase() === "input" &&
      (htmlElement as HTMLInputElement).type === "button") ||
    roles.includes("button");

  const hasPressedAttribute = htmlElement.hasAttribute("aria-pressed");
  const pressedAttribute = htmlElement.getAttribute("aria-pressed");

  const isValidAriaPressed =
    pressedAttribute === "true" || pressedAttribute === "false";

  if (!canBePressed || (hasPressedAttribute && !isValidAriaPressed)) {
    throw new Error(
      "Element is not a button or does not have a valid aria-pressed attribute",
    );
  }

  const isPressed = pressedAttribute === "true";

  return {
    pass: canBePressed && isPressed,

    message: () => {
      const matcher = this.utils.matcherHint(
        `${this.isNot ? ".not" : ""}.toBePressed`,
        "element",
        "",
      );

      return getMessage(
        this,
        matcher,
        `Expected element to have`,
        `aria-pressed="${this.isNot ? "false" : "true"}"`,
        `Received`,
        `aria-pressed="${pressedAttribute}"`,
      );
    },
  };
}

declare module "vitest" {
  interface Assertion<T> {
    /**
     * @description
     * Asserts that the element is a button or has a role of button and that it is pressed.
     *
     * @example
     * <button aria-pressed="true">Pressed</button>
     *
     * await expect.element(page.getByRole("button", { name: "Pressed" })).toBePressed();
     */
    toBePressed: () => void;
  }
}
