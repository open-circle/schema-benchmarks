import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { PageFilterGroup } from "@/components/page-filter";
import { getHighlightedCode } from "@/data/highlight";
import { BenchTable } from "@/features/benchmark/components/table";
import {
  getBenchResults,
  libraryTypeProps,
  optionalLibraryTypeSchema,
} from "@/features/benchmark/query";

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
      <div className="page-filters">
        <PageFilterGroup
          {...libraryTypeProps}
          getLinkOptions={(option) => ({
            to: Route.fullPath,
            search: { libraryType: option },
          })}
        />
      </div>
      <BenchTable results={data} />
    </>
  );
}
