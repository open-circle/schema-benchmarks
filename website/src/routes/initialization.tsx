import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { PageFilters } from "@/components/page-filter";
import { PageFilterChips } from "@/components/page-filter/chips";
import { BenchTable } from "@/features/benchmark/components/table";
import {
  getBenchResults,
  libraryTypeProps,
  optionalLibraryTypeSchema,
} from "@/features/benchmark/query";
import benchmarkStyles from "@/features/benchmark/styles.css?url";
import { getHighlightedCode } from "@/lib/highlight";

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
    links: [
      {
        rel: "stylesheet",
        href: benchmarkStyles,
      },
    ],
  }),
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search: { libraryType } }) => ({ libraryType }),
  async loader({
    context: { queryClient },
    deps: { libraryType },
    abortController,
  }) {
    const benchResults = await queryClient.ensureQueryData(
      getBenchResults(abortController.signal),
    );
    await Promise.all(
      Object.values(benchResults.initialization[libraryType]).map(
        ({ snippet }) =>
          queryClient.ensureQueryData(getHighlightedCode({ code: snippet })),
      ),
    );
    return { crumb: "Initialization" };
  },
});

function RouteComponent() {
  const { libraryType } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) => results.initialization[libraryType],
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
      </PageFilters>
      <BenchTable results={data} />
    </>
  );
}
