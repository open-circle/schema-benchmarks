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

export type BenchmarkType = Exclude<keyof BenchmarksConfig, "library" | "stack" | "jsonSchema">;

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

export type JsonSchemaBenchmarkType = keyof NonNullable<BenchmarksConfig["jsonSchema"]>;

export type JsonSchemaInfoByType = Satisfies<
  {
    conversion:
      | {
          conversionType: "toJson";
          target: JsonSchemaTarget;
          direction: JsonSchemaDirection;
          source: JsonSchemaSource;
          standardJsonSchema?:
            | Exclude<StandardJsonSchemaSupport, "package">
            | { support: "package"; package: string };
          jsonSchema: string;
        }
      | {
          conversionType: "fromJson";
        };
  },
  Record<JsonSchemaBenchmarkType, unknown>
>;

export type JsonSchemaBenchmarkConfigEntry = OneOf<
  {
    [Type in JsonSchemaBenchmarkType]: Compute<
      { type: Type } & BaseBenchInfo & JsonSchemaInfoByType[Type]
    >;
  }[JsonSchemaBenchmarkType]
>;

export class Registry<Entry> extends Map<string, Entry> {
  add(entry: Entry) {
    const id = crypto.randomUUID();
    this.set(id, entry);
    return id;
  }
}
