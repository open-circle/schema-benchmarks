import type { DistributiveOmit } from "@schema-benchmarks/utils";
import type { ComponentPropsWithoutRef } from "react";
import bem from "react-bem-helper";
import _MDSpinner from "react-md-spinner";

// nasty - CJS build doesn't seem to work properly
const MDSpinner = (
  "default" in _MDSpinner ? _MDSpinner.default : _MDSpinner
) as typeof _MDSpinner;

export interface SpinnerProps
  extends DistributiveOmit<
    ComponentPropsWithoutRef<typeof MDSpinner>,
    "color1" | "color2" | "color3" | "color4" | "singleColor"
  > {
  color1?: string;
  color2?: string;
  color3?: string;
  color4?: string;
  singleColor?: string;
}

const makeVar = (color: string) => `var(--${color})`;

const cls = bem("spinner");

export function Spinner({
  color1 = "spinner1",
  color2 = "spinner2",
  color3 = "spinner3",
  color4 = "spinner4",
  singleColor,
  className,
  ...props
}: SpinnerProps) {
  return (
    <MDSpinner
      {...props}
      role="progressbar"
      {...cls({ extra: className })}
      color1={makeVar(color1)}
      color2={makeVar(color2)}
      color3={makeVar(color3)}
      color4={makeVar(color4)}
      singleColor={singleColor && makeVar(singleColor)}
    />
  );
}
