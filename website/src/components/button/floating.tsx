import { bem } from "@schema-benchmarks/utils";
import type { ComponentPropsWithRef } from "react";

export interface FloatingActionButtonProps
  extends ComponentPropsWithRef<"button"> {}

const cls = bem("button");

export function FloatingActionButton({
  className,
  ...props
}: FloatingActionButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={cls({
        modifiers: ["floating-action"],
        extra: className,
      })}
    />
  );
}
