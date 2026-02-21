import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import * as v from "valibot";

import { styleSchema, themeSchema } from "./constants";

const themeKey = "benchmarks::theme";

export const getThemeFn = createServerFn().handler(() => v.parse(themeSchema, getCookie(themeKey)));

const themeMw = createMiddleware({ type: "function" })
  .inputValidator(themeSchema)
  .client(({ data: theme, next }) => {
    window.umami?.track("change_theme", { theme });
    return next();
  });

export const setThemeFn = createServerFn()
  .middleware([themeMw])
  .handler(({ data: theme }) => setCookie(themeKey, theme));

const styleKey = "benchmarks::style";

export const getStyleFn = createServerFn().handler(() => v.parse(styleSchema, getCookie(styleKey)));

const styleMw = createMiddleware({ type: "function" })
  .inputValidator(styleSchema)
  .client(({ data: style, next }) => {
    window.umami?.track("change_style", { style });
    return next();
  });

export const setStyleFn = createServerFn()
  .middleware([styleMw])
  .handler(({ data: style }) => setCookie(styleKey, style));
