import type {
  BaseBenchmarkConfig,
  BenchmarksConfig,
  ErrorType,
  OptimizeType,
  StringFormat,
} from "@schema-benchmarks/schemas";
import type { DistributiveOmit } from "@schema-benchmarks/utils";

import type { DataType } from "../results/types.ts";

export type BenchmarkType = Exclude<keyof BenchmarksConfig<unknown>, "library" | "createContext">;

export interface BenchInfo {
  type: BenchmarkType;
  optimizeType: OptimizeType;
  errorType?: ErrorType;
  dataType?: DataType;
  stringFormat?: StringFormat;
}

export interface BenchmarkConfigEntry
  extends DistributiveOmit<BaseBenchmarkConfig, "optimizeType">, BenchInfo {
  libraryName: string;
  version: string;
}

export class CaseRegistry extends Map<string, BenchmarkConfigEntry> {
  add(entry: BenchmarkConfigEntry) {
    const id = crypto.randomUUID();
    this.set(id, entry);
    return id;
  }
}
