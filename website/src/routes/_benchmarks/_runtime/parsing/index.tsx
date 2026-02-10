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
import {
  dataTypeProps,
  errorTypeProps,
  optimizeTypeProps,
  optionalDataTypeSchema,
  optionalErrorTypeSchema,
  optionalOptimizeTypeSchema,
} from "../-constants";
import { getBenchResults } from "../-query";
import Content from "./content.mdx";

const searchSchema = v.object({
  optimizeType: optionalOptimizeTypeSchema,
  dataType: optionalDataTypeSchema,
  errorType: optionalErrorTypeSchema,
});

export const Route = createFileRoute("/_benchmarks/_runtime/parsing/")({
  head: () =>
    generateMetadata({
      title: "Parsing",
      description: "Benchmark results for parsing data.",
      openGraph: {
        url: "/parsing/",
      },
    }),
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search: { optimizeType, dataType, errorType } }) => ({
    optimizeType,
    dataType,
    errorType,
  }),
  async loader({
    context: { queryClient },
    deps: { optimizeType, dataType, errorType },
    abortController,
  }) {
    const benchResults = await queryClient.ensureQueryData(
      getBenchResults(abortController.signal),
    );
    const downloadPromises = [];
    for (const { snippet, libraryName } of Object.values(
      benchResults.parsing[dataType].filter(
        shallowFilter({ optimizeType, errorType }),
      ),
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
  staticData: { crumb: "Parsing" },
});

function RouteComponent() {
  const { optimizeType, dataType, errorType } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) =>
      results.parsing[dataType].filter(
        shallowFilter({ optimizeType, errorType }),
      ),
  });
  return (
    <>
      <Content components={{ wrapper: "div" }} />
      <PageFilters>
        <PageFilterChips
          {...dataTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/parsing",
            search: toggleFilter("dataType", option),
            replace: true,
            resetScroll: false,
          })}
        />
        <PageFilterChips
          {...optimizeTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/parsing",
            search: toggleFilter("optimizeType", option),
            replace: true,
            resetScroll: false,
          })}
        />
        <PageFilterChips
          {...errorTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/parsing",
            search: toggleFilter("errorType", option),
            replace: true,
            resetScroll: false,
          })}
        />
      </PageFilters>
      <BenchResults results={data} />
    </>
  );
}
