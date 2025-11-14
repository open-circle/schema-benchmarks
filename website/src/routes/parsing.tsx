import { isEmpty } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { BenchTable } from "@/components/bench-table";
import { PageFilterGroup } from "@/components/page-filter";
import {
  dataTypeProps,
  errorTypeProps,
  getBenchResults,
  libraryTypeProps,
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
    await queryClient.prefetchQuery(getBenchResults(abortController.signal));
    return { crumb: "Parsing" };
  },
});

function RouteComponent() {
  const { libraryType, dataType, errorType } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) => results.parsing,
  });
  return (
    <>
      <div className="page-filters">
        <PageFilterGroup
          {...libraryTypeProps}
          getLinkOptions={(option) => ({
            to: Route.fullPath,
            search: { libraryType: option },
          })}
        />
        <PageFilterGroup
          {...dataTypeProps}
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
          {...errorTypeProps}
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
      <BenchTable results={data[libraryType][dataType][errorType]} />
    </>
  );
}
