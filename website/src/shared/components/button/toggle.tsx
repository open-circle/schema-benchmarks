import type { DistributiveOmit } from "@schema-benchmarks/utils";
import { createLink } from "@tanstack/react-router";
import type { ComponentPropsWithRef } from "react";
import bem from "react-bem-helper";
import { Spinner } from "../spinner";
import { withTooltip } from "../tooltip";
import type { ButtonColor } from ".";

const cls = bem("button");

interface BaseToggleButtonProps {
  color?: ButtonColor;
  activeColor?: ButtonColor;
}

export interface ToggleButtonProps
  extends BaseToggleButtonProps,
    DistributiveOmit<ComponentPropsWithRef<"button">, "color"> {
  active?: boolean;
  loading?: boolean;
}

export const ToggleButton = withTooltip(
  function ToggleButton({
    color,
    activeColor,
    className,
    active,
    loading,
    disabled,
    children,
    ...props
  }: ToggleButtonProps) {
    return (
      <button
        type="button"
        {...props}
        disabled={disabled || loading}
        aria-pressed={active}
        {...cls({
          modifiers: [
            "toggle",
            color ?? "",
            activeColor ? `active-${activeColor}` : "",
          ],
          extra: className,
        })}
      >
        {loading ? <Spinner segmentCount={1} inheritColor /> : children}
      </button>
    );
  },
  { required: true },
);

interface BaseLinkToggleButtonProps
  extends DistributiveOmit<ComponentPropsWithRef<"a">, "color">,
    BaseToggleButtonProps {}

export const ExternalLinkToggleButton = withTooltip(
  function ExternalLinkToggleButton({
    color,
    activeColor,
    className,
    ...props
  }: BaseLinkToggleButtonProps) {
    return (
      <a
        {...props}
        {...cls({
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

export const InternalLinkToggleButton = createLink(ExternalLinkToggleButton);
