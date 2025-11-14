import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { BenchTable } from "@/components/bench-table";
import { PageFilterGroup } from "@/components/page-filter";
import {
  getBenchResults,
  libraryTypeProps,
  optionalLibraryTypeSchema,
} from "@/data/results";

const searchSchema = v.object({
  libraryType: optionalLibraryTypeSchema,
});

export const Route = createFileRoute("/initialization")({
  head: () => ({
    meta: [
      {
        title: "Initialization - Schema Benchmarks",
      },
    ],
  }),
  component: RouteComponent,
  validateSearch: searchSchema,
  async loader({ context: { queryClient }, abortController }) {
    await queryClient.prefetchQuery(getBenchResults(abortController.signal));
    return { crumb: "Initialization" };
  },
});

function RouteComponent() {
  const { libraryType } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) => results.initialization,
  });
  return (
    <>
      <div className="page-filters">
        <PageFilterGroup
          {...libraryTypeProps}
          getLinkOptions={(option) => ({
            to: Route.fullPath,
            search: { libraryType: option },
          })}
        />
      </div>
      <BenchTable results={data[libraryType]} />
    </>
  );
}
