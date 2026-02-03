import * as v from "valibot";

export const themeSchema = v.fallback(
  v.picklist(["system", "light", "dark"]),
  "system",
);
export type Theme = v.InferOutput<typeof themeSchema>;
export const themeLabels: Record<Theme, { label: string; icon: string }> = {
  light: { label: "Light theme", icon: "light_mode" },
  dark: { label: "Dark theme", icon: "dark_mode" },
  system: { label: "System theme", icon: "routine" },
};

export const styleSchema = v.fallback(v.picklist(["code", "normal"]), "code");
export type Style = v.InferOutput<typeof styleSchema>;
export const styleLabels: Record<Style, { label: string; icon: string }> = {
  code: { label: "Code style", icon: "code" },
  normal: { label: "Normal style", icon: "match_case" },
};
