import * as Plot from "@observablehq/plot";
import type { JsonComplianceResult } from "@schema-benchmarks/bench";
import type { ComplianceTarget } from "@schema-benchmarks/json-schema-tests/types";
import type { ComplianceType } from "@schema-benchmarks/schemas";
import { percentFormatter, uniqueBy } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getJsonSchemaBenchResults } from "#src/routes/json-schema/-query.ts";
import { processCount } from "#src/routes/json-schema/compliance/-constants";
import { createPlotComponent } from "#src/shared/components/plot";
import { color } from "#src/shared/data/scale";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter";
import { useElementSize } from "#src/shared/hooks/use-content-box-size";

const getLabel = ({ libraryName }: JsonComplianceResult) => libraryName;

export const BaseCompliancePlot = createPlotComponent(function useCompliancePlot({
  data,
}: {
  data: Array<JsonComplianceResult>;
}) {
  const formatPercentage = useNumberFormatter(percentFormatter);
  const values = useMemo(
    () =>
      uniqueBy(
        data.toSorted(
          (a, b) => processCount(b.results.count).pct - processCount(a.results.count).pct,
        ),
        getLabel,
      ),
    [data],
  );
  const [domRect, ref] = useElementSize();
  const { height, marginLeft } = useMemo(() => {
    const longestLabel = values.reduce((a, b) => (getLabel(a).length > getLabel(b).length ? a : b));
    return {
      height: Math.max(176, values.length * 28 + 52),
      marginLeft: Math.max(84, getLabel(longestLabel).length * 7 + 24),
    };
  }, [values]);
  const plot = useMemo(
    () =>
      Plot.plot({
        style: {
          fontFamily: "var(--font-family-body)",
          textTransform: "none",
        },
        marginLeft,
        width: domRect?.width ?? 0,
        height,
        x: {
          domain: [0, 1],
          grid: true,
          label: "Compliance",
          tickFormat: formatPercentage,
        },
        y: {
          label: "Library",
          tickSize: 0,
        },
        color: {
          domain: [0, 1],
          type: "quantize",
          range: color,
        },
        marks: [
          Plot.ruleX([1], { stroke: "currentColor", strokeDasharray: "4,2" }),
          Plot.dotX(values, {
            x: (result) => processCount(result.results.count).pct,
            y: { value: getLabel, label: "Library" },
            fill: (result) => processCount(result.results.count).pct,
            r: 5,
            symbol: "diamond2",
            sort: { y: "x", reverse: true },
            tip: {
              pointer: "y",
              className: "plot__tooltip",
              pathFilter: "",
              format: {
                x: formatPercentage,
                y: (d: string) => d,
                fill: false,
              },
            },
          }),
        ],
      }),
    [values, domRect?.width, formatPercentage, height, marginLeft],
  );
  return { plot, ref };
});

BaseCompliancePlot.displayName = "BaseCompliancePlot";

export interface CompliancePlotProps {
  type: ComplianceType;
  target: ComplianceTarget;
}

export function CompliancePlot({ type, target }: CompliancePlotProps) {
  const { data } = useSuspenseQuery({
    ...getJsonSchemaBenchResults(),
    select: (results) => results.compliance[type]?.[target] ?? [],
  });
  return <BaseCompliancePlot data={data} />;
}
