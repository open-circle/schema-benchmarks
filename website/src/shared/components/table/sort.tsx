import type { DistributiveOmit } from "@schema-benchmarks/utils";
import type { RegisteredRouter, ValidateLinkOptions } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import type { ComponentPropsWithRef, MouseEventHandler } from "react";
import bem from "react-bem-helper";
import type { HapticPattern } from "web-haptics";
import { useWebHaptics } from "web-haptics/react";

import type { SortDirection, SortSearch } from "#/shared/lib/sort";
import { toggleSort } from "#/shared/lib/sort";

import { MdSymbol } from "../symbol";
import { sortDirectionIcons } from "./constants";

function getSortDirection<T extends PropertyKey>(
  state: SortSearch<T>,
  key: T,
): "ascending" | "descending" | "none" {
  return state.sortBy === key ? state.sortDir : "none";
}

export interface SortableHeaderButtonProps extends DistributiveOmit<
  ComponentPropsWithRef<"th">,
  "onClick"
> {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  haptic?: boolean | HapticPattern;
}

const cls = bem("sort-cell");

export function SortableHeaderButton({
  children,
  className,
  onClick,
  "aria-sort": direction,
  haptic = true,
  ...props
}: SortableHeaderButtonProps) {
  const haptics = useWebHaptics();
  return (
    <th {...props} {...cls({ extra: className })} aria-sort={direction}>
      <button
        {...cls("label")}
        onClick={(event) => {
          if (haptic) void haptics.trigger(typeof haptic === "boolean" ? undefined : haptic);
          onClick?.(event);
        }}
      >
        {children}
        <MdSymbol {...cls("icon")}>{sortDirectionIcons[direction ?? "none"]}</MdSymbol>
      </button>
    </th>
  );
}

SortableHeaderButton.getSortDirection = getSortDirection;

export interface SortableHeaderLinkProps<LinkOptions> extends Omit<
  ComponentPropsWithRef<"th">,
  "onClick"
> {
  linkOptions: ValidateLinkOptions<RegisteredRouter, LinkOptions>;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  haptic?: boolean | HapticPattern;
}

export function SortableHeaderLink<LinkOptions>({
  children,
  className,
  linkOptions,
  "aria-sort": direction,
  haptic = true,
  onClick,
  ...props
}: SortableHeaderLinkProps<LinkOptions>) {
  const haptics = useWebHaptics();
  return (
    <th {...props} {...cls({ extra: className })} aria-sort={direction}>
      <Link
        {...(linkOptions as any)}
        {...cls({ element: "label", extra: linkOptions.className })}
        onClick={(event) => {
          if (haptic) void haptics.trigger(typeof haptic === "boolean" ? undefined : haptic);
          onClick?.(event);
        }}
      >
        {children}
        <MdSymbol {...cls("icon")}>{sortDirectionIcons[direction ?? "none"]}</MdSymbol>
      </Link>
    </th>
  );
}

SortableHeaderLink.getProps = <
  T extends PropertyKey,
  LinkOptions extends { search: (search: SortSearch<T>) => SortSearch<T> },
>(
  key: T,
  currentState: SortSearch<T>,
  linkOptions: ValidateLinkOptions<RegisteredRouter, LinkOptions>,
  defaultDirection?: SortDirection,
) => ({
  "aria-sort": getSortDirection(currentState, key),
  linkOptions: {
    ...linkOptions,
    search: toggleSort(key, defaultDirection),
  },
});
