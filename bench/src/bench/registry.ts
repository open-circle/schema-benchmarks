import type {
  BaseBenchmarkConfig,
  BenchmarksConfig,
  ErrorType,
  OptimizeType,
  StringFormat,
} from "@schema-benchmarks/schemas";
import type { Compute, DistributiveOmit, OneOf, Satisfies } from "@schema-benchmarks/utils";

import type { DataType } from "../results/types.ts";

export type BenchmarkType = Exclude<keyof BenchmarksConfig, "library" | "stack">;

interface BaseBenchInfo extends DistributiveOmit<BaseBenchmarkConfig, "optimizeType"> {
  libraryName: string;
  version: string;
  optimizeType: OptimizeType;
}

type BenchInfoByType = Satisfies<
  {
    initialization: unknown;
    validation: { dataType: DataType };
    parsing: { dataType: DataType; errorType: ErrorType };
    standard: { dataType: DataType; errorType: ErrorType };
    string: { stringFormat: StringFormat; dataType: DataType };
    codec: { codecType: "encode" | "decode"; codecId: string; acceptsUnknown?: boolean };
  },
  Record<BenchmarkType, unknown>
>;

export type BenchmarkConfigEntry = OneOf<
  {
    [Type in BenchmarkType]: Compute<{ type: Type } & BaseBenchInfo & BenchInfoByType[Type]>;
  }[BenchmarkType]
>;

export class CaseRegistry extends Map<string, BenchmarkConfigEntry> {
  add(entry: BenchmarkConfigEntry) {
    const id = crypto.randomUUID();
    this.set(id, entry);
    return id;
  }
}
