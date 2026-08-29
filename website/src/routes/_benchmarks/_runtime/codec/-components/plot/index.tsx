import type { CodecResult } from "@schema-benchmarks/bench";
import {
  durationFormatter,
  getDuration,
  shortNumFormatter,
  uniqueBy,
} from "@schema-benchmarks/utils";
import { defineChart, ruleX, text } from "@tanstack/charts";
import type { ChartSpec } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react/tooltip";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { portal } from "@tanstack/charts/tooltip/portal";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useMemo, useState } from "react";

import { getBenchResults } from "#src/routes/_benchmarks/_runtime/-query";
import { Checkbox, ControlLabel } from "#src/shared/components/checkbox";
import { CodeBlock } from "#src/shared/components/code";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter";

const getBehavior = (d: CodecResult) => (d.acceptsUnknown ? "Accepts unknown input" : undefined);

export function BaseCodecPlot({ data }: { data: Array<CodecResult> }) {
  const [showAllVariants, setShowAllVariants] = useState(false);
  const formatNumber = useNumberFormatter(shortNumFormatter);

  // When collapsed, show only the best variant per library
  const collapsedData = useMemo(() => uniqueBy(data, (d) => d.libraryName), [data]);
  const displayData = showAllVariants ? data : collapsedData;
  const isCheckboxDisabled = data.length === collapsedData.length;

  // Every codec benchmark variant for a library is shown, not just the first one.
  const points = useMemo(
    () =>
      displayData.flatMap((result) => [
        {
          library: result.libraryName,
          operation: "Encode",
          mean: result.encode.mean,
          note: result.note,
          behavior: getBehavior(result),
          snippet: result.encode.snippet,
        },
        {
          library: result.libraryName,
          operation: "Decode",
          mean: result.decode.mean,
          note: result.note,
          behavior: getBehavior(result),
          snippet: result.decode.snippet,
        },
      ]),
    [displayData],
  );
  const libraries = useMemo(
    () =>
      uniqueBy(displayData, (d) => d.libraryName)
        .toSorted(
          (a, b) => Math.min(a.encode.mean, a.decode.mean) - Math.min(b.encode.mean, b.decode.mean),
        )
        .map((d) => d.libraryName),
    [displayData],
  );
  const height = Math.max(176, libraries.length * 28 + 52);
  const definition = useMemo(() => {
    const marks = [
      ruleX([0], { stroke: "currentColor" }),
      text(points, {
        id: "codec-results",
        key: (point) => `${point.library}:${point.note ?? ""}:${point.operation}`,
        x: "mean",
        y: "library",
        color: "operation",
        text: () => "\u25A0",
        rotate: 45,
        anchor: "middle",
        fontSize: 14,
        states: [{ when: { focus: "primary" }, style: { stroke: "currentColor", strokeWidth: 2 } }],
      }),
    ] as const;
    const spec = {
      marks,
      scales: {
        x: {
          scale: scaleLinear,
          grid: true,
          nice: true,
          axis: {
            label: "Time",
            ticks: {
              format: (duration: number) => durationFormatter.format(getDuration(duration)),
            },
          },
        },
        y: {
          scale: scaleBand().domain(libraries).padding(0.2),
          axis: { label: "Library", ticks: false },
        },
      },
      color: { domain: ["Encode", "Decode"], range: ["var(--link)", "var(--button)"] },
    } satisfies ChartSpec<typeof marks>;

    return defineChart(() => spec, {
      focusRing: false,
      svgAnimation: { duration: 200, easing: "ease-out", respectReducedMotion: true },
      tooltip: {
        use: tooltip,
        portal,
        placement: ["right", "left", "bottom", "top"],
      },
    });
  }, [libraries, points]);

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
        ariaLabel="Codec benchmark results"
        className="plot-container"
        definition={definition}
        height={height}
        renderTooltipBody={({ defaultBody, points: focusedPoints }) => {
          const point = focusedPoints[0]?.datum;
          return (
            <>
              {defaultBody}
              {point && (
                <dl>
                  <div>
                    <dt>{point.operation}</dt>
                    <dd>{`${formatNumber(point.mean)} ms (${durationFormatter.format(getDuration(point.mean, 2))})`}</dd>
                  </div>
                  {point.note && (
                    <div>
                      <dt>Note</dt>
                      <dd>{point.note}</dd>
                    </div>
                  )}
                  {point.behavior && (
                    <div>
                      <dt>Behavior</dt>
                      <dd>{point.behavior}</dd>
                    </div>
                  )}
                </dl>
              )}
              {point?.snippet && (
                <Suspense fallback={null}>
                  <CodeBlock>{point.snippet}</CodeBlock>
                </Suspense>
              )}
            </>
          );
        }}
      />
    </div>
  );
}

export function CodecPlot() {
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) => results.codec,
  });
  return <BaseCodecPlot data={data} />;
}
