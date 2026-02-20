import { longDateFormatter } from "@schema-benchmarks/utils";
import { useMemo } from "react";

import { useDateFormatter } from "#/shared/hooks/format/use-date-formatter";

export interface DateDisplayProps {
  date: Date | string | number;
  formatter?: Intl.DateTimeFormat;
}

export function DateDisplay({ date, formatter }: DateDisplayProps) {
  const parsedDate = useMemo(() => (date instanceof Date ? date : new Date(date)), [date]);
  const formatDate = useDateFormatter(formatter ?? longDateFormatter);
  return <time dateTime={parsedDate.toISOString()}>{formatDate(parsedDate)}</time>;
}
