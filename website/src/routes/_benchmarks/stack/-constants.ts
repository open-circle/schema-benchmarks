export const sortableKeys = ["libraryName", "downloads", "frame"] as const;
export type SortableKey = (typeof sortableKeys)[number];
