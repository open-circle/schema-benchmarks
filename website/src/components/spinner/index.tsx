import {
  bem,
  type DistributiveOmit,
  type LooseAutocomplete,
} from "@schema-benchmarks/utils";
import type { ComponentPropsWithoutRef } from "react";
import MDSpinner from "react-md-spinner";
import type { Color } from "@/styles/colors";

export interface SpinnerProps
  extends DistributiveOmit<
    ComponentPropsWithoutRef<typeof MDSpinner>,
    "color1" | "color2" | "color3" | "color4" | "singleColor"
  > {
  color1?: LooseAutocomplete<Color>;
  color2?: LooseAutocomplete<Color>;
  color3?: LooseAutocomplete<Color>;
  color4?: LooseAutocomplete<Color>;
  singleColor?: LooseAutocomplete<Color>;
}

const makeVar = (color: string) => `var(--${color})`;

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
