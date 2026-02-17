import * as v from "valibot";

export const sortDirectionSchema = v.picklist(["ascending", "descending"]);
export type SortDirection = v.InferOutput<typeof sortDirectionSchema>;

export const sortParams = <T extends v.GenericSchema<PropertyKey | undefined, PropertyKey>>(
  keySchema: T,
  initialDirection: SortDirection = "ascending",
) => ({
  sortBy: keySchema,
  sortDir: v.optional(sortDirectionSchema, initialDirection),
});

export interface SortSearch<T extends PropertyKey> {
  sortBy: T;
  sortDir: SortDirection;
}

export const toggleSort =
  <T extends PropertyKey>(key: T, initialDirection: SortDirection = "ascending") =>
  <Search extends SortSearch<T>>(search: Search): Search => ({
    ...search,
    sortBy: key,
    sortDir:
      search.sortBy === key
        ? search.sortDir === "ascending"
          ? "descending"
          : "ascending"
        : initialDirection,
  });

type Comparator<T> = (a: T, b: T) => number;

export const applySort =
  <T>(
    comparator: Comparator<T>,
    { sortDir, fallbacks = [] }: { sortDir?: SortDirection; fallbacks?: Array<Comparator<T>> },
  ): Comparator<T> =>
  (a, b) => {
    let c = comparator(a, b);

    // flip the sort direction if needed
    if (sortDir === "descending") c = -c;

    if (!c) {
      // go through our fallbacks until we find a non-zero value, or we run out of fallbacks
      for (const fallback of fallbacks) {
        c = fallback(a, b);
        if (c) break;
      }
    }

    return c;
  };
