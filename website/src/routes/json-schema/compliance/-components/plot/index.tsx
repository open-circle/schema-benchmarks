import * as Plot from "@observablehq/plot";
import type { JsonComplianceResult } from "@schema-benchmarks/bench";
import type { ComplianceTarget } from "@schema-benchmarks/json-schema-tests/types";
import type { ComplianceType } from "@schema-benchmarks/schemas";
import { percentFormatter, uniqueBy } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getJsonSchemaBenchResults } from "#src/routes/json-schema/_conversion/-query";
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
  const minWidth = useMemo(() => {
    const longestLabel = values.reduce((a, b) => (getLabel(a).length > getLabel(b).length ? a : b));
    return values.length * (getLabel(longestLabel).length * 6) + 48;
  }, [values]);
  const plot = useMemo(
    () =>
      Plot.plot({
        style: {
          fontFamily: "var(--font-family-body)",
          textTransform: "none",
        },
        marginLeft: 48,
        width: Math.max(domRect?.width ?? 0, minWidth),
        x: {
          label: "Library",
        },
        y: {
          domain: [0, 1],
          grid: true,
          label: "Compliance",
          tickFormat: formatPercentage,
        },
        color: {
          domain: [0, 1],
          type: "quantize",
          range: color,
        },
        marks: [
          Plot.ruleY([0]),
          Plot.barY(values, {
            x: getLabel,
            y: (result) => processCount(result.results.count).pct,
            fill: (result) => processCount(result.results.count).pct,
            sort: { x: "y" },
            tip: {
              pointer: "x",
              className: "plot__tooltip",
              pathFilter: "",
              format: {
                y: formatPercentage,
                fill: false,
              },
            },
          }),
        ],
      }),
    [values, domRect?.width, minWidth, formatPercentage],
  );
  return { plot, ref, minWidth };
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
