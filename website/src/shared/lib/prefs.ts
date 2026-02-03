import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import * as v from "valibot";

export const themeSchema = v.fallback(
  v.picklist(["light", "dark", "system"]),
  "system",
);
export type Theme = v.InferOutput<typeof themeSchema>;

const themeKey = "benchmarks::theme";

export const getThemeFn = createServerFn().handler(() =>
  v.parse(themeSchema, getCookie(themeKey)),
);

export const setThemeFn = createServerFn()
  .inputValidator(themeSchema)
  .handler(({ data: theme }) => setCookie(themeKey, theme));

export const styleSchema = v.fallback(v.picklist(["code", "normal"]), "code");
export type Style = v.InferOutput<typeof styleSchema>;

const styleKey = "benchmarks::style";

export const getStyleFn = createServerFn().handler(() =>
  v.parse(styleSchema, getCookie(styleKey)),
);

export const setStyleFn = createServerFn()
  .inputValidator(styleSchema)
  .handler(({ data: style }) => setCookie(styleKey, style));
