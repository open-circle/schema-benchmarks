import { bem } from "@schema-benchmarks/utils";
import * as d3 from "d3";
import * as scales from "@/data/scale";
import { combineScales, reverseIf } from "@/lib/d3";

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
    <div className={cls()}>
      <div
        className={cls("fill")}
        style={{
          backgroundColor: color,
          width: `${percentage}%`,
        }}
      />
    </div>
  );
}

Bar.getScale = getBarScale;
