import { type MinifyType, minifyTypeSchema } from "@schema-benchmarks/bench";
import * as v from "valibot";

import type { PageFilterChipsProps } from "#/shared/components/page-filter/chips";

export const optionalMinifyTypeSchema = v.optional(minifyTypeSchema, "minified");

export const minifyTypeProps = {
  title: "Minify",
  options: minifyTypeSchema.options,
  labels: {
    minified: { label: "Minified", icon: "chips" },
    unminified: { label: "Unminified", icon: "code_blocks" },
  },
} satisfies Pick<PageFilterChipsProps<MinifyType>, "title" | "labels" | "options">;

export const sortableKeys = ["libraryName", "downloads", "bytes", "gzipBytes"] as const;
export type SortableKey = (typeof sortableKeys)[number];
