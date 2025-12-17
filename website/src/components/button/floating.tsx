import type { ComponentPropsWithRef, ReactNode } from "react";
import bem from "react-bem-helper";

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
      {...cls({
        modifiers: ["floating-action"],
        extra: className,
      })}
    >
      {icon && <div {...cls("icon")}>{icon}</div>}
      {children}
    </button>
  );
}
