import type { JsonComplianceResult } from "@schema-benchmarks/bench";
import type { ComplianceTarget } from "@schema-benchmarks/json-schema-tests/types";
import { complianceTargetSchema } from "@schema-benchmarks/json-schema-tests/types";
import { complianceTypeSchema } from "@schema-benchmarks/schemas";
import { assert, collator, compareNumbers, compareStrings } from "@schema-benchmarks/utils";
import { noop } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, linkOptions } from "@tanstack/react-router";
import { useMemo } from "react";
import * as v from "valibot";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count.tsx";
import {
  compareDownloadsByPkgName,
  useDownloadsByPkgName,
} from "#src/routes/_benchmarks/-hooks.ts";
import { getJsonSchemaBenchResults } from "#src/routes/json-schema/-query.ts";
import { ComplianceDetail } from "#src/routes/json-schema/compliance/-components/detail/index.tsx";
import { ComplianceResults } from "#src/routes/json-schema/compliance/-components/results.tsx";
import { PageFilterChips } from "#src/shared/components/page-filter/chips.tsx";
import { PageFilters } from "#src/shared/components/page-filter/index.tsx";
import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import {
  Tabs,
  InternalTabLink,
  TabPanels,
  TabPanel,
  useTabLinks,
} from "#src/shared/components/tabs/index.tsx";
import { generateMetadata } from "#src/shared/data/meta";
import { getHighlightedCode } from "#src/shared/lib/highlight.ts";
import { applySort, sortParams } from "#src/shared/lib/sort";

import {
  complianceTargetProps,
  complianceTypeLabels,
  ensureComplianceTab,
  processCount,
  sortableKeys,
} from "./-constants.tsx";
import { content as tabContent } from "./-content/index.ts";
import Content from "./content.mdx";

const searchSchema = v.object({
  ...sortParams(v.optional(v.picklist(sortableKeys), "compliance"), "descending"),
  target: v.optional(complianceTargetSchema, "draft2020-12"),
  detail: v.fallback(v.optional(v.pipe(v.string(), v.uuid())), undefined),
});

export const Route = createFileRoute("/json-schema/compliance/$tab")({
  validateSearch: searchSchema,
  component: RouteComponent,
  staticData: { crumb: "Compliance", wrapMain: false },
  params: {
    parse: ({ tab }) => {
      const parsed = v.safeParse(complianceTypeSchema, tab);
      return parsed.success && { tab: parsed.output };
    },
  },
  loaderDeps: ({ search: { target } }) => ({ target }),
  async loader({ context: { queryClient }, params: { tab }, deps: { target }, abortController }) {
    assert(tab, "Tab is required");
    const { compliance } = await queryClient.query({
      ...getJsonSchemaBenchResults(abortController.signal),
      staleTime: "static",
    });
    await Promise.all(
      (compliance[tab]?.[target] ?? []).flatMap(({ libraryName, snippet }) => [
        DownloadCount.prefetch(libraryName, {
          queryClient,
          signal: abortController.signal,
        }),
        queryClient
          .query(getHighlightedCode({ code: snippet }, abortController.signal))
          .catch(noop),
      ]),
    );
  },
  head: ({ params: { tab } }) =>
    generateMetadata({
      title: "Compliance",
      description: "Compliance with JSON Schema standards",
      openGraph: {
        url: `/json-schema/compliance/${tab}`,
      },
    }),
});

function getLibraryLabel({ libraryName, note }: JsonComplianceResult) {
  return `${libraryName}${note ? ` (${note})` : ""}`;
}

function RouteComponent() {
  const { tab } = Route.useParams();
  const { target, sortBy, sortDir, detail } = Route.useSearch();
  const { panelsRef, getTabLinkProps, getPanelProps } = useTabLinks(
    complianceTypeSchema.options,
    tab,
  );
  const { data } = useSuspenseQuery({
    ...getJsonSchemaBenchResults(),
    select: (data) => data.compliance,
  });
  const detailResult = useMemo(
    () => data[tab]?.[target]?.find((result) => result.id === detail),
    [data, tab, target, detail],
  );
  const downloadsByPkgName = useDownloadsByPkgName(data[tab]?.[target] ?? []);
  const sortedResults = useMemo(
    () =>
      data[tab]?.[target].toSorted(
        applySort(
          (a, b) => {
            switch (sortBy) {
              case "libraryName":
                return collator.compare(a.libraryName, b.libraryName);
              case "downloads":
                return compareDownloadsByPkgName(downloadsByPkgName, a, b);
              case "compliance":
                return processCount(a.results.count).pct - processCount(b.results.count).pct;
              default:
                return 0;
            }
          },
          {
            sortDir,
            fallbacks: [
              compareDownloadsByPkgName.fallback(downloadsByPkgName),
              compareStrings(getLibraryLabel),
              compareNumbers(
                (result: JsonComplianceResult) => processCount(result.results.count).pct,
              ),
            ],
          },
        ),
      ) ?? [],
    [data, tab, target, sortBy, sortDir, downloadsByPkgName],
  );
  return (
    <main>
      <div className="main">
        <Content components={{ wrapper: "div" }} />
        <PageFilters>
          <PageFilterChips
            {...complianceTargetProps}
            getLinkOptions={(target) => ({
              from: Route.fullPath,
              to: "/json-schema/compliance/$tab",
              params: ({ tab }) => ({ tab: ensureComplianceTab(tab) }),
              search: (search: {}) => ({ ...search, target }),
              disabled: !data[tab]?.[target]?.length,
            })}
          />
        </PageFilters>
      </div>
      <Tabs ariaLabel="Compliance Tabs" variant="responsive">
        {complianceTypeSchema.options.map((tabId) => (
          <InternalTabLink
            key={tabId}
            {...getTabLinkProps(
              tabId,
              linkOptions({
                from: Route.fullPath,
                to: "/json-schema/compliance/$tab",
                params: { tab: tabId },
                search: (({ target, ...search }: { target: ComplianceTarget }) => {
                  const nextTarget = data[tabId]?.[target]?.length
                    ? target
                    : (complianceTargetSchema.options.find((t) => data[tabId]?.[t]?.length) ??
                      target);
                  return { ...search, target: nextTarget };
                }) as never,
              }),
            )}
          >
            <MdSymbol>{complianceTypeLabels[tabId].icon}</MdSymbol>
            {complianceTypeLabels[tabId].label}
          </InternalTabLink>
        ))}
      </Tabs>
      <TabPanels ref={panelsRef}>
        {complianceTypeSchema.options.map((tabId) => {
          const TabContent = tabContent[tabId];
          return (
            <TabPanel key={tabId} {...getPanelProps(tabId)}>
              <div className="main">
                <TabContent components={{ wrapper: "div" }} />
                <ComplianceResults results={sortedResults} {...{ sortBy, sortDir }} />
              </div>
            </TabPanel>
          );
        })}
      </TabPanels>
      <ComplianceDetail result={detailResult} {...{ target }} />
    </main>
  );
}
