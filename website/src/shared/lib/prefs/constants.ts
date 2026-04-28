import * as v from "valibot";

export const themeSchema = v.fallback(v.picklist(["system", "light", "dark"]), "system");
export type Theme = v.InferOutput<typeof themeSchema>;
export const themeLabels: Record<Theme, { label: string; icon: string }> = {
  light: { label: "Light", icon: "light_mode" },
  dark: { label: "Dark", icon: "dark_mode" },
  system: { label: "System", icon: "routine" },
};

export const styleSchema = v.fallback(v.picklist(["code", "normal"]), "code");
export type Style = v.InferOutput<typeof styleSchema>;
export const styleLabels: Record<Style, { label: string; icon: string }> = {
  code: { label: "Code", icon: "code" },
  normal: { label: "Normal", icon: "match_case" },
};

export const npmSiteSchema = v.fallback(v.picklist(["npmx.dev", "npmjs.com"]), "npmx.dev");
export type NpmSite = v.InferOutput<typeof npmSiteSchema>;
