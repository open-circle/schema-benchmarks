import type { DistributiveOmit } from "@schema-benchmarks/utils";
import { createLink } from "@tanstack/react-router";
import type { ComponentPropsWithRef } from "react";
import bem from "react-bem-helper";
import type { HapticPattern } from "web-haptics";
import { useWebHaptics } from "web-haptics/react";

import type { ButtonColor } from ".";
import { Spinner } from "../spinner";
import { withTooltip } from "../tooltip";

const cls = bem("button");

interface BaseToggleButtonProps {
  color?: ButtonColor;
  haptic?: true | HapticPattern;
}

export interface ToggleButtonProps
  extends BaseToggleButtonProps, DistributiveOmit<ComponentPropsWithRef<"button">, "color"> {
  active?: boolean;
  loading?: boolean;
}

export const ToggleButton = withTooltip(
  function ToggleButton({
    color,
    className,
    active,
    loading,
    disabled,
    children,
    haptic,
    onClick,
    ...props
  }: ToggleButtonProps) {
    const haptics = useWebHaptics();
    return (
      <button
        type="button"
        {...props}
        disabled={disabled || loading}
        aria-pressed={active}
        {...cls({
          modifiers: ["toggle", color ?? ""],
          extra: className,
        })}
        onClick={(event) => {
          if (haptic) haptics.trigger(typeof haptic === "boolean" ? undefined : haptic);
          onClick?.(event);
        }}
      >
        {loading ? <Spinner segmentCount={1} inheritColor /> : children}
      </button>
    );
  },
  { required: true },
);

interface BaseLinkToggleButtonProps
  extends DistributiveOmit<ComponentPropsWithRef<"a">, "color">, BaseToggleButtonProps {}

export const ExternalLinkToggleButton = withTooltip(
  function ExternalLinkToggleButton({
    color,
    className,
    children,
    haptic,
    onClick,
    ...props
  }: BaseLinkToggleButtonProps) {
    const haptics = useWebHaptics();
    return (
      // oxlint-disable-next-line jsx_a11y/click-events-have-key-events, jsx_a11y/no-static-element-interactions
      <a
        {...props}
        {...cls({
          modifiers: ["toggle", color ?? ""],
          extra: className,
        })}
        onClick={(event) => {
          if (haptic) haptics.trigger(typeof haptic === "boolean" ? undefined : haptic);
          onClick?.(event);
        }}
      >
        {children}
      </a>
    );
  },
  { required: true },
);

export const InternalLinkToggleButton = createLink(ExternalLinkToggleButton);
