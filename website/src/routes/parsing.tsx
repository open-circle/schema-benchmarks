import { isEmpty } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { PageFilterGroup } from "@/components/page-filter";
import { ResultsTable } from "@/components/results-table";
import {
  dataTypeLabels,
  errorTypeLabels,
  getResults,
  libraryTypeLabels,
  optionalDataTypeSchema,
  optionalErrorTypeSchema,
  optionalLibraryTypeSchema,
} from "@/data/results";

const searchSchema = v.object({
  libraryType: optionalLibraryTypeSchema,
  dataType: optionalDataTypeSchema,
  errorType: optionalErrorTypeSchema,
});

export const Route = createFileRoute("/parsing")({
  head: () => ({
    meta: [
      {
        title: "Parsing - Schema Benchmarks",
      },
    ],
  }),
  component: RouteComponent,
  validateSearch: searchSchema,
  async loader({ context: { queryClient }, abortController }) {
    await queryClient.prefetchQuery(getResults(abortController.signal));
    return { crumb: "Parsing" };
  },
});

function RouteComponent() {
  const { libraryType, dataType, errorType } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getResults(),
    select: (results) => results.parsing,
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
            search: ({ libraryType, errorType }) => ({
              libraryType,
              dataType: option,
              errorType,
            }),
          })}
        />
        <PageFilterGroup
          title="Error Type"
          options={optionalErrorTypeSchema.wrapped.options}
          labels={errorTypeLabels}
          getLinkOptions={(option) => ({
            to: Route.fullPath,
            search: ({ libraryType, dataType }) => ({
              libraryType,
              dataType,
              errorType: option,
            }),
            disabled: isEmpty(data[libraryType][dataType][option]),
          })}
        />
      </div>
      <ResultsTable results={data[libraryType][dataType][errorType]} />
    </>
  );
}
