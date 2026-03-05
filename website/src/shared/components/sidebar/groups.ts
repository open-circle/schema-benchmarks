import { type LinkOptions, linkOptions } from "@tanstack/react-router";
import type { Key } from "react";

interface SidebarGroup {
  key: Key;
  links: Array<LinkOptions & { name: string; icon: string }>;
  inset?: boolean;
}

export const sidebarGroups: Array<SidebarGroup> = [
  {
    key: "home",
    links: [{ ...linkOptions({ to: "/" }), name: "Home", icon: "home" }],
  },
  {
    key: "pre-runtime",
    links: [{ ...linkOptions({ to: "/download" }), name: "Download", icon: "download_2" }],
    inset: true,
  },
  {
    key: "runtime",
    links: [
      {
        ...linkOptions({ to: "/initialization" }),
        name: "Initialization",
        icon: "timer",
      },
      {
        ...linkOptions({ to: "/validation" }),
        name: "Validation",
        icon: "check_circle",
      },
      {
        ...linkOptions({ to: "/parsing" }),
        name: "Parsing",
        icon: "output_circle",
      },
      {
        ...linkOptions({ to: "/codec" }),
        name: "Codec",
        icon: "swap_horiz",
      },
      {
        ...linkOptions({ to: "/standard" }),
        name: "Standard Schema",
        icon: "schema",
      },
      {
        ...linkOptions({ to: "/string" }),
        name: "String",
        icon: "format_quote",
      },
    ],
    inset: true,
  },
  {
    key: "post-runtime",
    links: [{ ...linkOptions({ to: "/stack" }), name: "Stack", icon: "error" }],
  },
  {
    key: "blog",
    links: [
      {
        ...linkOptions({ to: "/blog" }),
        name: "Blog",
        icon: "article",
      },
    ],
  },
];
