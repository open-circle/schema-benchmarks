export const sortableKeys = ["libraryName", "downloads", "encode", "decode"] as const;
export type SortableKey = (typeof sortableKeys)[number];
