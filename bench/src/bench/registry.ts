import type {
  BaseBenchmarkConfig,
  BenchmarksConfig,
  ErrorType,
  LibraryType,
} from "@schema-benchmarks/schemas";
import type { DataType } from "../results/types.ts";

export type BenchmarkType = Exclude<
  keyof BenchmarksConfig<unknown>,
  "library" | "createContext"
>;

export interface BenchInfo {
  type: BenchmarkType;
  libraryType: LibraryType;
  errorType?: ErrorType;
  dataType?: DataType;
}

export interface BenchmarkConfigEntry extends BaseBenchmarkConfig, BenchInfo {
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
