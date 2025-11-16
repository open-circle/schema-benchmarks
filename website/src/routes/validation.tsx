import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { PageFilterGroup } from "@/components/page-filter";
import { BenchTable } from "@/features/benchmark/components/table";
import {
  dataTypeProps,
  getBenchResults,
  libraryTypeProps,
  optionalDataTypeSchema,
  optionalLibraryTypeSchema,
} from "@/features/benchmark/query";

const searchSchema = v.object({
  libraryType: optionalLibraryTypeSchema,
  dataType: optionalDataTypeSchema,
});

export const Route = createFileRoute("/validation")({
  head: () => ({
    meta: [
      {
        title: "Validation - Schema Benchmarks",
      },
    ],
  }),
  component: RouteComponent,
  validateSearch: searchSchema,
  async loader({ context: { queryClient }, abortController }) {
    await queryClient.prefetchQuery(getBenchResults(abortController.signal));
    return { crumb: "Validation" };
  },
});

function RouteComponent() {
  const { libraryType, dataType } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) => results.validation[libraryType][dataType],
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
        <PageFilterGroup
          {...dataTypeProps}
          getLinkOptions={(option) => ({
            to: Route.fullPath,
            search: ({ libraryType }) => ({
              libraryType,
              dataType: option,
            }),
          })}
        />
      </div>
      <BenchTable results={data} />
    </>
  );
}
