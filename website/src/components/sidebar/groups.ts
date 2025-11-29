import { type LinkOptions, linkOptions } from "@tanstack/react-router";
import type { Key } from "react";

interface SidebarGroup {
  key: Key;
  subheader?: string;
  links: Array<LinkOptions & { name: string; icon: string }>;
}

export const sidebarGroups: Array<SidebarGroup> = [
  {
    key: "core",
    links: [
      { ...linkOptions({ to: "/" }), name: "Home", icon: "home" },
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
        ...linkOptions({ to: "/download" }),
        name: "Download",
        icon: "download_2",
      },
    ],
  },
];
