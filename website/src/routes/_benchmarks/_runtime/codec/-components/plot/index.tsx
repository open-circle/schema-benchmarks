import * as Plot from "@observablehq/plot";
import type { CodecResult } from "@schema-benchmarks/bench";
import { durationFormatter, getDuration, uniqueBy } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { formatLibraryName } from "#/routes/_benchmarks/-lib";
import { createPlotComponent } from "#/shared/components/plot";
import { color } from "#/shared/data/scale";
import { useElementSize } from "#/shared/hooks/use-content-box-size";

import { getBenchResults } from "../../../-query";

const getLabel = (d: CodecResult) => formatLibraryName(d.libraryName);

export const BaseCodecPlot = createPlotComponent(function useBenchPlot({
  data,
  encodeDir,
}: {
  data: Array<CodecResult>;
  encodeDir: "encode" | "decode";
}) {
  const values = useMemo(() => uniqueBy(data, (d) => d.libraryName), [data]);
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
        y: {
          grid: true,
          label: "Time",
          tickFormat: (d: number) => durationFormatter.format(getDuration(d)),
        },
        fy: {
          axis: "left",
        },
        color: {
          type: "quantize",
          reverse: true,
          range: color,
        },
        marks: [
          Plot.ruleY([0]),
          Plot.barY(values, {
            x: getLabel,
            y: (d: CodecResult) => d[encodeDir].mean,
            fill: (d: CodecResult) => d[encodeDir].mean,
            sort: { x: "y" },
          }),
        ],
      }),
    [values, encodeDir, minWidth, domRect?.width],
  );
  return { plot, ref, minWidth };
});

BaseCodecPlot.displayName = "BaseCodecPlot";

export function CodecPlot({ encodeDir }: { encodeDir: "encode" | "decode" }) {
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) => results.codec,
  });
  return <BaseCodecPlot {...{ data, encodeDir }} />;
}
