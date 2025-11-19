import { unsafeEntries, unsafeKeys } from "@schema-benchmarks/utils";
import * as vUtils from "@schema-benchmarks/utils/valibot";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, linkOptions } from "@tanstack/react-router";
import * as v from "valibot";
import { ButtonGroup, InternalLinkToggleButton } from "@/components/button";
import { PageFilter, PageFilters } from "@/components/page-filter";
import { PageFilterChips } from "@/components/page-filter/chips";
import { PageFilterTextField } from "@/components/page-filter/text-field";
import { MdSymbol } from "@/components/symbol";
import { DownloadTable } from "@/features/download/components/table";
import {
  getDownloadResults,
  minifyTypeProps,
  optionalMinifyTypeSchema,
} from "@/features/download/query";
import { speedPresets } from "@/features/download/speed";

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

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      {
        title: "Download - Schema Benchmarks",
      },
    ],
  }),
  validateSearch: searchSchema,
  async loader({ context: { queryClient }, abortController }) {
    await queryClient.prefetchQuery(getDownloadResults(abortController.signal));
    return { crumb: "Download" };
  },
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
      <PageFilters>
        <PageFilterChips
          {...minifyTypeProps}
          getLinkOptions={(option) => ({
            to: Route.fullPath,
            search: ({ mbps }) => ({ minifyType: option, mbps }),
          })}
        />
        <PageFilterTextField
          title="Download speed"
          value={mbpsAsNumber}
          type="number"
          min={1}
          step={1}
          required
          startIcon="speed"
          suffix="Mbps"
          style={{ "--text-field-min-width": "10rem" }}
          getLinkOptions={(event) =>
            linkOptions({
              from: Route.fullPath,
              to: Route.fullPath,
              search: ({ minifyType }) => {
                const mbps = event.target.valueAsNumber;
                if (Number.isNaN(mbps) || mbps <= 0) return { minifyType };
                return { minifyType, mbps };
              },
            })
          }
        />
        <PageFilter title="Speed presets">
          <ButtonGroup variant="outlined">
            {unsafeEntries(speedPresets).map(([slug, preset]) => (
              <InternalLinkToggleButton
                key={preset.name}
                aria-label={preset.name}
                to={Route.fullPath}
                search={({ minifyType }) => ({ minifyType, mbps: slug })}
                activeColor="primary"
              >
                <MdSymbol>{preset.icon}</MdSymbol>
              </InternalLinkToggleButton>
            ))}
          </ButtonGroup>
        </PageFilter>
      </PageFilters>
      <DownloadTable results={data} mbps={mbpsAsNumber} minify={minifyType} />
    </>
  );
}
