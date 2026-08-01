import * as d3 from "d3";
import bem from "react-bem-helper";

import * as scales from "#src/shared/data/scale";
import { combineScales, reverseIf } from "#src/shared/lib/d3";

export interface PieProps {
  color: string;
  percentage: number;
}

const getPieScale = (
  values: ReadonlyArray<d3.NumberValue>,
  { lowerBetter = false }: { lowerBetter?: boolean } = {},
) =>
  combineScales<PieProps>({
    color: d3.scaleQuantile(d3.extent(values), reverseIf(lowerBetter, scales.color)),
    percentage: d3.scaleLinear([0, d3.max(values) ?? 0], [0, 100]),
  });

const cls = bem("pie");

export function Pie({ color, percentage }: PieProps) {
  const normalizedPercentage = Math.min(100, Math.max(0, percentage));
  const fillTurn = normalizedPercentage / 100;

  return (
    <div {...cls()}>
      <div
        {...cls("fill")}
        style={{
          background: `conic-gradient(from -90deg, ${color} 0turn ${fillTurn}turn, transparent ${fillTurn}turn 1turn)`,
        }}
      />
    </div>
  );
}

Pie.getScale = getPieScale;
