import { clamp } from "@schema-benchmarks/utils";
import * as d3 from "d3";
import bem from "react-bem-helper";

import { MdSymbol } from "#src/shared/components/symbol";
import * as scales from "#src/shared/data/scale";
import { combineScales, reverseIf } from "#src/shared/lib/d3";

export interface PieProps {
  color: string;
  percentage: number;
  lowerBetter?: boolean;
  showIcon?: boolean;
}

const getPieScale = (
  _values: ReadonlyArray<d3.NumberValue>,
  { lowerBetter = false, max = 100 }: { lowerBetter?: boolean; max?: number } = {},
) =>
  combineScales<PieProps>({
    color: d3.scaleQuantize([0, max], reverseIf(lowerBetter, scales.color)),
    percentage: d3.scaleLinear([0, max], [0, 100]),
  });

const cls = bem("pie");

export function Pie({ color, percentage, lowerBetter = false, showIcon = false }: PieProps) {
  const clampedPct = clamp(percentage, 0, 100);
  const fillTurn = clampedPct / 100;
  const isComplete = Math.round(clampedPct) >= 100;

  return (
    <div {...cls({ modifiers: { complete: isComplete } })}>
      <div
        {...cls("fill")}
        style={{
          background: `conic-gradient(from -90deg, ${color} 0turn ${fillTurn}turn, transparent ${fillTurn}turn 1turn)`,
        }}
      />
      {showIcon && (
        <span {...cls("icon")}>
          <MdSymbol>{lowerBetter ? "close_small" : "check_small"}</MdSymbol>
        </span>
      )}
    </div>
  );
}

Pie.getScale = getPieScale;
