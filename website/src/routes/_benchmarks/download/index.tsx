import {
  toggleFilter,
  unsafeEntries,
  unsafeKeys,
} from "@schema-benchmarks/utils";
import * as vUtils from "@schema-benchmarks/utils/valibot";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, linkOptions } from "@tanstack/react-router";
import * as v from "valibot";
import { ButtonGroup } from "#/shared/components/button";
import { InternalLinkToggleButton } from "#/shared/components/button/toggle";
import { PageFilter, PageFilters } from "#/shared/components/page-filter";
import { PageFilterChips } from "#/shared/components/page-filter/chips";
import { PageFilterTextField } from "#/shared/components/page-filter/text-field";
import { MdSymbol } from "#/shared/components/symbol";
import { generateMetadata } from "#/shared/data/meta";
import { getAllWeeklyDownloads } from "../-query";
import { DownloadResults } from "./-components/results";
import { minifyTypeProps, optionalMinifyTypeSchema } from "./-constants";
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
  async loader({
    context: { queryClient },
    deps: { minifyType },
    abortController,
  }) {
    const results = await queryClient.ensureQueryData(
      getDownloadResults(abortController.signal),
    );
    const downloadPromises = [];
    for (const { libraryName } of results[minifyType]) {
      downloadPromises.push(
        queryClient.ensureQueryData(
          getAllWeeklyDownloads(libraryName, abortController.signal),
        ),
      );
    }
    await Promise.all(downloadPromises);
  },
  staticData: { crumb: "Download" },
  component: RouteComponent,
});

function RouteComponent() {
  const { minifyType, mbps } = Route.useSearch();
  const mbpsAsNumber =
    typeof mbps === "string" ? speedPresets[mbps].mbps : mbps;
  const { data } = useSuspenseQuery({
    ...getDownloadResults(),
    select: (results) => results[minifyType],
  });

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
              search: ({ minifyType }) => {
                const mbps = event.target.valueAsNumber;
                if (Number.isNaN(mbps) || mbps <= 0) return { minifyType };
                return { minifyType, mbps };
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
                to="/download"
                search={({ minifyType }) => ({ minifyType, mbps: slug })}
                replace
                resetScroll={false}
                activeColor="primary"
              >
                <MdSymbol>{preset.icon}</MdSymbol>
              </InternalLinkToggleButton>
            ))}
          </ButtonGroup>
        </PageFilter>
      </PageFilters>
      <DownloadResults results={data} mbps={mbpsAsNumber} minify={minifyType} />
    </>
  );
}
