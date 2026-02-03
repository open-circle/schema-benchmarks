import { createRequiredContext } from "required-react-context";
import type { Theme } from "#/shared/lib/theme";

export const { ThemeContext, useTheme } = createRequiredContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>().with({
  name: "theme",
});
