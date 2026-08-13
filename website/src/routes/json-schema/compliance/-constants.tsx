import type { ComplianceTarget, PassCount } from "@schema-benchmarks/json-schema-tests/types";
import { complianceTargetSchema } from "@schema-benchmarks/json-schema-tests/types";
import { complianceTypeSchema, type ComplianceType } from "@schema-benchmarks/schemas";
import type { ReactNode } from "react";
import * as v from "valibot";

import type { PageFilterChipsProps } from "#src/shared/components/page-filter/chips.tsx";

const fallbackComplianceTypeSchema = v.fallback(complianceTypeSchema, "validation");
export function ensureComplianceTab(tab: unknown): ComplianceType {
  return v.parse(fallbackComplianceTypeSchema, tab);
}

export const complianceTypeLabels: Record<ComplianceType, { icon: string; label: ReactNode }> = {
  validation: { icon: "checklist", label: "Validation" },
  semantics: { icon: "book", label: "Semantics" },
  roundtrip: { icon: "replay", label: "Roundtrip" },
};

export const complianceTargetProps = {
  title: "Target",
  options: complianceTargetSchema.options,
  labels: {
    "draft2019-09": { label: "Draft 2019-09", icon: "data_object" },
    "draft2020-12": { label: "Draft 2020-12", icon: "data_object" },
    draft3: { label: "Draft 3", icon: "data_object" },
    draft4: { label: "Draft 4", icon: "data_object" },
    draft6: { label: "Draft 6", icon: "data_object" },
    draft7: { label: "Draft 7", icon: "data_object" },
    v1: { label: "V1", icon: "data_object" },
  },
} satisfies Pick<PageFilterChipsProps<ComplianceTarget>, "title" | "labels" | "options">;

export const sortableKeys = ["libraryName", "downloads", "compliance"] as const;
export type SortableKey = (typeof sortableKeys)[number];

export const processCount = ({ passed, failed }: PassCount) => {
  const total = passed + failed;
  return {
    passed,
    failed,
    total,
    /** A percentage, expressed as a number between 0 and 1 */
    pct: total > 0 ? passed / total : 0,
  };
};
