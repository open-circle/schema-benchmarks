import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import * as v from "valibot";
import { styleSchema, themeSchema } from "./constants";

const themeKey = "benchmarks::theme";

export const getThemeFn = createServerFn().handler(() => v.parse(themeSchema, getCookie(themeKey)));

export const setThemeFn = createServerFn()
  .inputValidator(themeSchema)
  .handler(({ data: theme }) => setCookie(themeKey, theme));

const styleKey = "benchmarks::style";

export const getStyleFn = createServerFn().handler(() => v.parse(styleSchema, getCookie(styleKey)));

export const setStyleFn = createServerFn()
  .inputValidator(styleSchema)
  .handler(({ data: style }) => setCookie(styleKey, style));
