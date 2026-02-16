import * as d3 from "d3";
import type { ReactNode } from "react";

import * as scales from "#/shared/data/scale";
import { combineScales, reverseIf } from "#/shared/lib/d3";

import { MdSymbol } from "../symbol";

interface ScaleOptions {
  type?: "sentiment" | "stat";
  lowerBetter?: boolean;
}

interface ScalerScale {
  icon: ReactNode;
  color: string;
}

export interface ScalerProps extends ScalerScale {
  children?: ReactNode;
  symbolLabel?: string;
}

const getScalerScale = (
  values: ReadonlyArray<d3.NumberValue>,
  { type = "sentiment", lowerBetter = false }: ScaleOptions = {},
) => {
  const iconScale = d3.scaleQuantile(
    d3.extent(values),
    reverseIf(lowerBetter, type === "sentiment" ? scales.sentiment : scales.stat),
  );
  return combineScales<ScalerScale>({
    icon: (number) => <MdSymbol>{iconScale(number)}</MdSymbol>,
    color: d3.scaleQuantile(d3.extent(values), reverseIf(lowerBetter, scales.color)),
  });
};

export function Scaler({ icon, color, children, symbolLabel }: ScalerProps) {
  return (
    <span className="scaler">
      {children}
      <div style={{ color }} aria-label={symbolLabel}>
        {icon}
      </div>
    </span>
  );
}

Scaler.getScale = getScalerScale;
