import clsx from "clsx";
import type { ComponentPropsWithRef } from "react";

export function Radio({ className, ...props }: ComponentPropsWithRef<"input">) {
  return (
    <label className={clsx("radio", className)}>
      <input type="radio" {...props} />
      <span className="radio__icon" />
    </label>
  );
}
