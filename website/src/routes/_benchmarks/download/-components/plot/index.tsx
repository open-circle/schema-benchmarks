import type { DownloadResult, MinifyType } from "@schema-benchmarks/bench";
import { formatBytes, uniqueBy } from "@schema-benchmarks/utils";
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

import { getCompiledPath, getDownloadResults } from "#src/routes/_benchmarks/download/-query";
import { InternalLinkToggleButton } from "#src/shared/components/button/toggle";
import { Checkbox, ControlLabel } from "#src/shared/components/checkbox";
import { ChartTooltipBody } from "#src/shared/components/plot/tooltip";
import { MdSymbol } from "#src/shared/components/symbol";
import { color } from "#src/shared/data/scale";

export function BaseDownloadPlot({
  data,
  minify,
}: {
  data: Array<DownloadResult>;
  minify: MinifyType;
}) {
  const [showAllVariants, setShowAllVariants] = useState(false);

  // When collapsed, show only the best variant per library
  const collapsedData = useMemo(() => uniqueBy(data, (d) => d.libraryName), [data]);
  const displayData = showAllVariants ? data : collapsedData;
  const isCheckboxDisabled = data.length === collapsedData.length;

  const libraries = useMemo(
    () =>
      uniqueBy(displayData, (d) => d.libraryName)
        .toSorted((a, b) => a.gzipBytes - b.gzipBytes)
        .map((d) => d.libraryName),
    [displayData],
  );
  const height = Math.max(176, libraries.length * 28 + 52);
  const definition = useMemo(() => {
    const marks = [
      ruleX([0], { stroke: "currentColor" }),
      text(displayData, {
        id: "download-results",
        key: (result) => `${result.libraryName}:${result.fileName}`,
        x: "gzipBytes",
        y: "libraryName",
        color: "gzipBytes",
        text: () => "stat_0",
        anchor: "middle",
        fontSize: 18,
      }),
      whenFocused(
        text(displayData, {
          id: "download-focus",
          key: (result) => `${result.libraryName}:${result.fileName}`,
          x: "gzipBytes",
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
          scale: scaleLinear,
          grid: true,
          nice: true,
          axis: {
            label: "Size (gzipped)",
            ticks: { format: (bytes: number) => formatBytes(bytes, { maximumFractionDigits: 0 }) },
          },
        },
        y: {
          scale: scaleBand().domain(libraries).padding(0.2),
          axis: { label: "Library", ticks: { size: 0, padding: 8 } },
        },
      },
      color: { scale: () => scaleQuantize(color) },
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
  }, [displayData, libraries]);

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
        ariaLabel="Download benchmark results"
        className="plot-container"
        definition={definition}
        height={height}
        renderTooltipBody={({ pinned, points }) => {
          const result = points[0]?.datum;
          if (!result) return null;
          return (
            <ChartTooltipBody
              subhead={result.libraryName}
              actionsLabel="Links to files used"
              actions={
                pinned && (
                  <>
                    <InternalLinkToggleButton
                      to="/repo/raw/$"
                      params={{ _splat: `schemas/libraries/${result.fileName}` }}
                      preload={false}
                      target="_blank"
                      rel="noreferrer noopener"
                      tooltip="Open source"
                    >
                      <MdSymbol>code</MdSymbol>
                    </InternalLinkToggleButton>
                    <InternalLinkToggleButton
                      to="/repo/raw/$"
                      params={{
                        _splat: `schemas/libraries/${getCompiledPath(result.fileName, minify)}`,
                      }}
                      preload={false}
                      target="_blank"
                      rel="noreferrer noopener"
                      tooltip="Open compiled"
                    >
                      <MdSymbol>deployed_code</MdSymbol>
                    </InternalLinkToggleButton>
                  </>
                )
              }
            >
              <dl>
                <div>
                  <dt>Size (gzipped)</dt>
                  <dd>{formatBytes(result.gzipBytes, { maximumFractionDigits: 0 })}</dd>
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

export function DownloadPlot({ minify }: { minify: MinifyType }) {
  const { data } = useSuspenseQuery({
    ...getDownloadResults(),
    select: (results) => results[minify],
  });
  return <BaseDownloadPlot data={data} minify={minify} />;
}
