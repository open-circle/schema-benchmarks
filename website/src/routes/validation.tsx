import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { PageFilterGroup } from "@/components/page-filter";
import { ResultsTable } from "@/components/results-table";
import {
  dataTypeLabels,
  getResults,
  libraryTypeLabels,
  optionalDataTypeSchema,
  optionalLibraryTypeSchema,
} from "@/data/results";

const searchSchema = v.object({
  libraryType: optionalLibraryTypeSchema,
  dataType: optionalDataTypeSchema,
});

export const Route = createFileRoute("/validation")({
  head: () => ({
    meta: [
      {
        title: "Validation - Schema Benchmarks",
      },
    ],
  }),
  component: RouteComponent,
  validateSearch: searchSchema,
  async loader({ context: { queryClient }, abortController }) {
    await queryClient.prefetchQuery(getResults(abortController.signal));
    return { crumb: "Validation" };
  },
});

function RouteComponent() {
  const { libraryType, dataType } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getResults(),
    select: (results) => results.validation,
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
        <PageFilterGroup
          title="Data Type"
          options={optionalDataTypeSchema.wrapped.options}
          labels={dataTypeLabels}
          getLinkOptions={(option) => ({
            to: Route.fullPath,
            search: ({ libraryType }) => ({
              libraryType,
              dataType: option,
            }),
          })}
        />
      </div>
      <ResultsTable results={data[libraryType][dataType]} />
    </>
  );
}
