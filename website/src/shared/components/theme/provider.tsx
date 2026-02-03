import { useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { setThemeFn, type Theme } from "#/shared/lib/theme";
import { ThemeContext } from "./context";

export function ThemeProvider({
  children,
  theme,
}: {
  children: ReactNode;
  theme: Theme;
}) {
  const router = useRouter();

  function setTheme(val: Theme) {
    setThemeFn({ data: val }).then(() => router.invalidate());
  }

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}
