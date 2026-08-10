import { type LinkOptions, linkOptions } from "@tanstack/react-router";
import type { Key, ReactNode } from "react";

interface SidebarGroup {
  key: Key;
  subheader?: ReactNode;
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
    key: "json-schema",
    subheader: "JSON Schema",
    links: [
      {
        ...linkOptions({ to: "/json-schema/to-json/$tab", params: { tab: "matrix" } }),
        name: "Schema to JSON",
        icon: "data_object",
      },
      {
        ...linkOptions({ to: "/json-schema/from-json" }),
        name: "JSON to Schema",
        icon: "code",
      },
      {
        ...linkOptions({ to: "/json-schema/compliance/$tab", params: { tab: "validation" } }),
        name: "Compliance",
        icon: "verified",
      },
    ],
  },
  {
    key: "library",
    links: [{ ...linkOptions({ to: "/libraries" }), name: "Libraries", icon: "deployed_code" }],
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
