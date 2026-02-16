import type { MatcherState } from "@vitest/expect";
import type { Plugin } from "@vitest/pretty-format";
import ansiRegex from "ansi-regex";
import style from "ansi-styles";
import redent from "redent";
import type { Locator } from "vitest/browser";

export const alignedAnsiStyleSerializer: Plugin = {
  serialize(val: string | Error): string {
    // Return the string itself, not escaped nor enclosed in double quote marks.
    return (val instanceof Error ? val.message : val).replace(ansiRegex(), (match) => {
      switch (match) {
        case style.inverse.open:
          return "<i>";
        case style.inverse.close:
          return "</i>";

        case style.bold.open:
          return "<b>";
        case style.dim.open:
          return "<d>";
        case style.green.open:
          return "<g>";
        case style.red.open:
          return "<r>";
        case style.yellow.open:
          return "<y>";
        case style.bgYellow.open:
          return "<Y>";

        case style.bold.close:
          return "</b>";
        case style.dim.close:
          return "</d>";
        case style.green.close:
          return "</g>";
        case style.red.close:
          return "</r>";
        case style.yellow.close:
          return "</y>";
        case style.bgYellow.close:
          return "</Y>";

        default:
          return match; // unexpected escape sequence
      }
    });
  },
  test(val: unknown) {
    return typeof val === "string" || val instanceof Error;
  },
};

function display(context: MatcherState, value: unknown) {
  return typeof value === "string" ? value : context.utils.stringify(value);
}

export function getMessage(
  context: MatcherState,
  matcher: string,
  expectedLabel: string,
  expectedValue: unknown,
  receivedLabel: string,
  receivedValue: unknown,
) {
  return [
    `${matcher}\n`,
    `${expectedLabel}:\n${context.utils.EXPECTED_COLOR(
      redent(display(context, expectedValue), 2),
    )}`,
    `${receivedLabel}:\n${context.utils.RECEIVED_COLOR(
      redent(display(context, receivedValue), 2),
    )}`,
  ].join("\n");
}

class GenericTypeError extends Error {
  constructor(
    expectedString: string,
    received: unknown,
    matcherFn: (...args: any) => any,
    context: MatcherState,
  ) {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, matcherFn);
    }
    let withType = "";
    try {
      withType = context.utils.printWithType("Received", received, context.utils.printReceived);
    } catch {
      // Can throw for Document:
      // https://github.com/jsdom/jsdom/issues/2304
    }
    this.message = [
      context.utils.matcherHint(`${context.isNot ? ".not" : ""}.${matcherFn.name}`, "received", ""),
      "",

      `${context.utils.RECEIVED_COLOR(
        "received",
      )} value must ${expectedString} or a Locator that returns ${expectedString}.`,
      withType,
    ].join("\n");
  }
}

function isLocator(value: Locator | Element | null): value is Locator {
  return typeof (value as Locator)?.element === "function";
}

export function getElementFromUserInput(
  elementOrLocator: Element | Locator | null,
  matcherFn: (...args: any) => any,
  context: MatcherState,
): HTMLElement | SVGElement {
  if (isLocator(elementOrLocator)) {
    elementOrLocator = elementOrLocator.element();
  }
  const defaultView = elementOrLocator?.ownerDocument?.defaultView || window;

  if (
    elementOrLocator instanceof defaultView.HTMLElement ||
    elementOrLocator instanceof defaultView.SVGElement
  ) {
    return elementOrLocator;
  }
  throw new GenericTypeError(
    "an HTML element or an SVG element",
    elementOrLocator,
    matcherFn,
    context,
  );
}
