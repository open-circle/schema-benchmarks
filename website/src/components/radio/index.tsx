import { bem } from "@schema-benchmarks/utils";
import clsx from "clsx";
import type { ComponentPropsWithRef } from "react";

const cls = bem("radio");

export function Radio({ className, ...props }: ComponentPropsWithRef<"input">) {
  return (
    <label className={clsx(cls(), className)}>
      <input type="radio" {...props} />
      <span className={cls("icon")} />
    </label>
  );
}
