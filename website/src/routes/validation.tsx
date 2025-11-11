import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { ResultsTable } from "@/components/results-table";
import { getResults, selectValidationResults } from "@/data/results";

export const Route = createFileRoute("/validation")({
	component: RouteComponent,
	validateSearch: v.object({
		libraryType: v.optional(v.picklist(["runtime", "precompiled"]), "runtime"),
		dataType: v.optional(v.picklist(["success", "error"]), "success"),
	}),
	async loader({ context: { queryClient }, abortController }) {
		await queryClient.prefetchQuery(getResults(abortController.signal));
		return { crumb: "Validation" };
	},
});

function RouteComponent() {
	const { libraryType, dataType } = Route.useSearch();
	const { data } = useSuspenseQuery({
		...getResults(),
		select: selectValidationResults(libraryType, dataType),
	});
	return <ResultsTable results={data} />;
}
