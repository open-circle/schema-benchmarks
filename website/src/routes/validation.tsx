import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { PageFilters } from "@/components/page-filter";
import { PageFilterChips } from "@/components/page-filter/chips";
import { BenchTable } from "@/features/benchmark/components/table";
import {
  dataTypeProps,
  getBenchResults,
  libraryTypeProps,
  optionalDataTypeSchema,
  optionalLibraryTypeSchema,
} from "@/features/benchmark/query";
import benchmarkStyles from "@/features/benchmark/styles.css?url";
import { getHighlightedCode } from "@/lib/highlight";

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
    links: [
      {
        rel: "stylesheet",
        href: benchmarkStyles,
      },
    ],
  }),
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search: { libraryType, dataType } }) => ({
    libraryType,
    dataType,
  }),
  async loader({
    context: { queryClient },
    deps: { libraryType, dataType },
    abortController,
  }) {
    const benchResults = await queryClient.ensureQueryData(
      getBenchResults(abortController.signal),
    );
    await Promise.all(
      benchResults.validation[libraryType][dataType].map(({ snippet }) =>
        queryClient.ensureQueryData(getHighlightedCode({ code: snippet })),
      ),
    );
    return { crumb: "Validation" };
  },
});

function RouteComponent() {
  const { libraryType, dataType } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) => results.validation[libraryType][dataType],
  });
  return (
    <>
      <PageFilters>
        <PageFilterChips
          {...libraryTypeProps}
          getLinkOptions={(option) => ({
            to: Route.fullPath,
            search: { libraryType: option },
          })}
        />
        <PageFilterChips
          {...dataTypeProps}
          getLinkOptions={(option) => ({
            to: Route.fullPath,
            search: ({ libraryType }) => ({
              libraryType,
              dataType: option,
            }),
          })}
        />
      </PageFilters>
      <BenchTable results={data} />
    </>
  );
}
