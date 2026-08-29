import type * as Plot from "@observablehq/plot";
import { ClientOnly } from "@tanstack/react-router";
import type { FC, ReactNode } from "react";
import React from "react";

import { Spinner } from "#src/shared/components/spinner";

import "./index.css";

export interface PlotContainerProps {
  plot: ReturnType<typeof Plot.plot>;
  minWidth?: number;
  ref?: React.Ref<HTMLDivElement>;
  controls?: ReactNode;
}

export function createPlotComponent<TProps extends object>(
  useProps: (props: TProps) => PlotContainerProps,
): FC<TProps> {
  function PlotComponent(props: TProps) {
    const { plot, ref, minWidth, controls } = useProps(props);
    return (
      <div className="plot-scroll-container" ref={ref}>
        {controls && <div className="plot-controls">{controls}</div>}
        <div
          dir="ltr"
          className="plot-container"
          ref={(ref) => {
            if (!ref) return;

            ref.appendChild(plot);
            return () => plot.remove();
          }}
          style={{ minWidth }}
        />
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
