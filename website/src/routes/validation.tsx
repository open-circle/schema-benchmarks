import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import * as v from "valibot";
import { ResultsTable } from "@/components/results-table";
import { MdSymbol } from "@/components/symbol";
import {
  dataTypeLabels,
  getResults,
  libraryTypeLabels,
  optionalDataTypeSchema,
  optionalLibraryTypeSchema,
} from "@/data/results";
import { isEmpty } from "@/utils";

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
    await queryClient.prefetchQuery(getResults(abortController.signal));
    return { crumb: "Validation" };
  },
});

function RouteComponent() {
  const { libraryType, dataType } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getResults(),
    select: (results) => results.validation,
  });
  return (
    <>
      <div className="page-filters">
        <div className="page-filter__group">
          <h6 className="subtitle2">Library Type</h6>
          <div className="chip-collection">
            {optionalLibraryTypeSchema.wrapped.options.map((option) => (
              <Link
                key={option}
                to={Route.fullPath}
                search={({ dataType }) => ({
                  libraryType: option,
                  dataType,
                })}
                className="chip"
                replace
              >
                <MdSymbol>{libraryTypeLabels[option].icon}</MdSymbol>
                {libraryTypeLabels[option].label}
              </Link>
            ))}
          </div>
        </div>
        <div className="page-filter__group">
          <h6 className="subtitle2">Data Type</h6>
          <div className="chip-collection">
            {optionalDataTypeSchema.wrapped.options.map((option) => (
              <Link
                key={option}
                to={Route.fullPath}
                search={({ libraryType }) => ({
                  libraryType,
                  dataType: option,
                })}
                className="chip"
                replace
                disabled={isEmpty(data[libraryType][option])}
              >
                <MdSymbol>{dataTypeLabels[option].icon}</MdSymbol>
                {dataTypeLabels[option].label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <ResultsTable results={data[libraryType][dataType]} />
    </>
  );
}
