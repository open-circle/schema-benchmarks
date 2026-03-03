export const admonitionTypes = ["info", "warning", "danger", "note"] as const;

export type AdmonitionType = (typeof admonitionTypes)[number];

export const admonitionDefaults: Record<
  AdmonitionType,
  {
    icon: string;
    title: string;
  }
> = {
  info: {
    icon: "info",
    title: "Info",
  },
  warning: {
    icon: "warning",
    title: "Warning",
  },
  danger: {
    icon: "error",
    title: "Danger",
  },
  note: {
    icon: "format_quote",
    title: "Note",
  },
};
