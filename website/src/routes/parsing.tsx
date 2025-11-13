import { isEmpty } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import * as v from "valibot";
import { ResultsTable } from "@/components/results-table";
import { MdSymbol } from "@/components/symbol";
import {
  dataTypeLabels,
  errorTypeLabels,
  getResults,
  libraryTypeLabels,
  optionalDataTypeSchema,
  optionalErrorTypeSchema,
  optionalLibraryTypeSchema,
} from "@/data/results";
import { useFocusGroup } from "@/hooks/use-focus-group";

const searchSchema = v.object({
  libraryType: optionalLibraryTypeSchema,
  dataType: optionalDataTypeSchema,
  errorType: optionalErrorTypeSchema,
});

export const Route = createFileRoute("/parsing")({
  head: () => ({
    meta: [
      {
        title: "Parsing - Schema Benchmarks",
      },
    ],
  }),
  component: RouteComponent,
  validateSearch: searchSchema,
  async loader({ context: { queryClient }, abortController }) {
    await queryClient.prefetchQuery(getResults(abortController.signal));
    return { crumb: "Parsing" };
  },
});

function RouteComponent() {
  const { libraryType, dataType, errorType } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getResults(),
    select: (results) => results.parsing,
  });
  const libraryTypeGroupRef = useFocusGroup();
  const dataTypeGroupRef = useFocusGroup();
  const errorTypeGroupRef = useFocusGroup();
  return (
    <>
      <div className="page-filters">
        <div className="page-filter__group">
          <h6 className="typo-subtitle2">Library Type</h6>
          <div className="chip-collection" ref={libraryTypeGroupRef}>
            {optionalLibraryTypeSchema.wrapped.options.map((option) => (
              <Link
                key={option}
                to={Route.fullPath}
                search={({ dataType, errorType }) => ({
                  libraryType: option,
                  dataType,
                  errorType,
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
          <h6 className="typo-subtitle2">Data Type</h6>
          <div className="chip-collection" ref={dataTypeGroupRef}>
            {optionalDataTypeSchema.wrapped.options.map((option) => (
              <Link
                key={option}
                to={Route.fullPath}
                search={({ libraryType, errorType }) => ({
                  libraryType,
                  dataType: option,
                  errorType,
                })}
                className="chip"
                replace
              >
                <MdSymbol>{dataTypeLabels[option].icon}</MdSymbol>
                {dataTypeLabels[option].label}
              </Link>
            ))}
          </div>
        </div>
        <div className="page-filter__group">
          <h6 className="typo-subtitle2">Error Type</h6>
          <div className="chip-collection" ref={errorTypeGroupRef}>
            {optionalErrorTypeSchema.wrapped.options.map((option) => (
              <Link
                key={option}
                to={Route.fullPath}
                search={({ libraryType, dataType }) => ({
                  libraryType,
                  dataType,
                  errorType: option,
                })}
                className="chip"
                replace
                disabled={isEmpty(data[libraryType][dataType][option])}
              >
                <MdSymbol>{errorTypeLabels[option].icon}</MdSymbol>
                {errorTypeLabels[option].label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <ResultsTable results={data[libraryType][dataType][errorType]} />
    </>
  );
}
