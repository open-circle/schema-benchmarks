import { Bench, type FnOptions } from "tinybench";
import {
	type BenchMetaForType,
	type CaseMetaForType,
	type MetaType,
	registry,
} from "./registry";
import type { HasRequiredProps } from "./types";

type AddArgs<Meta> = [
	...HasRequiredProps<Meta, [caseMeta: Meta], [caseMeta?: Meta]>,
	fnOptions?: FnOptions,
];

interface LibraryContext<Type extends MetaType> {
	/**
	 * Add a case to the library.
	 */
	add: (
		fn: () => unknown,
		...args: AddArgs<Omit<CaseMetaForType<Type>, "libraryName" | "type">>
	) => void;
}

interface BenchContext<Type extends MetaType> {
	bench: Bench;
	/**
	 * Shorthand for `library` that only adds a single case.
	 */
	addLibrary: (
		libraryName: string,
		fn: () => unknown,
		...args: AddArgs<Omit<CaseMetaForType<Type>, "libraryName" | "type">>
	) => void;
	/**
	 * Register multiple cases for a library.
	 */
	library: (
		libraryName: string,
		registerCases: (libraryCtx: LibraryContext<Type>) => void,
	) => void;
}

/**
 * Creates and registers a `Bench` instance.
 */
type BenchFactory<Type extends MetaType> = (
	benchMeta: Omit<BenchMetaForType<Type>, "type">,
	registerCases: (ctx: BenchContext<Type>) => void,
) => void;

/**
 * Creates a function that can be used to register benchmarks.
 * @param type The type of the benchmark.
 * @param keys The keys of the meta that are shared between all cases for a given bench.
 */
export const makeBenchFactory =
	<Type extends MetaType>(type: Type): BenchFactory<Type> =>
	(benchMeta, registerCases) => {
		const bench = new Bench();
		registry.addBench(bench, { ...benchMeta, type } as never);
		function add(
			libraryName: string,
			fn: () => unknown,
			...[caseMeta = {}, fnOptions]: AddArgs<
				Omit<CaseMetaForType<Type>, "libraryName" | "type">
			>
		) {
			const id = registry.addCase({
				...benchMeta,
				...caseMeta,
				libraryName,
				type,
			} as never);
			bench.add(id, fn, fnOptions as FnOptions);
		}
		registerCases({
			bench,
			addLibrary: add,
			library(libraryName, registerCases) {
				registerCases({
					add: add.bind(null, libraryName),
				});
			},
		});
	};
