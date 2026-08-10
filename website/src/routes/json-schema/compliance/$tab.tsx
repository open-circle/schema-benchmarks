import type { JsonComplianceResult } from "@schema-benchmarks/bench";
import type { ComplianceTarget } from "@schema-benchmarks/json-schema-tests";
import { complianceTargetSchema } from "@schema-benchmarks/json-schema-tests";
import { complianceTypeSchema } from "@schema-benchmarks/schemas";
import { assert, collator, compareNumbers, compareStrings } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, linkOptions } from "@tanstack/react-router";
import { useMemo } from "react";
import * as v from "valibot";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count.tsx";
import {
  compareDownloadsByPkgName,
  useDownloadsByPkgName,
} from "#src/routes/_benchmarks/-hooks.ts";
import { getJsonSchemaBenchResults } from "#src/routes/json-schema/_conversion/-query.ts";
import { ComplianceTable } from "#src/routes/json-schema/compliance/-components/table/index.tsx";
import { PageFilterChips } from "#src/shared/components/page-filter/chips.tsx";
import { PageFilters } from "#src/shared/components/page-filter/index.tsx";
import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import { Pie } from "#src/shared/components/table/pie.tsx";
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
  complianceTypeIcons,
  getPctCompliance,
  sortableKeys,
} from "./-constants.tsx";

const searchSchema = v.object({
  ...sortParams(v.optional(v.picklist(sortableKeys), "compliance"), "descending"),
  target: v.optional(complianceTargetSchema, "draft2020-12"),
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
    const { compliance } = await queryClient.ensureQueryData(
      getJsonSchemaBenchResults(abortController.signal),
    );
    await Promise.all(
      (compliance[tab]?.[target] ?? []).flatMap(({ libraryName, snippet }) => [
        DownloadCount.prefetch(libraryName, {
          queryClient,
          signal: abortController.signal,
        }),
        queryClient.prefetchQuery(getHighlightedCode({ code: snippet }, abortController.signal)),
      ]),
    );
  },
  head: () =>
    generateMetadata({
      title: "Compliance",
      description: "Compliance with JSON Schema standards",
      openGraph: {
        url: "/json-schema/compliance/",
      },
    }),
});

function getLibraryLabel({ libraryName, note }: JsonComplianceResult) {
  return `${libraryName}${note ? ` (${note})` : ""}`;
}

function RouteComponent() {
  const { tab } = Route.useParams();
  const { target, sortBy, sortDir } = Route.useSearch();
  const { panelsRef, getTabLinkProps, getPanelProps } = useTabLinks(
    complianceTypeSchema.options,
    tab,
  );
  const { data } = useSuspenseQuery({
    ...getJsonSchemaBenchResults(),
    select: (data) => data.compliance,
  });
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
                return getPctCompliance(a) - getPctCompliance(b);
              default:
                return 0;
            }
          },
          {
            sortDir,
            fallbacks: [
              compareDownloadsByPkgName.fallback(downloadsByPkgName),
              compareStrings(getLibraryLabel),
              compareNumbers(getPctCompliance),
            ],
          },
        ),
      ) ?? [],
    [data, tab, target, sortBy, sortDir, downloadsByPkgName],
  );
  return (
    <main>
      <div className="main">
        <PageFilters>
          <PageFilterChips
            {...complianceTargetProps}
            getLinkOptions={(target) => ({
              from: Route.fullPath,
              to: "/json-schema/compliance/$tab",
              params: ({ tab }) => ({ tab }),
              search: (search: {}) => ({ ...search, target }),
              disabled: !data[tab]?.[target].length,
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
                  const nextTarget = data[tabId]?.[target].length
                    ? target
                    : (complianceTargetSchema.options.find((t) => data[tabId]?.[t].length) ??
                      target);
                  return { ...search, target: nextTarget };
                }) as never,
              }),
            )}
          >
            <MdSymbol>{complianceTypeIcons[tabId]}</MdSymbol>
            {tabId}
          </InternalTabLink>
        ))}
      </Tabs>
      <TabPanels ref={panelsRef} className="main">
        {complianceTypeSchema.options.map((tabId) => (
          <TabPanel key={tabId} {...getPanelProps(tabId)}>
            <ComplianceTable
              results={sortedResults}
              {...{ sortBy, sortDir }}
              pieScale={Pie.getScale((data[tabId]?.[target] ?? []).map(getPctCompliance), {
                max: 1,
              })}
            />
          </TabPanel>
        ))}
      </TabPanels>
    </main>
  );
}
