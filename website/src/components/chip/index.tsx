import { bem, mergeRefs } from "@schema-benchmarks/utils";
import { createLink } from "@tanstack/react-router";
import type { ComponentPropsWithRef } from "react";
import { useFocusGroup } from "@/hooks/use-focus-group";

const collectionCls = bem("chip-collection");

export function ChipCollection({
  children,
  className,
  ref,
  ...props
}: ComponentPropsWithRef<"div">) {
  const group = useFocusGroup();
  return (
    <div
      {...props}
      className={collectionCls({ extra: className })}
      ref={mergeRefs(ref, group)}
    >
      {children}
    </div>
  );
}

const cls = bem("chip");

export interface ChipProps extends ComponentPropsWithRef<"button"> {
  activated?: boolean;
}

export function Chip({ children, className, activated, ...props }: ChipProps) {
  return (
    <button
      type="button"
      {...props}
      aria-pressed={activated}
      className={cls({ extra: className })}
    >
      {children}
    </button>
  );
}

function BaseLinkChip({
  children,
  className,
  ...props
}: ComponentPropsWithRef<"a">) {
  return (
    <a {...props} className={cls({ extra: className })}>
      {children}
    </a>
  );
}

// biome-ignore lint/style/useComponentExportOnlyModules: this is a component
export const LinkChip = createLink(BaseLinkChip);
