import crypto from "node:crypto";
import type { Bench } from "tinybench";
import type { LibraryType } from "./process";
import type { Compute } from "./types";

// biome-ignore lint/suspicious/noEmptyInterface: will be augmented in other files
export interface MetaRegistry {}

export interface BaseBenchMeta {
  libraryType: LibraryType;
}

export interface BaseCaseMeta {
  libraryName: string;
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

  cases = new Map<string, CaseMeta>();
  addCase(meta: CaseMeta) {
    const id = crypto.randomUUID();
    this.cases.set(id, meta);
    return id;
  }
  getCaseMeta(id: string): CaseMeta;
  getCaseMeta<Type extends MetaType>(
    id: string,
    type: Type,
  ): CaseMetaForType<Type>;
  getCaseMeta(id: string, type?: MetaType) {
    const meta = this.cases.get(id);
    if (!meta) throw new Error(`Meta not found: ${id}`);
    if (type && meta.type !== type)
      throw new Error(`Meta type mismatch: ${id}`);
    return meta;
  }
}

export const registry = new Registry();
