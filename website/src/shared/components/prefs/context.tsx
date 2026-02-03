import { createRequiredContext } from "required-react-context";
import type { Style, Theme } from "#/shared/lib/prefs/constants";

export const { ThemeContext, useTheme } = createRequiredContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>().with({
  name: "theme",
});

export const { StyleContext, useStyle } = createRequiredContext<{
  style: Style;
  setStyle: (style: Style) => void;
}>().with({
  name: "style",
});
