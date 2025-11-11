import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { ResultsTable } from "@/components/results-table";
import { getResults, selectParsingResults } from "@/data/results";

export const Route = createFileRoute("/parsing")({
	component: RouteComponent,
	validateSearch: v.object({
		libraryType: v.optional(v.picklist(["runtime", "precompiled"]), "runtime"),
		dataType: v.optional(v.picklist(["success", "error"]), "success"),
		errorType: v.optional(
			v.picklist(["abortEarly", "allErrors", "unknown"]),
			"allErrors",
		),
	}),
	async loader({ context: { queryClient }, abortController }) {
		await queryClient.prefetchQuery(getResults(abortController.signal));
		return { crumb: "Parsing" };
	},
});

function RouteComponent() {
	const { libraryType, dataType, errorType } = Route.useSearch();
	const { data } = useSuspenseQuery({
		...getResults(),
		select: selectParsingResults(libraryType, dataType, errorType),
	});
	return <ResultsTable results={data} />;
}
