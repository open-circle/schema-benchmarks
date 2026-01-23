import { type MinifyType, minifyTypeSchema } from "@schema-benchmarks/bench";
import * as v from "valibot";
import type { PageFilterChipsProps } from "@/components/page-filter/chips";

export const optionalMinifyTypeSchema = v.optional(
  minifyTypeSchema,
  "minified",
);

export const minifyTypeProps: Pick<
  PageFilterChipsProps<MinifyType>,
  "title" | "labels" | "options"
> = {
  title: "Minify",
  options: minifyTypeSchema.options,
  labels: {
    minified: { label: "Minified", icon: "chips" },
    unminified: { label: "Unminified", icon: "code_blocks" },
  },
};
