import { ComponentPropsWithoutRef } from "react";

export const sortDirectionIcons: Record<
  NonNullable<ComponentPropsWithoutRef<"th">["aria-sort"]>,
  string
> = {
  ascending: "arrow_upward",
  descending: "arrow_upward",
  none: "sort",
  other: "sort",
};
