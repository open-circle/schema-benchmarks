import type { ComplianceType } from "@schema-benchmarks/schemas";
import { promiseAllKeyed } from "@schema-benchmarks/utils";
import type { MDXContent } from "mdx/types";

export const content: Record<ComplianceType, MDXContent> = await promiseAllKeyed({
  validation: import("./validation.mdx").then((mod) => mod.default),
  roundtrip: import("./roundtrip.mdx").then((mod) => mod.default),
  semantics: import("./semantics.mdx").then((mod) => mod.default),
});
