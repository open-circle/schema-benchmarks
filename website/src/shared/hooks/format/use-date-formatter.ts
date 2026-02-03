import { useStyle } from "#/shared/components/prefs/context";

export function useDateFormatter(formatter: Intl.DateTimeFormat) {
  const { style } = useStyle();
  return (date: Date) => {
    if (style === "code") {
      return date.toISOString().split("T")[0];
    }
    return formatter.format(date);
  };
}
