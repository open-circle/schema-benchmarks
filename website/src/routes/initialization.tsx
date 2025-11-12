import { isEmpty } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import * as v from "valibot";
import { ResultsTable } from "@/components/results-table";
import { MdSymbol } from "@/components/symbol";
import {
  getResults,
  libraryTypeLabels,
  optionalLibraryTypeSchema,
} from "@/data/results";
import { useFocusGroup } from "@/hooks/use-focus-group";

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
    await queryClient.prefetchQuery(getResults(abortController.signal));
    return { crumb: "Initialization" };
  },
});

function RouteComponent() {
  const { libraryType } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getResults(),
    select: (results) => results.initialization,
  });
  const libraryTypeGroupRef = useFocusGroup();
  return (
    <>
      <div className="page-filters">
        <div className="page-filter__group">
          <h6 className="subtitle2">Library Type</h6>
          <div className="chip-collection" ref={libraryTypeGroupRef}>
            {optionalLibraryTypeSchema.wrapped.options.map((option) => (
              <Link
                key={option}
                to={Route.fullPath}
                search={{ libraryType: option }}
                className="chip"
                replace
                disabled={isEmpty(data[option])}
              >
                <MdSymbol>{libraryTypeLabels[option].icon}</MdSymbol>
                {libraryTypeLabels[option].label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <ResultsTable results={data[libraryType]} />
    </>
  );
}
