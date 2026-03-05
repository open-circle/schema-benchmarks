import * as Plot from "@observablehq/plot";
import type { CodecResult } from "@schema-benchmarks/bench";
import {
  durationFormatter,
  getDuration,
  shortNumFormatter,
  uniqueBy,
} from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { createPlotComponent } from "#/shared/components/plot";
import { color } from "#/shared/data/scale";
import { useNumberFormatter } from "#/shared/hooks/format/use-number-formatter";
import { useElementSize } from "#/shared/hooks/use-content-box-size";

import { getBenchResults } from "../../../-query";

const getLabel = (d: CodecResult) => d.libraryName + (d.acceptsUnknown ? " *" : "");

export const BaseCodecPlot = createPlotComponent(function useBenchPlot({
  data,
  encodeDir,
}: {
  data: Array<CodecResult>;
  encodeDir: "encode" | "decode";
}) {
  const formatNumber = useNumberFormatter(shortNumFormatter);
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
        x: {
          label: "Library",
        },
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
            tip: {
              pointer: "x",
              className: "plot__tooltip",
              pathFilter: "",
              format: {
                y: (d: number) =>
                  `${formatNumber(d)} ms (${durationFormatter.format(getDuration(d, 2))})`,
                fill: false,
              },
            },
          }),
        ],
      }),
    [values, encodeDir, minWidth, domRect?.width, formatNumber],
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
