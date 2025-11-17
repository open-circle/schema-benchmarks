import { isEmpty } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { PageFilterGroup } from "@/components/page-filter";
import { getHighlightedCode } from "@/data/highlight";
import { BenchTable } from "@/features/benchmark/components/table";
import {
  dataTypeProps,
  errorTypeProps,
  getBenchResults,
  libraryTypeProps,
  optionalDataTypeSchema,
  optionalErrorTypeSchema,
  optionalLibraryTypeSchema,
} from "@/features/benchmark/query";

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
  loaderDeps: ({ search: { libraryType, dataType, errorType } }) => ({
    libraryType,
    dataType,
    errorType,
  }),
  async loader({
    context: { queryClient },
    deps: { libraryType, dataType, errorType },
    abortController,
  }) {
    const benchResults = await queryClient.ensureQueryData(
      getBenchResults(abortController.signal),
    );
    await Promise.all(
      benchResults.parsing[libraryType][dataType][errorType].map(
        ({ snippet }) =>
          queryClient.ensureQueryData(getHighlightedCode({ code: snippet })),
      ),
    );
    return { crumb: "Parsing" };
  },
});

function RouteComponent() {
  const { libraryType, dataType, errorType } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) => results.parsing[libraryType][dataType],
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
            disabled: isEmpty(data[option]),
          })}
        />
      </div>
      <BenchTable results={data[errorType]} />
    </>
  );
}
