import preview from "../../../../.storybook/preview";
import { Button } from "../button";
import { MdSymbol } from "../symbol";
import { Banner, type BannerProps } from ".";
import { closeBanner, openBanner } from "./queue";

function BannerDemo(bannerProps: BannerProps) {
  return (
    <>
      <Banner />
      <Button onClick={() => openBanner(bannerProps)}>Open Banner</Button>
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
    actions: <Button onClick={() => closeBanner()}>Close</Button>,
  },
});

export const Default = meta.story();
