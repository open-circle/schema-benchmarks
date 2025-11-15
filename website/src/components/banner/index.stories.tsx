import type { Meta, StoryObj } from "@storybook/react-vite";
import { getButtonClasses } from "../button";
import { Banner, type BannerProps, openBanner } from ".";
import { closeBanner } from "./index";

function BannerDemo(bannerProps: BannerProps) {
  return (
    <>
      <Banner />
      <button
        type="button"
        className={getButtonClasses()}
        onClick={() => openBanner(bannerProps)}
      >
        Open Banner
      </button>
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
    actions: (
      <button
        type="button"
        className={getButtonClasses()}
        onClick={closeBanner}
      >
        Close
      </button>
    ),
  },
} satisfies Meta<typeof BannerDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
