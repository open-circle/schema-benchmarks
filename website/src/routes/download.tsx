import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { PageFilterGroup } from "@/components/page-filter";
import {
  getDownloadResults,
  minifyTypeProps,
  optionalMinifyTypeSchema,
} from "@/data/results";

const searchSchema = v.object({
  minifyType: optionalMinifyTypeSchema,
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
  const { minifyType } = Route.useSearch();
  const { data } = useSuspenseQuery(getDownloadResults());
  return (
    <div className="page-filters">
      <PageFilterGroup
        {...minifyTypeProps}
        getLinkOptions={(option) => ({
          to: Route.fullPath,
          search: { minifyType: option },
        })}
      />
    </div>
  );
}
