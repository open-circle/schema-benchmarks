import { DistributiveOmit } from "@schema-benchmarks/utils";
import { ComponentPropsWithRef, MouseEventHandler } from "react";
import bem from "react-bem-helper";

import { MdSymbol } from "../symbol";
import { sortDirectionIcons } from "./constants";

export interface SortableHeaderCellProps extends DistributiveOmit<
  ComponentPropsWithRef<"th">,
  "onClick"
> {
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const cls = bem("sort-cell");

export function SortableHeaderCell({
  children,
  className,
  onClick,
  "aria-sort": direction,
  ...props
}: SortableHeaderCellProps) {
  return (
    <th {...props} {...cls({ extra: className })} aria-sort={direction}>
      <button {...cls("label")} {...{ onClick }}>
        {children}
        <MdSymbol {...cls("icon")}>{sortDirectionIcons[direction ?? "none"]}</MdSymbol>
      </button>
    </th>
  );
}
