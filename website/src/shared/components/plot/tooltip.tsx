import type { ReactNode } from "react";

export interface ChartTooltipBodyProps {
  subhead: string;
  children: ReactNode;
}

export function ChartTooltipBody({ subhead, children }: ChartTooltipBodyProps) {
  return (
    <div className="chart-tooltip__content">
      <h6 className="chart-tooltip__subhead typo-caption">{subhead}</h6>
      <div className="chart-tooltip__supporting">{children}</div>
    </div>
  );
}
