import { shallowFilter, toggleFilter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { PageFilters } from "#/shared/components/page-filter";
import { PageFilterChips } from "#/shared/components/page-filter/chips";
import { generateMetadata } from "#/shared/data/meta";
import { getHighlightedCode } from "#/shared/lib/highlight";
import { getPackageName } from "../../-components/count";
import { getAllWeeklyDownloads } from "../../-query";
import { BenchResults } from "../-components/results";
import { optimizeTypeProps, optionalOptimizeTypeSchema } from "../-constants";
import { getBenchResults } from "../-query";
import Content from "./content.mdx";

const searchSchema = v.object({
  optimizeType: optionalOptimizeTypeSchema,
});

export const Route = createFileRoute("/_benchmarks/_runtime/initialization/")({
  head: () =>
    generateMetadata({
      title: "Initialization",
      description: "Benchmark results for creating a schema.",
      openGraph: {
        url: "/initialization/",
      },
    }),
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search: { optimizeType } }) => ({ optimizeType }),
  async loader({
    context: { queryClient },
    deps: { optimizeType },
    abortController,
  }) {
    const benchResults = await queryClient.ensureQueryData(
      getBenchResults(abortController.signal),
    );
    const downloadPromises = [];
    for (const { snippet, libraryName } of Object.values(
      benchResults.initialization.filter(shallowFilter({ optimizeType })),
    )) {
      // wait for these
      downloadPromises.push(
        queryClient.prefetchQuery(
          getAllWeeklyDownloads(
            getPackageName(libraryName),
            abortController.signal,
          ),
        ),
      );
      // don't wait for these, not visible immediately
      queryClient.prefetchQuery(
        getHighlightedCode({ code: snippet }, abortController.signal),
      );
    }
    await Promise.all(downloadPromises);
  },
  staticData: { crumb: "Initialization" },
});

function RouteComponent() {
  const { optimizeType } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) =>
      results.initialization.filter(shallowFilter({ optimizeType })),
  });
  return (
    <>
      <Content components={{ wrapper: "div" }} />
      <PageFilters>
        <PageFilterChips
          {...optimizeTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/initialization",
            search: toggleFilter("optimizeType", option),
            resetScroll: false,
          })}
        />
      </PageFilters>
      <BenchResults results={data} />
    </>
  );
}
