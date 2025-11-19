import { bem, type DistributiveOmit } from "@schema-benchmarks/utils";
import { createLink } from "@tanstack/react-router";
import type { ComponentPropsWithRef } from "react";
import { useFocusGroup } from "@/hooks/use-focus-group";

type ButtonColor = "primary" | "secondary" | "danger" | "success" | "error";

interface BaseButtonProps {
  variant?: "text" | "outlined" | "contained";
  color?: ButtonColor;
}

export interface ButtonProps
  extends DistributiveOmit<ComponentPropsWithRef<"button">, "color">,
    BaseButtonProps {}

const buttonCls = bem("button");

export function Button({
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
}

interface BaseLinkButtonProps
  extends DistributiveOmit<ComponentPropsWithRef<"a">, "color">,
    BaseButtonProps {}

export function ExternalLinkButton({
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
}

// biome-ignore lint/style/useComponentExportOnlyModules: this is a component
export const InternalLinkButton = createLink(ExternalLinkButton);

interface BaseToggleButtonProps {
  activeColor?: ButtonColor;
}

export interface ToggleButtonProps
  extends BaseToggleButtonProps,
    ComponentPropsWithRef<"button"> {
  active?: boolean;
}

export function ToggleButton({
  color,
  activeColor,
  className,
  active,
  ...props
}: ToggleButtonProps) {
  return (
    <button
      type="button"
      {...props}
      aria-pressed={active}
      className={buttonCls({
        modifiers: [
          "toggle",
          color ?? "",
          activeColor ? `active-${activeColor}` : "",
        ],
        extra: className,
      })}
    />
  );
}

interface BaseLinkToggleButtonProps
  extends ComponentPropsWithRef<"a">,
    BaseToggleButtonProps {}

export function ExternalLinkToggleButton({
  activeColor,
  className,
  ...props
}: BaseLinkToggleButtonProps) {
  return (
    <a
      {...props}
      className={buttonCls({
        modifiers: ["toggle", activeColor ? `active-${activeColor}` : ""],
        extra: className,
      })}
    />
  );
}

// biome-ignore lint/style/useComponentExportOnlyModules: this is a component
export const InternalLinkToggleButton = createLink(ExternalLinkToggleButton);

export function FloatingActionButton({
  className,
  ...props
}: ComponentPropsWithRef<"button">) {
  return (
    <button
      type="button"
      {...props}
      className={buttonCls({
        modifiers: ["floating-action"],
        extra: className,
      })}
    />
  );
}

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
