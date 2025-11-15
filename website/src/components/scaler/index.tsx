import * as d3 from "d3";
import type { ReactNode } from "react";
import * as scales from "@/data/scale";
import { MdSymbol } from "../symbol";

interface ScaleOptions {
  type?: "sentiment" | "stat";
  lowerBetter?: boolean;
}

interface Scale {
  icon: ReactNode;
  color: string;
}

export interface ScalerProps extends Scale {
  children?: ReactNode;
}

export function getScaler(
  values: ReadonlyArray<d3.NumberValue>,
  { type = "sentiment", lowerBetter = false }: ScaleOptions = {},
) {
  const colorScale = lowerBetter ? scales.color.toReversed() : scales.color;
  const baseIcon = type === "sentiment" ? scales.sentiment : scales.stat;
  const iconScale = lowerBetter ? baseIcon.toReversed() : baseIcon;
  const color = d3.scaleQuantile(d3.extent(values), colorScale);
  const icon = d3.scaleQuantile(d3.extent(values), iconScale);
  return (value: d3.NumberValue): Scale => ({
    icon: icon(value),
    color: color(value),
  });
}

export function Scaler({ icon, color, children }: ScalerProps) {
  return (
    <span className="scaler">
      {children}
      <MdSymbol style={{ color }}>{icon}</MdSymbol>
    </span>
  );
}
