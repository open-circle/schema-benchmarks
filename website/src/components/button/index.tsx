import { bem, type DistributiveOmit } from "@schema-benchmarks/utils";
import { createLink } from "@tanstack/react-router";
import type { ComponentPropsWithRef } from "react";
import { useFocusGroup } from "@/hooks/use-focus-group";
import { withTooltip } from "../tooltip";

export type ButtonColor =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "error";

interface BaseButtonProps {
  variant?: "text" | "outlined" | "contained";
  color?: ButtonColor;
}

export interface ButtonProps
  extends DistributiveOmit<ComponentPropsWithRef<"button">, "color">,
    BaseButtonProps {}

const buttonCls = bem("button");

// biome-ignore lint/style/useComponentExportOnlyModules: this is a component
export const Button = withTooltip(function Button({
  className,
  variant = "text",
  color = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={buttonCls({
        modifiers: [variant, color],
        extra: className,
      })}
    />
  );
});

interface BaseLinkButtonProps
  extends DistributiveOmit<ComponentPropsWithRef<"a">, "color">,
    BaseButtonProps {}

// biome-ignore lint/style/useComponentExportOnlyModules: this is a component
export const ExternalLinkButton = withTooltip(function ExternalLinkButton({
  className,
  variant = "text",
  color = "primary",
  ...props
}: BaseLinkButtonProps) {
  return (
    <a
      {...props}
      className={buttonCls({
        modifiers: [variant, color],
        extra: className,
      })}
    />
  );
});

// biome-ignore lint/style/useComponentExportOnlyModules: this is a component
export const InternalLinkButton = createLink(ExternalLinkButton);

const buttonGroupCls = bem("button-group");

export function ButtonGroup({
  children,
  variant = "text",
  className,
}: {
  children: React.ReactNode;
  variant?: "text" | "outlined";
  className?: string;
}) {
  const group = useFocusGroup();
  return (
    <div
      className={buttonGroupCls({ modifiers: [variant], extra: className })}
      ref={group}
    >
      {children}
    </div>
  );
}
