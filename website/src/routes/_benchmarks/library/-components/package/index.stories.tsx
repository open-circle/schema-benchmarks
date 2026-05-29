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
    versions: ["1.4.1"],
  },
});
