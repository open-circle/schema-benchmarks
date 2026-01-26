import * as d3 from "d3";
import bem from "react-bem-helper";
import * as scales from "@/shared/data/scale";
import { combineScales, reverseIf } from "@/shared/lib/d3";

export interface BarProps {
  color: string;
  percentage: number;
}

const getBarScale = (
  values: ReadonlyArray<d3.NumberValue>,
  { lowerBetter = false }: { lowerBetter?: boolean } = {},
) =>
  combineScales<BarProps>({
    color: d3.scaleQuantile(
      d3.extent(values),
      reverseIf(lowerBetter, scales.color),
    ),
    percentage: d3.scaleLinear([0, d3.max(values) ?? 0], [0, 100]),
  });

const cls = bem("bar");

export function Bar({ color, percentage }: BarProps) {
  return (
    <div {...cls()}>
      <div
        {...cls("fill")}
        style={{
          backgroundColor: color,
          width: `${percentage}%`,
        }}
      />
    </div>
  );
}

Bar.getScale = getBarScale;
