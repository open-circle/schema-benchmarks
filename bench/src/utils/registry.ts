import crypto from "node:crypto";
import type { Compute, DistributiveOmit } from "@schema-benchmarks/utils";
import type { Bench } from "tinybench";
import type { LibraryType } from "../results/types";

// biome-ignore lint/suspicious/noEmptyInterface: will be augmented in other files
export interface MetaRegistry {}

export interface BaseBenchMeta {
  libraryType: LibraryType;
}

export interface BaseCaseMeta {
  libraryName: string;
  version: string;
  snippet: string;
  note?: string;
}

export type MetaType = keyof MetaRegistry;
export type CaseMetaForType<Type extends MetaType> = Compute<
  {
    type: Type;
  } & BaseCaseMeta &
    MetaRegistry[Type]["case"]
>;
export type BenchMetaForType<Type extends MetaType> = Compute<
  {
    type: Type;
  } & BaseBenchMeta &
    MetaRegistry[Type]["bench"]
>;

export type BenchMeta = {
  [K in keyof MetaRegistry]: BenchMetaForType<K>;
}[MetaType];
export type CaseMeta = {
  [K in keyof MetaRegistry]: CaseMetaForType<K>;
}[MetaType];

class Registry {
  benches = new Map<Bench, BenchMeta>();
  addBench(bench: Bench, meta: BenchMeta) {
    this.benches.set(bench, meta);
    bench.addEventListener("start", () => {
      console.log("Starting benchmark", meta);
    });
    bench.addEventListener("cycle", (evt) => {
      if (!evt.task) return;
      console.log("Running case", this.#getCaseName(evt.task.name));
    });
    bench.addEventListener("complete", () => {
      console.table(
        bench.table().map((row) => {
          const taskName = row?.["Task name"];
          if (!taskName) return row;
          return {
            ...row,
            "Task name": this.#getCaseName(taskName as string),
          };
        }),
      );
    });
    bench.addEventListener("error", (evt) => {
      console.error("Error in benchmark", evt.error);
    });
  }
  getBenchMeta(bench: Bench): BenchMeta;
  getBenchMeta<Type extends MetaType>(
    bench: Bench,
    type: Type,
  ): BenchMetaForType<Type>;
  getBenchMeta(bench: Bench, type?: MetaType) {
    const meta = this.benches.get(bench);
    if (!meta) throw new Error(`Meta not found: ${bench.name}`);
    if (type && meta.type !== type)
      throw new Error(`Meta type mismatch: ${bench.name}`);
    return meta;
  }
  async runBenches() {
    const allResults = [];
    for (const bench of this.benches.keys()) {
      const results = await bench.run();
      allResults.push([bench, results] as const);
    }
    return allResults;
  }

  cases = new Map<string, DistributiveOmit<CaseMeta, "version">>();
  addCase(meta: DistributiveOmit<CaseMeta, "version">) {
    const id = crypto.randomUUID();
    this.cases.set(id, meta);
    return id;
  }
  getCaseMeta(id: string): DistributiveOmit<CaseMeta, "version">;
  getCaseMeta<Type extends MetaType>(
    id: string,
    type: Type,
  ): DistributiveOmit<CaseMetaForType<Type>, "version">;
  getCaseMeta(id: string, type?: MetaType) {
    const meta = this.cases.get(id);
    if (!meta) throw new Error(`Meta not found: ${id}`);
    if (type && meta.type !== type)
      throw new Error(`Meta type mismatch: ${id}`);
    return meta;
  }

  #getCaseName(id: string) {
    const meta = this.getCaseMeta(id);
    return `${meta.libraryName}${meta.note ? ` (${meta.note})` : ""}`;
  }
}

export const registry = new Registry();
