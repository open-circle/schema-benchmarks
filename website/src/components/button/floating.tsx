import { bem } from "@schema-benchmarks/utils";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { MdSymbol } from "../symbol";

export interface FloatingActionButtonProps
  extends ComponentPropsWithRef<"button"> {
  icon?: ReactNode;
}

const cls = bem("button");

export function FloatingActionButton({
  className,
  icon,
  children,
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
    >
      {icon && <MdSymbol className={cls("icon")}>{icon}</MdSymbol>}
      {children}
    </button>
  );
}
