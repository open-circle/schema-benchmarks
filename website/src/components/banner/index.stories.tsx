import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { Banner, type BannerProps, openBanner } from ".";
import { closeBanner } from "./index";

function BannerDemo(bannerProps: BannerProps) {
  return (
    <>
      <Banner />
      <Button onClick={() => openBanner(bannerProps)}>Open Banner</Button>
    </>
  );
}

const meta = {
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
    icon: "warning",
    children: "Hello World",
    actions: <Button onClick={closeBanner}>Close</Button>,
  },
} satisfies Meta<typeof BannerDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
