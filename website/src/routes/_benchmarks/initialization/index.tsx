import { shallowFilter, toggleFilter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { PageFilters } from "@/components/page-filter";
import { PageFilterChips } from "@/components/page-filter/chips";
import { generateMetadata } from "@/data/meta";
import { BenchResults } from "@/features/benchmark/components/results";
import {
  optimizeTypeProps,
  optionalOptimizeTypeSchema,
} from "@/features/benchmark/constants";
import { getBenchResults } from "@/features/benchmark/query";
import benchmarkStyles from "@/features/benchmark/styles.css?url";
import { getAllWeeklyDownloads } from "@/features/popularity/query";
import { getHighlightedCode } from "@/lib/highlight";
import Content from "./content.mdx";

const searchSchema = v.object({
  optimizeType: optionalOptimizeTypeSchema,
});

export const Route = createFileRoute("/_benchmarks/initialization/")({
  head: () =>
    generateMetadata({
      title: "Initialization",
      description: "Benchmark results for creating a schema.",
      openGraph: {
        url: "/initialization/",
      },
      links: [
        {
          rel: "stylesheet",
          href: benchmarkStyles,
        },
      ],
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
        queryClient.ensureQueryData(
          getAllWeeklyDownloads(libraryName, abortController.signal),
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
