import type { ComplianceTarget } from "@schema-benchmarks/json-schema-tests";
import { complianceTargetSchema } from "@schema-benchmarks/json-schema-tests";
import type { ComplianceType } from "@schema-benchmarks/schemas";

import type { PageFilterChipsProps } from "#src/shared/components/page-filter/chips.tsx";

export const complianceTypeIcons: Record<ComplianceType, string> = {
  validation: "checklist",
  semantics: "book",
  roundtrip: "replay",
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

export function getPctCompliance({
  results: {
    count: { passed, failed },
  },
}: {
  results: { count: { passed: number; failed: number } };
}) {
  const total = passed + failed;
  return total > 0 ? (passed / total) * 100 : 0;
}
