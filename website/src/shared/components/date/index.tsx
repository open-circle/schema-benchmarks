import { longDateFormatter } from "@schema-benchmarks/utils";
import { useMemo } from "react";

import { useDateFormatter } from "#src/shared/hooks/format/use-date-formatter";

export type DateInput = Date | string | number;

export interface DateDisplayProps {
  date: DateInput;
  formatter?: Intl.DateTimeFormat;
}

export function DateDisplay({ date, formatter }: DateDisplayProps) {
  const parsedDate = useMemo(() => (date instanceof Date ? date : new Date(date)), [date]);
  const formatDate = useDateFormatter(formatter ?? longDateFormatter);
  return <time dateTime={parsedDate.toISOString()}>{formatDate(parsedDate)}</time>;
}
