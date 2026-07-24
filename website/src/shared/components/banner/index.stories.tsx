import { Button } from "#src/shared/components/button";
import { MdSymbol } from "#src/shared/components/symbol";
import preview from "#storybook/preview";

import { Banner, type BannerProps } from ".";
import { bannerStore } from "./queue";

function BannerDemo(bannerProps: BannerProps) {
  return (
    <>
      <Banner />
      <Button onClick={() => bannerStore.actions.open(bannerProps)}>Open Banner</Button>
    </>
  );
}

const meta = preview.meta({
  title: "Components/Banner",
  parameters: {
    layout: "fullscreen",
  },
  component: BannerDemo,
  argTypes: {
    color: {
      control: {
        type: "inline-radio",
      },
      options: ["success", "error", "warning", undefined],
    },
  },
  args: {
    icon: <MdSymbol>warning</MdSymbol>,
    children: "Hello World",
    actions: <Button onClick={() => bannerStore.actions.close()}>Close</Button>,
  },
});

export const Default = meta.story();
