import type * as Plot from "@observablehq/plot";
import { ClientOnly } from "@tanstack/react-router";
import { type FC, useEffect, useRef } from "react";
import { Spinner } from "../spinner";

export interface PlotContainerProps {
  plot: ReturnType<typeof Plot.plot>;
  minWidth?: number;
  ref?: React.Ref<HTMLDivElement>;
}

export function createPlotComponent<TProps extends object>(
  useProps: (props: TProps) => PlotContainerProps,
): FC<TProps> {
  function PlotComponent(props: TProps) {
    const { plot, ref, minWidth } = useProps(props);
    const innerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      innerRef.current?.appendChild(plot);
      return () => plot.remove();
    }, [plot]);
    return (
      <div className="plot-scroll-container" ref={ref}>
        <div dir="ltr" className="plot-container" ref={innerRef} style={{ minWidth }} />
      </div>
    );
  }
  return function WrapperComponent(props: TProps) {
    return (
      <ClientOnly
        fallback={
          <div dir="ltr" className="plot-container">
            <Spinner size={64} />
          </div>
        }
      >
        <PlotComponent {...props} />
      </ClientOnly>
    );
  };
}
