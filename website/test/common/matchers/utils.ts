import type { MatcherState } from "@vitest/expect";
import redent from "redent";

function display(context: MatcherState, value: unknown) {
  return typeof value === "string" ? value : context.utils.stringify(value);
}

export function getMessage(
  context: MatcherState,
  matcher: string,
  expectedLabel: string,
  expectedValue: string,
  receivedLabel: string,
  receivedValue: string,
) {
  return [
    `${matcher}\n`,
    // eslint-disable-next-line new-cap
    `${expectedLabel}:\n${context.utils.EXPECTED_COLOR(
      redent(display(context, expectedValue), 2),
    )}`,
    // eslint-disable-next-line new-cap
    `${receivedLabel}:\n${context.utils.RECEIVED_COLOR(
      redent(display(context, receivedValue), 2),
    )}`,
  ].join("\n");
}
