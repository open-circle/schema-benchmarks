import { longDateFormatter } from "@schema-benchmarks/utils";
import { formatISOWithOptions } from "date-fns/fp";

import { useStyle } from "#src/shared/components/prefs/context";

export interface Formatters {
  normal?: Intl.DateTimeFormat;
  code?: (date: Date) => string;
}

export function useDateFormatter({
  normal: formatter = longDateFormatter,
  code: codeFormatter = formatISOWithOptions({ representation: "date" }),
}: Formatters = {}) {
  const { style } = useStyle();
  return (date: Date) => {
    if (style === "code") {
      return codeFormatter(date);
    }
    return formatter.format(date);
  };
}
