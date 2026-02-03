import { useStyle } from "#/shared/components/prefs/context";

const codeSeparators: Partial<Record<Intl.NumberFormatPartTypes, string>> = {
  group: "_",
  decimal: ".",
};

export function useNumberFormatter(formatter: Intl.NumberFormat) {
  const { style } = useStyle();
  return (number: number) => {
    if (style === "code") {
      return formatter
        .formatToParts(number)
        .map(({ type, value }) => codeSeparators[type] ?? value)
        .join("");
    }
    return formatter.format(number);
  };
}
