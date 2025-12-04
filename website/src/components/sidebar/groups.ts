import { type LinkOptions, linkOptions } from "@tanstack/react-router";
import type { Key } from "react";

interface SidebarGroup {
  key: Key;
  links: Array<LinkOptions & { name: string; icon: string }>;
}

export const sidebarGroups: Array<SidebarGroup> = [
  {
    key: "home",
    links: [{ ...linkOptions({ to: "/" }), name: "Home", icon: "home" }],
  },
  {
    key: "benchmarks",
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
    ],
  },
  {
    key: "download",
    links: [
      {
        ...linkOptions({ to: "/download" }),
        name: "Download",
        icon: "download_2",
      },
    ],
  },
  {
    key: "playground",
    links: [
      {
        ...linkOptions({ to: "/playground" }),
        name: "Playground",
        icon: "code",
      },
    ],
  },
];
