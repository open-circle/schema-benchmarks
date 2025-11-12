import type { ReactNode } from "react";
import { type Bounds, getColor, getIcon, getStatIcon } from "@/data/scale";
import { MdSymbol } from "../symbol";

export interface ScalerProps {
  value: number;
  bounds: Bounds;
  type?: "sentiment" | "stat";
  reverse?: boolean;
  children?: ReactNode;
}

export function Scaler({
  value,
  bounds,
  type = "sentiment",
  reverse,
  children,
}: ScalerProps) {
  return (
    <span className="scaler">
      {children}
      <MdSymbol
        style={{
          color: `var(--${getColor(value, bounds, reverse)})`,
        }}
      >
        {type === "sentiment"
          ? getIcon(value, bounds, reverse)
          : getStatIcon(value, bounds, reverse)}
      </MdSymbol>
    </span>
  );
}
