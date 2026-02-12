import { createOptionalContext } from "required-react-context";
import {
  type Style,
  styleSchema,
  type Theme,
  themeSchema,
} from "#/shared/lib/prefs/constants";

export const { ThemeContext, useTheme } = createOptionalContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: themeSchema.fallback,
  setTheme: () => {},
}).with({
  name: "theme",
});

export const { StyleContext, useStyle } = createOptionalContext<{
  style: Style;
  setStyle: (style: Style) => void;
}>({
  style: styleSchema.fallback,
  setStyle: () => {},
}).with({
  name: "style",
});
