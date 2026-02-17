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
