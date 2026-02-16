import { mergeRefs } from "@schema-benchmarks/utils/react";
import { createLink } from "@tanstack/react-router";
import type { ComponentPropsWithRef } from "react";
import bem from "react-bem-helper";
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
}

export function Chip({ children, className, activated, ...props }: ChipProps) {
  return (
    <button type="button" {...props} aria-pressed={activated} {...cls({ extra: className })}>
      {children}
    </button>
  );
}

function BaseLinkChip({ children, className, ...props }: ComponentPropsWithRef<"a">) {
  return (
    <a {...props} {...cls({ extra: className })}>
      {children}
    </a>
  );
}

export const LinkChip = createLink(BaseLinkChip);
