import * as vUtils from "@schema-benchmarks/utils/valibot";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, linkOptions } from "@tanstack/react-router";
import * as v from "valibot";
import { ButtonGroup, getButtonClasses } from "@/components/button";
import { PageFilterGroup } from "@/components/page-filter";
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
  mbps: v.optional(v.pipe(vUtils.coerceNumber, v.minValue(1)), 32),
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
  const { data } = useSuspenseQuery({
    ...getDownloadResults(),
    select: (results) => results[minifyType],
  });

  return (
    <>
      <div className="page-filters">
        <PageFilterGroup
          {...minifyTypeProps}
          getLinkOptions={(option) => ({
            to: Route.fullPath,
            search: ({ mbps }) => ({ minifyType: option, mbps }),
          })}
        />
        <PageFilterTextField
          title="Download speed"
          value={mbps}
          type="number"
          min={1}
          step={1}
          required
          startIcon="speed"
          suffix="Mbps"
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
        <div className="page-filters__group">
          <h6 className="typo-caption">Speed presets</h6>
          <ButtonGroup variant="outlined">
            {speedPresets.map((preset) => (
              <Link
                key={preset.name}
                aria-label={preset.name}
                className={getButtonClasses({ variant: "toggle" })}
                to={Route.fullPath}
                search={({ minifyType }) => ({ minifyType, mbps: preset.mbps })}
              >
                <MdSymbol>{preset.icon}</MdSymbol>
              </Link>
            ))}
          </ButtonGroup>
        </div>
      </div>
      <DownloadTable results={data} mbps={mbps} minify={minifyType} />
    </>
  );
}
