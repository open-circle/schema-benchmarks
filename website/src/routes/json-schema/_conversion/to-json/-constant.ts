import * as v from "valibot";

export const tabsSchema = v.picklist(["matrix", "bench"]);
const fallbackTabsSchema = v.fallback(tabsSchema, "matrix");
export function ensureToJsonTab(tab: unknown) {
  return v.parse(fallbackTabsSchema, tab);
}
