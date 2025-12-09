import type { Autocomplete, DistributiveOmit } from "@schema-benchmarks/utils";
import { bem } from "@schema-benchmarks/utils/react";
import type { ComponentPropsWithoutRef } from "react";
import _MDSpinner from "react-md-spinner";
import type { Color } from "@/styles/colors";

// nasty - CJS build doesn't seem to work properly
const MDSpinner = (
  "default" in _MDSpinner ? _MDSpinner.default : _MDSpinner
) as typeof _MDSpinner;

export interface SpinnerProps
  extends DistributiveOmit<
    ComponentPropsWithoutRef<typeof MDSpinner>,
    "color1" | "color2" | "color3" | "color4" | "singleColor"
  > {
  color1?: Autocomplete.String<Color>;
  color2?: Autocomplete.String<Color>;
  color3?: Autocomplete.String<Color>;
  color4?: Autocomplete.String<Color>;
  singleColor?: Autocomplete.String<Color>;
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
