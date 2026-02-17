import {
  collator,
  toggleFilter,
  uniqueBy,
  unsafeEntries,
  unsafeKeys,
} from "@schema-benchmarks/utils";
import * as vUtils from "@schema-benchmarks/utils/valibot";
import {
  useSuspenseQueries,
  useSuspenseQuery,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { createFileRoute, linkOptions } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import * as v from "valibot";

import { ButtonGroup } from "#/shared/components/button";
import { InternalLinkToggleButton } from "#/shared/components/button/toggle";
import { PageFilter, PageFilters } from "#/shared/components/page-filter";
import { PageFilterChips } from "#/shared/components/page-filter/chips";
import { PageFilterTextField } from "#/shared/components/page-filter/text-field";
import { MdSymbol } from "#/shared/components/symbol";
import { generateMetadata } from "#/shared/data/meta";
import { sortParams } from "#/shared/lib/sort";

import { DownloadCount } from "../-components/count";
import { getAllWeeklyDownloads } from "../-query";
import { DownloadResults } from "./-components/results";
import { minifyTypeProps, optionalMinifyTypeSchema, sortableKeys } from "./-constants";
import { getDownloadResults } from "./-query";
import { speedPresets } from "./-speed";
import Content from "./content.mdx";

import downloadStyles from "./styles.css?url";

const searchSchema = v.object({
  minifyType: optionalMinifyTypeSchema,
  mbps: v.optional(
    v.union([
      v.pipe(vUtils.coerceNumber, v.minValue(1)),
      ...unsafeKeys(speedPresets).map((slug) => v.literal(slug)),
    ]),
    "4g",
  ),
  ...sortParams(v.optional(v.picklist(sortableKeys), "gzipBytes")),
});

export const Route = createFileRoute("/_benchmarks/download/")({
  head: () =>
    generateMetadata({
      title: "Download",
      description: "Comparison of library download sizes.",
      openGraph: {
        url: "/download/",
      },
      links: [
        {
          rel: "stylesheet",
          href: downloadStyles,
        },
      ],
    }),
  validateSearch: searchSchema,
  loaderDeps: ({ search: { minifyType } }) => ({ minifyType }),
  async loader({ context: { queryClient }, deps: { minifyType }, abortController }) {
    const results = await queryClient.ensureQueryData(getDownloadResults(abortController.signal));
    const downloadPromises = [];
    for (const { libraryName } of results[minifyType]) {
      downloadPromises.push(
        DownloadCount.prefetch(libraryName, {
          queryClient,
          signal: abortController.signal,
        }),
      );
    }
    await Promise.all(downloadPromises);
  },
  staticData: { crumb: "Download" },
  component: RouteComponent,
});

function RouteComponent() {
  const { minifyType, mbps, sortBy, sortDir } = Route.useSearch();
  const mbpsAsNumber = typeof mbps === "string" ? speedPresets[mbps].mbps : mbps;
  const { data } = useSuspenseQuery({
    ...getDownloadResults(),
    select: (results) => results[minifyType],
  });
  const pkgNames = useMemo(
    () =>
      uniqueBy(data, (d) => DownloadCount.getPackageName(d.libraryName)).map((d) =>
        DownloadCount.getPackageName(d.libraryName),
      ),
    [data],
  );
  const downloadsByPkgName = useSuspenseQueries({
    queries: useMemo(
      () => pkgNames.map((libraryName) => getAllWeeklyDownloads(libraryName)),
      [pkgNames],
    ),
    combine: useCallback(
      (results: Array<UseSuspenseQueryResult<number>>) =>
        Object.fromEntries(results.map((result, idx) => [pkgNames[idx], result.data])),
      [pkgNames],
    ),
  });
  const sortedData = useMemo(
    () =>
      data.toSorted((a, b) => {
        let c = 0;
        switch (sortBy) {
          case "downloads":
            c =
              (downloadsByPkgName[DownloadCount.getPackageName(a.libraryName)] ?? 0) -
              (downloadsByPkgName[DownloadCount.getPackageName(b.libraryName)] ?? 0);
            break;
          case "libraryName":
            c = collator.compare(a[sortBy], b[sortBy]);
            break;
          default:
            c = a[sortBy] - b[sortBy];
        }
        // flip the sort direction if needed
        if (sortDir === "descending") c = -c;
        // sort by library name as a tiebreaker
        c ||= collator.compare(a.libraryName, b.libraryName);
        return c;
      }),
    [data, downloadsByPkgName, sortBy, sortDir],
  );

  return (
    <>
      <Content components={{ wrapper: "div" }} />
      <PageFilters>
        <PageFilterChips
          {...minifyTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/download",
            search: toggleFilter("minifyType", option),
            replace: true,
            resetScroll: false,
          })}
        />
        <PageFilterTextField
          title="Download speed"
          value={mbpsAsNumber}
          type="number"
          min={1}
          step={1}
          required
          startIcon={<MdSymbol>speed</MdSymbol>}
          suffix="Mbps"
          style={{ "--text-field-min-width": "10rem" }}
          getLinkOptions={(event) =>
            linkOptions({
              from: Route.fullPath,
              to: "/download",
              search: ({ minifyType, ...rest }) => {
                const mbps = event.target.valueAsNumber;
                return {
                  ...rest,
                  minifyType,
                  mbps: Number.isNaN(mbps) || mbps <= 0 ? undefined : mbps,
                };
              },
              replace: true,
              resetScroll: false,
            })
          }
        />
        <PageFilter title="Speed presets" titleId="speed-presets-title">
          <ButtonGroup variant="outlined" ariaLabelledBy="speed-presets-title">
            {unsafeEntries(speedPresets).map(([slug, preset]) => (
              <InternalLinkToggleButton
                key={preset.name}
                tooltip={preset.name}
                to={"/download"}
                search={({ minifyType, ...rest }) => ({ ...rest, minifyType, mbps: slug })}
                replace
                resetScroll={false}
              >
                <MdSymbol>{preset.icon}</MdSymbol>
              </InternalLinkToggleButton>
            ))}
          </ButtonGroup>
        </PageFilter>
      </PageFilters>
      <DownloadResults
        results={sortedData}
        mbps={mbpsAsNumber}
        minify={minifyType}
        {...{ sortBy, sortDir }}
      />
    </>
  );
}
