import { shallowFilter, toggleFilter } from "@schema-benchmarks/utils";
import { noop } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, linkOptions } from "@tanstack/react-router";
import * as v from "valibot";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count";
import { sortParamsEntries } from "#src/routes/_benchmarks/_runtime/-constants";
import { getJsonSchemaBenchResults } from "#src/routes/json-schema/-query.ts";
import {
  jsonSchemaDirectionProps,
  jsonSchemaConversionTargetProps,
  optionalJsonSchemaDirectionSchema,
  optionalJsonSchemaConversionTargetSchema,
} from "#src/routes/json-schema/_conversion/-constants";
import { SupportMatrix } from "#src/routes/json-schema/_conversion/to-json/-components/matrix.tsx";
import { PageFilters } from "#src/shared/components/page-filter";
import { PageFilterChips } from "#src/shared/components/page-filter/chips";
import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import {
  Tabs,
  InternalTabLink,
  TabPanels,
  TabPanel,
  useTabLinks,
} from "#src/shared/components/tabs/index.tsx";
import { classed } from "#src/shared/components/utils";
import { generateMetadata } from "#src/shared/data/meta";
import { getHighlightedCode } from "#src/shared/lib/highlight";

import { ToJsonResults } from "./-components/results.tsx";
import { ensureToJsonTab } from "./-constant.ts";
import Content from "./content.mdx";

const tabs = ["matrix", "bench"] as const;
const tabsSchema = v.picklist(tabs);

const searchSchema = v.object({
  target: optionalJsonSchemaConversionTargetSchema,
  direction: optionalJsonSchemaDirectionSchema,
  ...sortParamsEntries,
});

export const Route = createFileRoute("/json-schema/_conversion/to-json/$tab")({
  params: {
    parse: ({ tab }) => {
      const parsed = v.safeParse(tabsSchema, tab);
      return parsed.success && { tab: parsed.output };
    },
  },
  validateSearch: searchSchema,
  component: RouteComponent,
  loaderDeps: ({ search: { target, direction } }) => ({ target, direction }),
  async loader({ context: { queryClient }, deps: { target, direction }, abortController }) {
    const benchResults = await queryClient.query({
      ...getJsonSchemaBenchResults(abortController.signal),
      staleTime: "static",
    });
    await Promise.all(
      benchResults.conversion.toJson
        .filter(shallowFilter({ target, direction }))
        .flatMap(({ snippet, libraryName }) => [
          DownloadCount.prefetch(libraryName, { queryClient, signal: abortController.signal }),
          queryClient
            .query(getHighlightedCode({ code: snippet }, abortController.signal))
            .catch(noop),
        ]),
    );
  },
  head: ({ params: { tab } }) =>
    generateMetadata({
      title: "Schema to JSON Schema",
      description: "Benchmark results for converting a schema to JSON schema.",
      openGraph: { url: `/json-schema/to-json/${tab}` },
    }),
  staticData: { crumb: "Schema to JSON", wrapMain: false },
});

const wrapper = classed.div("main");

function RouteComponent() {
  const { tab } = Route.useParams();
  const { target, direction, sortBy, sortDir } = Route.useSearch();
  const { panelsRef, getTabLinkProps, getPanelProps } = useTabLinks(tabs, tab);
  const { data } = useSuspenseQuery({
    ...getJsonSchemaBenchResults(),
    select: (data) => data.conversion.toJsonSupport,
  });
  return (
    <main>
      <Content components={{ wrapper }} />
      <Tabs variant="responsive" ariaLabel="Schema to JSON Schema Benchmark Tabs">
        <InternalTabLink
          {...getTabLinkProps(
            "matrix",
            linkOptions({
              to: "/json-schema/to-json/$tab",
              params: { tab: "matrix" },
            }),
          )}
        >
          <MdSymbol>grid_view</MdSymbol>
          Support Matrix
        </InternalTabLink>
        <InternalTabLink
          {...getTabLinkProps(
            "bench",
            linkOptions({
              to: "/json-schema/to-json/$tab",
              params: { tab: "bench" },
            }),
          )}
        >
          <MdSymbol>speed</MdSymbol>
          Benchmarks
        </InternalTabLink>
      </Tabs>
      <TabPanels ref={panelsRef} className="main">
        <TabPanel {...getPanelProps("matrix")}>
          <SupportMatrix matrix={data} />
        </TabPanel>
        <TabPanel {...getPanelProps("bench")}>
          <PageFilters>
            <PageFilterChips
              {...jsonSchemaConversionTargetProps}
              getLinkOptions={(option) => ({
                from: Route.fullPath,
                to: "/json-schema/to-json/$tab",
                params: ({ tab }) => ({ tab: ensureToJsonTab(tab) }) as never,
                search: toggleFilter("target", option),
                replace: true,
                resetScroll: false,
              })}
            />
            <PageFilterChips
              {...jsonSchemaDirectionProps}
              getLinkOptions={(option) => ({
                from: Route.fullPath,
                to: "/json-schema/to-json/$tab",
                params: ({ tab }) => ({ tab: ensureToJsonTab(tab) }) as never,
                search: toggleFilter("direction", option),
                replace: true,
                resetScroll: false,
              })}
            />
          </PageFilters>
          <ToJsonResults {...{ target, direction, sortBy, sortDir }} />
        </TabPanel>
      </TabPanels>
    </main>
  );
}
