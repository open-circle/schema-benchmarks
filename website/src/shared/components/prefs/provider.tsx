import { rootRouteId, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { setStyleFn, setThemeFn } from "#/shared/lib/prefs";
import type { Style, Theme } from "#/shared/lib/prefs/constants";
import { StyleContext, ThemeContext } from "./context";

export function ThemeProvider({ children, theme }: { children: ReactNode; theme: Theme }) {
  const router = useRouter();

  function setTheme(val: Theme) {
    setThemeFn({ data: val }).then(() =>
      router.invalidate({
        filter: (d) => d.id === rootRouteId,
      }),
    );
  }

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}

export function StyleProvider({ children, style }: { children: ReactNode; style: Style }) {
  const router = useRouter();

  function setStyle(val: Style) {
    setStyleFn({ data: val }).then(() =>
      router.invalidate({
        filter: (d) => d.id === rootRouteId,
      }),
    );
  }

  return <StyleContext value={{ style, setStyle }}>{children}</StyleContext>;
}
