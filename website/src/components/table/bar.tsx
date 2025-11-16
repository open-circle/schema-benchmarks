import { bem } from "@schema-benchmarks/utils";
import * as d3 from "d3";
import * as scales from "@/data/scale";

export interface BarProps {
  color: string;
  percentage: number;
}

export function getBarScale(
  values: ReadonlyArray<d3.NumberValue>,
  { lowerBetter = false }: { lowerBetter?: boolean } = {},
) {
  const percentage = d3.scaleLinear(
    [0, d3.max(values)].filter((d) => d != null),
    [0, 100],
  );
  const color = d3.scaleQuantile(
    d3.extent(values),
    lowerBetter ? scales.color.toReversed() : scales.color,
  );
  return (value: d3.NumberValue): BarProps => ({
    color: color(value),
    percentage: percentage(value),
  });
}

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
