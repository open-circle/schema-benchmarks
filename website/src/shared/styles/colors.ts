export const colors = [
  "primary",
  "secondary",
  "pink",
  "red",
  "deep-orange",
  "orange",
  "amber",
  "yellow",
  "lime",
  "light-green",
  "green",
  "teal",
] as const;
export type Color = (typeof colors)[number];
