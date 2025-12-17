import type { ComponentPropsWithRef } from "react";
import bem from "react-bem-helper";

const cls = bem("radio");

export function Radio({ className, ...props }: ComponentPropsWithRef<"input">) {
  return (
    <label {...cls({ extra: className })}>
      <input type="radio" {...props} />
      <span {...cls("icon")} />
    </label>
  );
}
