import type {
  BaseBenchmarkConfig,
  BenchmarksConfig,
  ErrorType,
  JsonSchemaDirection,
  JsonSchemaSource,
  StandardJsonSchemaSupport,
  JsonSchemaTarget,
  OptimizeType,
  StringFormat,
} from "@schema-benchmarks/schemas";
import type { Compute, DistributiveOmit, OneOf, Satisfies } from "@schema-benchmarks/utils";

import type { DataType } from "../results/types.ts";

export type BenchmarkType = Exclude<keyof BenchmarksConfig, "library" | "stack">;

interface BaseBenchInfo extends DistributiveOmit<BaseBenchmarkConfig, "optimizeType"> {
  libraryName: string;
  version: string;
}

/** Every case but the JSON schema one, where how a library validates says nothing. */
interface RuntimeBenchInfo {
  optimizeType: OptimizeType;
}

type BenchInfoByType = Satisfies<
  {
    initialization: RuntimeBenchInfo;
    validation: RuntimeBenchInfo & { dataType: DataType };
    parsing: RuntimeBenchInfo & { dataType: DataType; errorType: ErrorType };
    standard: RuntimeBenchInfo & { dataType: DataType; errorType: ErrorType };
    jsonSchema: {
      target: JsonSchemaTarget;
      direction: JsonSchemaDirection;
      source: JsonSchemaSource;
      standardJsonSchema?: StandardJsonSchemaSupport;
      jsonSchema: string;
    };
    string: RuntimeBenchInfo & { stringFormat: StringFormat; dataType: DataType };
    codec: RuntimeBenchInfo & {
      codecType: "encode" | "decode";
      codecId: string;
      acceptsUnknown?: boolean;
    };
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
