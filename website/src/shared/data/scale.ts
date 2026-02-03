export const color = [
  "var(--scale1)",
  "var(--scale2)",
  "var(--scale3)",
  "var(--scale4)",
  "var(--scale5)",
] as const;
export type Color = (typeof color)[number];

export const sentiment = [
  "sentiment_very_dissatisfied",
  "sentiment_dissatisfied",
  "sentiment_neutral",
  "sentiment_satisfied",
  "sentiment_very_satisfied",
] as const;
export type Sentiment = (typeof sentiment)[number];

export const stat = [
  "stat_minus_3",
  "stat_minus_2",
  "stat_minus_1",
  //"stat_0",
  "stat_1",
  "stat_2",
  "stat_3",
] as const;
export type Stat = (typeof stat)[number];
