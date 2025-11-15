import type * as Plot from "@observablehq/plot";
import { ClientOnly } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export interface PlotContainerProps {
  plot: ReturnType<typeof Plot.plot>;
}

export function PlotContainer({ plot }: PlotContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.appendChild(plot);
    return () => plot.remove();
  }, [plot]);
  return (
    <ClientOnly fallback={<div dir="ltr" className="plot-container" />}>
      <div dir="ltr" className="plot-container" ref={ref} />
    </ClientOnly>
  );
}
