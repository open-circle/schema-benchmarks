import type { ExpectationResult, MatcherState } from "@vitest/expect";
import { getMessage } from "./utils";

export function toBePressed(
  this: MatcherState,
  element: unknown,
): ExpectationResult {
  if (!(element instanceof HTMLElement))
    throw new Error("Expected an HTML element");

  const roles = (element.getAttribute("role") ?? "")
    .split(" ")
    .map((role) => role.trim());

  const isButton =
    element.tagName.toLowerCase() === "button" ||
    (element.tagName.toLowerCase() === "input" &&
      (element as HTMLInputElement).type === "button") ||
    roles.includes("button");

  const pressedAttribute = element.getAttribute("aria-pressed");

  const isValidAriaElement =
    pressedAttribute === "true" || pressedAttribute === "false";

  if (!isButton || !isValidAriaElement) {
    return {
      pass: false,
      message: () =>
        `Only button or input with type="button" or element with role="button" and a valid aria-pressed attribute can be used with .toBePressed()`,
    };
  }

  const isPressed = pressedAttribute === "true";

  return {
    pass: isButton && isPressed,

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
    toBePressed(): T;
  }
}
