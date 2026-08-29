import type { ReactNode } from "react";

export interface ChartTooltipBodyProps {
  subhead: string;
  children: ReactNode;
  actions?: ReactNode;
  actionsLabel?: string;
}

export function getRank<T>(
  data: ReadonlyArray<T>,
  datum: T,
  getValue: (datum: T) => number,
  lowerBetter = false,
) {
  const value = getValue(datum);
  return (
    data.filter((candidate) =>
      lowerBetter ? getValue(candidate) < value : getValue(candidate) > value,
    ).length + 1
  );
}

export function ChartTooltipBody({
  subhead,
  children,
  actions,
  actionsLabel = "Actions",
}: ChartTooltipBodyProps) {
  return (
    <div className="chart-tooltip__content">
      <h6 className="chart-tooltip__subhead typo-caption">{subhead}</h6>
      <div className="chart-tooltip__supporting">{children}</div>
      {actions && (
        <div className="chart-tooltip__actions" role="toolbar" aria-label={actionsLabel}>
          {actions}
        </div>
      )}
    </div>
  );
}
