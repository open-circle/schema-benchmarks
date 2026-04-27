import { rootRouteId, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { setNpmSiteFn, setStyleFn, setThemeFn } from "#/shared/lib/prefs";
import type { NpmSite, Style, Theme } from "#/shared/lib/prefs/constants";

import { NpmSiteContext, StyleContext, ThemeContext } from "./context";

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

export function NpmSiteProvider({ children, npmSite }: { children: ReactNode; npmSite: NpmSite }) {
  const router = useRouter();

  function setNpmSite(val: NpmSite) {
    setNpmSiteFn({ data: val }).then(() =>
      router.invalidate({
        filter: (d) => d.id === rootRouteId,
      }),
    );
  }

  return <NpmSiteContext value={{ npmSite, setNpmSite }}>{children}</NpmSiteContext>;
}
