export const sortableKeys = ["libraryName", "downloads", "line"] as const;
export type SortableKey = (typeof sortableKeys)[number];
