import { DistributiveOmit } from "@schema-benchmarks/utils";
import { Link, RegisteredRouter, ValidateLinkOptions } from "@tanstack/react-router";
import { ComponentPropsWithRef, MouseEventHandler } from "react";
import bem from "react-bem-helper";

import { SortDirection, SortSearch, toggleSort } from "#/shared/lib/sort";

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
}

const cls = bem("sort-cell");

export function SortableHeaderButton({
  children,
  className,
  onClick,
  "aria-sort": direction,
  ...props
}: SortableHeaderButtonProps) {
  return (
    <th {...props} {...cls({ extra: className })} aria-sort={direction}>
      <button {...cls("label")} {...{ onClick }}>
        {children}
        <MdSymbol {...cls("icon")}>{sortDirectionIcons[direction ?? "none"]}</MdSymbol>
      </button>
    </th>
  );
}

SortableHeaderButton.getSortDirection = getSortDirection;

export interface SortableHeaderLinkProps<LinkOptions> extends ComponentPropsWithRef<"th"> {
  linkOptions: ValidateLinkOptions<RegisteredRouter, LinkOptions>;
}

export function SortableHeaderLink<LinkOptions>({
  children,
  className,
  linkOptions,
  "aria-sort": direction,
  ...props
}: SortableHeaderLinkProps<LinkOptions>) {
  return (
    <th {...props} {...cls({ extra: className })} aria-sort={direction}>
      <Link {...linkOptions} {...cls({ element: "label", extra: linkOptions.className })}>
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
