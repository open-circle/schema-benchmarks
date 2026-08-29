import type { JsonComplianceResult } from "@schema-benchmarks/bench";
import type { ComplianceTarget } from "@schema-benchmarks/json-schema-tests/types";
import type { ComplianceType } from "@schema-benchmarks/schemas";
import { percentFormatter, uniqueBy } from "@schema-benchmarks/utils";
import { defineChart, ruleX, text, whenFocused } from "@tanstack/charts";
import type { ChartSpec } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react/tooltip";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { portal } from "@tanstack/charts/tooltip/portal";
import { useSuspenseQuery } from "@tanstack/react-query";
import { scaleQuantize } from "d3";
import { useMemo, useState } from "react";

import { getJsonSchemaBenchResults } from "#src/routes/json-schema/-query.ts";
import { processCount } from "#src/routes/json-schema/compliance/-constants";
import { Checkbox, ControlLabel } from "#src/shared/components/checkbox";
import { ColorDisplay } from "#src/shared/components/color";
import { ChartTooltipBody } from "#src/shared/components/plot/tooltip";
import { color } from "#src/shared/data/scale";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter";

const getLabel = ({ libraryName }: JsonComplianceResult) => libraryName;

export function BaseCompliancePlot({ data }: { data: Array<JsonComplianceResult> }) {
  const [showAllVariants, setShowAllVariants] = useState(false);
  const formatPercentage = useNumberFormatter(percentFormatter);

  // When collapsed, show only the best variant per library
  const collapsedData = useMemo(() => uniqueBy(data, getLabel), [data]);
  const displayData = showAllVariants ? data : collapsedData;
  const isCheckboxDisabled = data.length === collapsedData.length;

  const values = useMemo(
    () =>
      displayData.map((result) => {
        const compliance = processCount(result.results.count).pct;
        return { ...result, compliance };
      }),
    [displayData],
  );
  const libraries = useMemo(
    () =>
      uniqueBy(values, getLabel)
        .toSorted((a, b) => b.compliance - a.compliance)
        .map(getLabel),
    [values],
  );
  const height = Math.max(176, libraries.length * 28 + 52);
  const definition = useMemo(() => {
    const marks = [
      ruleX([1], { stroke: "currentColor", strokeDasharray: "4,2" }),
      text(values, {
        id: "compliance-results",
        key: (result) => `${result.libraryName}:${result.note ?? ""}:${result.compliance}`,
        x: "compliance",
        y: "libraryName",
        color: "compliance",
        text: () => "stat_0",
        anchor: "middle",
        fontSize: 18,
      }),
      whenFocused(
        text(values, {
          id: "compliance-focus",
          key: (result) => `${result.libraryName}:${result.note ?? ""}:${result.compliance}`,
          x: "compliance",
          y: "libraryName",
          fill: "currentColor",
          text: () => "nearby",
          anchor: "middle",
          fontSize: 18,
        }),
      ),
    ] as const;
    const spec = {
      marks,
      scales: {
        x: {
          scale: scaleLinear().domain([0, 1]),
          grid: true,
          axis: {
            label: "Compliance",
            ticks: { format: (value: number) => formatPercentage(value) },
          },
        },
        y: {
          scale: scaleBand().domain(libraries).padding(0.2),
          axis: { label: "Library", ticks: { size: 0, padding: 8 } },
        },
      },
      color: {
        scale: () => scaleQuantize(color),
        domain: [0, 1],
      },
    } satisfies ChartSpec<typeof marks>;

    return defineChart(() => spec, {
      focusRing: false,
      svgAnimation: { duration: 200, easing: "ease-out", respectReducedMotion: true },
      tooltip: {
        use: tooltip,
        portal,
        className: "chart-tooltip",
        placement: ["right", "left", "bottom", "top"],
      },
    });
  }, [formatPercentage, libraries, values]);

  const controls = (
    <ControlLabel>
      <Checkbox
        asLabel={false}
        checked={showAllVariants}
        onChange={(e) => setShowAllVariants(e.currentTarget.checked)}
        disabled={isCheckboxDisabled}
      />
      Show all variants
    </ControlLabel>
  );

  return (
    <div className="plot-scroll-container">
      <div className="plot-controls">{controls}</div>
      <Chart
        ariaLabel="JSON Schema compliance results"
        className="plot-container"
        definition={definition}
        height={height}
        renderTooltipBody={({ points }) => {
          const point = points[0];
          if (!point) return null;
          const result = point.datum;
          if (!result) return null;
          return (
            <ChartTooltipBody subhead={result.libraryName}>
              <dl>
                <div>
                  <dt>Compliance</dt>
                  <dd>
                    <ColorDisplay color={point.color} size="small" />
                    {formatPercentage(result.compliance)}
                  </dd>
                </div>
                {result.note && (
                  <div>
                    <dt>Note</dt>
                    <dd>{result.note}</dd>
                  </div>
                )}
              </dl>
            </ChartTooltipBody>
          );
        }}
      />
    </div>
  );
}

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
