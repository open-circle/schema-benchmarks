import { mergeRefs } from "@schema-benchmarks/utils/react";
import { createLink } from "@tanstack/react-router";
import type { ComponentPropsWithRef } from "react";
import bem from "react-bem-helper";
import type { HapticPattern } from "web-haptics";
import { useWebHaptics } from "web-haptics/react";

import { useFocusGroup } from "#/shared/hooks/use-focus-group";

const collectionCls = bem("chip-collection");

export function ChipCollection({
  children,
  className,
  ref,
  ...props
}: ComponentPropsWithRef<"div">) {
  const group = useFocusGroup();
  return (
    <div {...props} {...collectionCls({ extra: className })} ref={mergeRefs(ref, group)}>
      {children}
    </div>
  );
}

const cls = bem("chip");

export interface DisplayChip extends ComponentPropsWithRef<"div"> {}

export function DisplayChip({ children, className, ...props }: DisplayChip) {
  return (
    <div {...props} {...cls({ modifier: "display", extra: className })}>
      {children}
    </div>
  );
}

export interface ChipProps extends ComponentPropsWithRef<"button"> {
  activated?: boolean;
  haptic?: true | HapticPattern;
}

export function Chip({ children, className, activated, haptic, onClick, ...props }: ChipProps) {
  const haptics = useWebHaptics();
  return (
    <button
      type="button"
      {...props}
      aria-pressed={activated}
      {...cls({ extra: className })}
      onClick={(event) => {
        if (haptic) void haptics.trigger(typeof haptic === "boolean" ? undefined : haptic);
        onClick?.(event);
      }}
    >
      {children}
    </button>
  );
}

export interface LinkChipProps extends ComponentPropsWithRef<"a"> {
  haptic?: true | HapticPattern;
}

function BaseLinkChip({ children, className, haptic, onClick, ...props }: LinkChipProps) {
  const haptics = useWebHaptics();
  return (
    // oxlint-disable-next-line jsx_a11y/click-events-have-key-events, jsx_a11y/no-static-element-interactions
    <a
      {...props}
      {...cls({ extra: className })}
      onClick={(event) => {
        if (haptic) void haptics.trigger(typeof haptic === "boolean" ? undefined : haptic);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}

export const LinkChip = createLink(BaseLinkChip);
