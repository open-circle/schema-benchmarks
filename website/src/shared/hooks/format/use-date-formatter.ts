import { longDateFormatter } from "@schema-benchmarks/utils";

import { useStyle } from "#src/shared/components/prefs/context";

export interface Formatters {
  normal?: Intl.DateTimeFormat;
  code?: (date: Date) => string;
}

export function useDateFormatter({
  normal: formatter = longDateFormatter,
  code: codeFormatter = (date) => date.toISOString().split("T")[0]!,
}: Formatters = {}) {
  const { style } = useStyle();
  return (date: Date) => {
    if (style === "code") {
      return codeFormatter(date);
    }
    return formatter.format(date);
  };
}
