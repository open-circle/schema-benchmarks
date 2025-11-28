import { bem, type DistributiveOmit } from "@schema-benchmarks/utils";
import type { ComponentPropsWithoutRef } from "react";
import MDSpinner from "react-md-spinner";
import type { Color } from "@/styles/colors";

export interface SpinnerProps
  extends DistributiveOmit<
    ComponentPropsWithoutRef<typeof MDSpinner>,
    "color1" | "color2" | "color3" | "color4" | "singleColor"
  > {
  color1?: Color;
  color2?: Color;
  color3?: Color;
  color4?: Color;
  singleColor?: Color;
}

const makeVar = (color: Color) => `var(--${color})`;

const cls = bem("spinner");

export function Spinner({
  color1 = "pink",
  color2 = "deep-orange",
  color3 = "yellow",
  color4 = "teal",
  singleColor,
  className,
  ...props
}: SpinnerProps) {
  return (
    <MDSpinner
      {...props}
      role="progressbar"
      className={cls({ extra: className })}
      color1={makeVar(color1)}
      color2={makeVar(color2)}
      color3={makeVar(color3)}
      color4={makeVar(color4)}
      singleColor={singleColor && makeVar(singleColor)}
    />
  );
}
