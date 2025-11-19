import { bem } from "@schema-benchmarks/utils";
import { createLink } from "@tanstack/react-router";
import type { ComponentPropsWithRef } from "react";
import { withTooltip } from "../tooltip";
import type { ButtonColor } from ".";

const cls = bem("button");

interface BaseToggleButtonProps {
  activeColor?: ButtonColor;
}

export interface ToggleButtonProps
  extends BaseToggleButtonProps,
    ComponentPropsWithRef<"button"> {
  active?: boolean;
}

// biome-ignore lint/style/useComponentExportOnlyModules: this is a component
export const ToggleButton = withTooltip(
  function ToggleButton({
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
        className={cls({
          modifiers: [
            "toggle",
            color ?? "",
            activeColor ? `active-${activeColor}` : "",
          ],
          extra: className,
        })}
      />
    );
  },
  { required: true },
);

interface BaseLinkToggleButtonProps
  extends ComponentPropsWithRef<"a">,
    BaseToggleButtonProps {}

// biome-ignore lint/style/useComponentExportOnlyModules: this is a component
export const ExternalLinkToggleButton = withTooltip(
  function ExternalLinkToggleButton({
    activeColor,
    className,
    ...props
  }: BaseLinkToggleButtonProps) {
    return (
      <a
        {...props}
        className={cls({
          modifiers: ["toggle", activeColor ? `active-${activeColor}` : ""],
          extra: className,
        })}
      />
    );
  },
  { required: true },
);

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
      className={cls({
        modifiers: ["floating-action"],
        extra: className,
      })}
    />
  );
}
