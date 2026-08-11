import { clamp } from "@schema-benchmarks/utils";
import * as d3 from "d3";
import { useMemo } from "react";
import bem from "react-bem-helper";

import { MdSymbol } from "#src/shared/components/symbol";
import * as scales from "#src/shared/data/scale";
import { reverseIf } from "#src/shared/lib/d3";

export interface PieProps {
  value: number;
  /**
   * The maximum value for the pie chart.
   * @default 100
   */
  max?: number;
  lowerBetter?: boolean;
  showIcon?: boolean;
}

const cls = bem("pie");

export function Pie({ value, max = 100, lowerBetter = false, showIcon = false }: PieProps) {
  const percentage = useMemo(() => clamp((value / max) * 100, 0, 100), [value, max]);
  const colorScale = useMemo(
    () => d3.scaleQuantize([0, 100], reverseIf(lowerBetter, scales.color)),
    [lowerBetter],
  );
  const fillTurn = percentage / 100;
  const isComplete = Math.round(percentage) >= 100;

  return (
    <div {...cls({ modifiers: { complete: isComplete } })}>
      <div
        {...cls("fill")}
        style={{
          background: `conic-gradient(from -90deg, ${colorScale(percentage)} 0turn ${fillTurn}turn, transparent ${fillTurn}turn 1turn)`,
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
