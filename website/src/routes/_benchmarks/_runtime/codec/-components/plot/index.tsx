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

import { getBenchResults } from "#src/routes/_benchmarks/_runtime/-query";
import { createPlotComponent } from "#src/shared/components/plot";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter";
import { useElementSize } from "#src/shared/hooks/use-content-box-size";

const getLabel = (d: CodecResult) => d.libraryName + (d.acceptsUnknown ? " *" : "");

export const BaseCodecPlot = createPlotComponent(function useBenchPlot({
  data,
}: {
  data: Array<CodecResult>;
}) {
  const formatNumber = useNumberFormatter(shortNumFormatter);
  const values = useMemo(() => uniqueBy(data, (d) => d.libraryName), [data]);
  const points = useMemo(
    () =>
      values.flatMap((result) => [
        {
          library: getLabel(result),
          operation: "Encode",
          mean: result.encode.mean,
        },
        {
          library: getLabel(result),
          operation: "Decode",
          mean: result.decode.mean,
        },
      ]),
    [values],
  );
  const [domRect, ref] = useElementSize();
  const { height, marginLeft, yDomain } = useMemo(() => {
    const longestLabel = values.reduce((a, b) => (getLabel(a).length > getLabel(b).length ? a : b));
    return {
      height: Math.max(176, values.length * 28 + 52),
      marginLeft: Math.max(84, getLabel(longestLabel).length * 7 + 24),
      yDomain: values
        .toSorted((a, b) => a.encode.mean + a.decode.mean - (b.encode.mean + b.decode.mean))
        .map(getLabel),
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
          grid: true,
          label: "Time",
          tickFormat: (d: number) => durationFormatter.format(getDuration(d)),
          nice: true,
        },
        y: {
          domain: yDomain,
          label: "Library",
          tickSize: 0,
        },
        color: {
          domain: ["Encode", "Decode"],
          range: ["var(--link)", "var(--button)"],
        },
        marks: [
          Plot.ruleX([0]),
          Plot.dotX(points, {
            x: "mean",
            y: { value: "library", label: "Library" },
            fill: { value: "operation", label: "Operation" },
            r: 5,
            symbol: "diamond2",
            tip: {
              pointer: "xy",
              className: "plot__tooltip",
              pathFilter: "",
              format: {
                x: (d: number) =>
                  `${formatNumber(d)} ms (${durationFormatter.format(getDuration(d, 2))})`,
                y: (d: string) => d,
                fill: (d: string) => d,
              },
            },
          }),
        ],
      }),
    [domRect?.width, formatNumber, height, marginLeft, points, yDomain],
  );
  return { plot, ref };
});

BaseCodecPlot.displayName = "BaseCodecPlot";

export function CodecPlot() {
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) => results.codec,
  });
  return <BaseCodecPlot data={data} />;
}
