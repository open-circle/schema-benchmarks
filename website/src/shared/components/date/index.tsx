import { useMemo } from "react";

import type { Formatters } from "#src/shared/hooks/format/use-date-formatter";
import { useDateFormatter } from "#src/shared/hooks/format/use-date-formatter";

export type DateInput = Date | string | number;

export interface DateDisplayProps {
  date: DateInput;
  formatters?: Formatters;
}

export function DateDisplay({ date, formatters }: DateDisplayProps) {
  const parsedDate = useMemo(() => (date instanceof Date ? date : new Date(date)), [date]);
  const formatDate = useDateFormatter(formatters);
  return <time dateTime={parsedDate.toISOString()}>{formatDate(parsedDate)}</time>;
}

export interface RangeDisplayProps {
  startDate: DateInput;
  endDate: DateInput;
  formatters?: Formatters;
}

export function RangeDisplay({ startDate, endDate, formatters }: RangeDisplayProps) {
  const parsedStartDate = useMemo(
    () => (startDate instanceof Date ? startDate : new Date(startDate)),
    [startDate],
  );
  const parsedEndDate = useMemo(
    () => (endDate instanceof Date ? endDate : new Date(endDate)),
    [endDate],
  );
  const formatDate = useDateFormatter(formatters);
  return (
    <span>
      <time dateTime={parsedStartDate.toISOString()}>{formatDate(parsedStartDate)}</time>
      {" – "}
      <time dateTime={parsedEndDate.toISOString()}>{formatDate(parsedEndDate)}</time>
    </span>
  );
}
