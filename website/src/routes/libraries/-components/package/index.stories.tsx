import { mocked } from "storybook/test";

import { getReplacementUrlFn } from "#src/routes/libraries/-query";
import preview from "#storybook/preview";

import { PackageCard } from ".";

import "./index.css";

const meta = preview.meta({
  title: "Features/Benchmark/Libraries/PackageCard",
  component: PackageCard,
});

export const Default = meta.story({
  args: {
    pkgName: "valibot",
    versions: ["1.4.1"],
  },
});

export const Replacement = meta.story({
  args: {
    pkgName: "valibot",
    versions: ["1.4.1"],
  },
  beforeEach() {
    mocked(getReplacementUrlFn).mockImplementation(
      async () => "https://valibot.dev/guides/migrate/",
    );
  },
});
