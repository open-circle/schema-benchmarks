import { useCallback } from "react";

import { useStyle } from "#/shared/components/prefs/context";

export function useDateFormatter(formatter: Intl.DateTimeFormat) {
  const { style } = useStyle();
  return useCallback(
    (date: Date) => {
      if (style === "code") {
        return date.toISOString().split("T")[0];
      }
      return formatter.format(date);
    },
    [style, formatter],
  );
}
