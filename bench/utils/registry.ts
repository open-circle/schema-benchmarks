import crypto from "node:crypto";
import type { Bench } from "tinybench";
import type { StripIndexSignature } from "./types";

export interface MetaRegistry {
	[type: string]: {
		bench: BaseBenchMeta;
		case: BaseCaseMeta;
	};
}

export interface BaseBenchMeta {
	libraryType: "runtime" | "precompiled";
}

export interface BaseCaseMeta {
	libraryName: string;
	note?: string;
}

export type MetaType = keyof StripIndexSignature<MetaRegistry>;
export type CaseMetaForType<Type extends MetaType> = MetaRegistry[Type]["case"];
export type BenchMetaForType<Type extends MetaType> =
	MetaRegistry[Type]["bench"];

export type BenchMeta = {
	[K in keyof StripIndexSignature<MetaRegistry>]: MetaRegistry[K]["bench"] & {
		type: K;
	};
}[MetaType];
export type CaseMeta = {
	[K in keyof StripIndexSignature<MetaRegistry>]: MetaRegistry[K]["case"] & {
		type: K;
	};
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
