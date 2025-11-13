import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { PageFilterGroup } from "@/components/page-filter";
import { ResultsTable } from "@/components/results-table";
import {
  getResults,
  libraryTypeLabels,
  optionalLibraryTypeSchema,
} from "@/data/results";

const searchSchema = v.object({
  libraryType: optionalLibraryTypeSchema,
});

export const Route = createFileRoute("/initialization")({
  head: () => ({
    meta: [
      {
        title: "Initialization - Schema Benchmarks",
      },
    ],
  }),
  component: RouteComponent,
  validateSearch: searchSchema,
  async loader({ context: { queryClient }, abortController }) {
    await queryClient.prefetchQuery(getResults(abortController.signal));
    return { crumb: "Initialization" };
  },
});

function RouteComponent() {
  const { libraryType } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getResults(),
    select: (results) => results.initialization,
  });
  return (
    <>
      <div className="page-filters">
        <PageFilterGroup
          title="Library Type"
          options={optionalLibraryTypeSchema.wrapped.options}
          labels={libraryTypeLabels}
          getLinkOptions={(option) => ({
            to: Route.fullPath,
            search: { libraryType: option },
          })}
        />
      </div>
      <ResultsTable results={data[libraryType]} />
    </>
  );
}
