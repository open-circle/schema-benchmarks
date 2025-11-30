import type { Meta, StoryObj } from "@storybook/react-vite";
import { MdSymbol } from "../symbol";
import { Scaler } from ".";

const meta = {
  title: "Components/Scaler",
  component: Scaler,
  args: {
    icon: <MdSymbol>sentiment_very_dissatisfied</MdSymbol>,
    color: "var(--pink)",
    children: "20",
    symbolLabel: "Sad",
  },
} satisfies Meta<typeof Scaler>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
