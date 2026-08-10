import { complianceTargetSchema } from "@schema-benchmarks/json-schema-tests";
import { complianceTypeSchema } from "@schema-benchmarks/schemas";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, linkOptions } from "@tanstack/react-router";
import * as v from "valibot";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count.tsx";
import { getJsonSchemaBenchResults } from "#src/routes/json-schema/_conversion/-query.ts";
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
import { sortParams } from "#src/shared/lib/sort";

import { complianceTargetProps, complianceTypeIcons } from "./-constants.tsx";

const searchSchema = v.object({
  ...sortParams(v.optional(v.picklist(["libraryName", "passed"]), "libraryName")),
  tab: v.optional(complianceTypeSchema, "validation"),
  target: v.optional(complianceTargetSchema, "draft2020-12"),
});

export const Route = createFileRoute("/json-schema/compliance/")({
  validateSearch: searchSchema,
  component: RouteComponent,
  staticData: { crumb: "Compliance", wrapMain: false },
  loaderDeps: ({ search: { tab, target } }) => ({ tab, target }),
  async loader({ context: { queryClient }, deps: { tab, target }, abortController }) {
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

function RouteComponent() {
  const { tab } = Route.useSearch();
  const { panelsRef, getTabLinkProps, getPanelProps } = useTabLinks(
    complianceTypeSchema.options,
    tab,
  );
  const { data } = useSuspenseQuery({
    ...getJsonSchemaBenchResults(),
    select: (data) => data.compliance[tab],
  });
  return (
    <main>
      <div className="main">
        <PageFilters>
          <PageFilterChips
            {...complianceTargetProps}
            getLinkOptions={(target) => ({
              to: "/json-schema/compliance",
              search: (search: {}) => ({ ...search, target }),
              disabled: !data?.[target].length,
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
                to: "/json-schema/compliance",
                search: (search: {}) => ({ ...search, tab: tabId }),
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
            {tabId}
          </TabPanel>
        ))}
      </TabPanels>
    </main>
  );
}
