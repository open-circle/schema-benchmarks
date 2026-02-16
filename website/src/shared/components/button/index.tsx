import { type DistributiveOmit, nonNullish } from "@schema-benchmarks/utils";
import { createLink } from "@tanstack/react-router";
import type { ComponentPropsWithRef, ReactNode } from "react";
import bem from "react-bem-helper";

import { useFocusGroup } from "#/shared/hooks/use-focus-group";

import { Spinner } from "../spinner";
import { withTooltip } from "../tooltip";

export type ButtonColor = "success" | "error" | "warning" | "info";

interface BaseButtonProps {
  variant?: "text" | "outlined" | "contained";
  color?: ButtonColor;
}

export interface ButtonProps
  extends DistributiveOmit<ComponentPropsWithRef<"button">, "color">, BaseButtonProps {
  icon?: ReactNode;
  loading?: boolean;
}

const buttonCls = bem("button");

export const Button = withTooltip(function Button({
  className,
  variant = "text",
  color,
  icon,
  children,
  loading,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      disabled={disabled || loading}
      {...buttonCls({
        modifiers: [variant, color].filter(nonNullish),
        extra: className,
      })}
    >
      {loading ? (
        <Spinner size={18} segmentCount={1} inheritColor />
      ) : (
        icon && <div {...buttonCls("icon")}>{icon}</div>
      )}
      {children}
    </button>
  );
});

interface BaseLinkButtonProps
  extends DistributiveOmit<ComponentPropsWithRef<"a">, "color">, BaseButtonProps {}

export const ExternalLinkButton = withTooltip(function ExternalLinkButton({
  className,
  variant = "text",
  color,
  children,
  ...props
}: BaseLinkButtonProps) {
  return (
    <a
      {...props}
      {...buttonCls({
        modifiers: [variant, color].filter(nonNullish),
        extra: className,
      })}
    >
      {children}
    </a>
  );
});

export const InternalLinkButton = createLink(ExternalLinkButton);

const buttonGroupCls = bem("button-group");

export function ButtonGroup({
  children,
  variant = "text",
  className,
  orientation = "horizontal",
  ariaLabel,
  ariaLabelledBy,
}: {
  children: React.ReactNode;
  variant?: "text" | "outlined";
  className?: string;
  orientation?: "horizontal" | "vertical";
} & (
  | { ariaLabel: string; ariaLabelledBy?: never }
  | { ariaLabelledBy: string; ariaLabel?: never }
)) {
  const group = useFocusGroup({
    orientation,
  });
  return (
    <div
      {...buttonGroupCls({ modifiers: [variant], extra: className })}
      ref={group}
      role="toolbar"
      aria-orientation={orientation}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </div>
  );
}
