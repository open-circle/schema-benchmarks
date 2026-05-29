import preview from "#storybook/preview";

import { PackageCard } from ".";

import "./index.css";

const meta = preview.meta({
  title: "Features/Benchmark/Library/PackageCard",
  component: PackageCard,
});

export const Default = meta.story({
  args: {
    pkgName: "valibot",
    libraries: [{ libraryName: "valibot", version: "1.4.1" }],
  },
});
