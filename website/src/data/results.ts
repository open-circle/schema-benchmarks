import type {
	DataType,
	ErrorType,
	LibraryType,
	ProcessedResults,
} from "@schema-benchmarks/bench";
import results from "@schema-benchmarks/bench/results.json";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

export const getResultsFn = createServerFn().handler(async ({ signal }) => {
	if (process.env.NODE_ENV === "production") {
		const response = await fetch(
			"https://raw.githubusercontent.com/open-circle/schema-benchmarks/refs/heads/main/bench/results.json",
			{ signal },
		);
		return (await response.json()) as ProcessedResults;
	}

	return results;
});

export const getResults = (signal?: AbortSignal) =>
	queryOptions({
		queryKey: ["results"],
		queryFn: () => getResultsFn({ signal }),
	});

export const selectInitializationResults =
	(libraryType: LibraryType) => (results: ProcessedResults) =>
		results.initialization[libraryType];

export const selectValidationResults =
	(libraryType: LibraryType, dataType: DataType) =>
	(results: ProcessedResults) =>
		results.validation[libraryType][dataType];

export const selectParsingResults =
	(libraryType: LibraryType, dataType: DataType, errorType: ErrorType) =>
	(results: ProcessedResults) =>
		results.parsing[libraryType][dataType][errorType];
