export const sortableKeys = ["libraryName", "downloads", "frame"] as const;
export type SortableKey = (typeof sortableKeys)[number];

export const highlightFrame = (output: string) =>
  output.replace(/(\s+at Object\.throw \(.+\)\n)/, "\x1b[7m$1\x1b[0m");
