import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import * as v from "valibot";

export const themeSchema = v.fallback(
  v.picklist(["light", "dark", "system"]),
  "system",
);
export type Theme = v.InferOutput<typeof themeSchema>;

const storageKey = "benchmarks::theme";

export const getThemeFn = createServerFn().handler(() =>
  v.parse(themeSchema, getCookie(storageKey)),
);

export const setThemeFn = createServerFn()
  .inputValidator(themeSchema)
  .handler(({ data: theme }) => setCookie(storageKey, theme));
