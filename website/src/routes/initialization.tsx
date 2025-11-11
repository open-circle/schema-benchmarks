import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { ResultsTable } from "@/components/results-table";
import { getResults, selectInitializationResults } from "@/data/results";

export const Route = createFileRoute("/initialization")({
	component: RouteComponent,
	validateSearch: v.object({
		libraryType: v.optional(v.picklist(["runtime", "precompiled"]), "runtime"),
	}),
	async loader({ context: { queryClient }, abortController }) {
		await queryClient.prefetchQuery(getResults(abortController.signal));
		return { crumb: "Initialization" };
	},
});

function RouteComponent() {
	const { libraryType } = Route.useSearch();
	const { data } = useSuspenseQuery({
		...getResults(),
		select: selectInitializationResults(libraryType),
	});
	return <ResultsTable results={data} />;
}
