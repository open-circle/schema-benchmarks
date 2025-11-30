import type { DistributiveOmit } from "@schema-benchmarks/utils";
import * as d3 from "d3";
import type { ReactNode } from "react";
import * as scales from "@/data/scale";
import { combineScales, reverseIf } from "@/lib/d3";

interface ScaleOptions {
  type?: "sentiment" | "stat";
  lowerBetter?: boolean;
}

interface ScalerScale {
  icon: string;
  color: string;
}

export interface ScalerProps extends DistributiveOmit<ScalerScale, "icon"> {
  icon: ReactNode;
  children?: ReactNode;
  symbolLabel?: string;
}

const getScalerScale = (
  values: ReadonlyArray<d3.NumberValue>,
  { type = "sentiment", lowerBetter = false }: ScaleOptions = {},
) =>
  combineScales<ScalerScale>({
    icon: d3.scaleQuantile(
      d3.extent(values),
      reverseIf(
        lowerBetter,
        type === "sentiment" ? scales.sentiment : scales.stat,
      ),
    ),
    color: d3.scaleQuantile(
      d3.extent(values),
      reverseIf(lowerBetter, scales.color),
    ),
  });

export function Scaler({ icon, color, children, symbolLabel }: ScalerProps) {
  return (
    <span className="scaler">
      {children}
      {/** biome-ignore lint/a11y/useAriaPropsSupportedByRole: wat */}
      <div style={{ color }} aria-label={symbolLabel}>
        {icon}
      </div>
    </span>
  );
}

Scaler.getScale = getScalerScale;
