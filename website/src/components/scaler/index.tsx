import type { ReactNode } from "react";
import { type Bounds, getColor, getIcon, getStatIcon } from "@/data/scale";
import { MdSymbol } from "../symbol";

export interface ScalerProps {
  value: number;
  bounds: Bounds;
  type?: "sentiment" | "stat";
  lowerBetter?: boolean;
  children?: ReactNode;
}

export function Scaler({
  value,
  bounds,
  type = "sentiment",
  lowerBetter,
  children,
}: ScalerProps) {
  return (
    <span className="scaler">
      {children}
      <MdSymbol
        style={{
          color: getColor(value, bounds, lowerBetter),
        }}
      >
        {type === "sentiment"
          ? getIcon(value, bounds, lowerBetter)
          : getStatIcon(value, bounds, lowerBetter)}
      </MdSymbol>
    </span>
  );
}
