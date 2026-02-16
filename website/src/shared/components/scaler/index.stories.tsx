import preview from "#storybook/preview";

import { Scaler } from ".";
import { MdSymbol } from "../symbol";

const meta = preview.meta({
  title: "Components/Scaler",
  component: Scaler,
  args: {
    icon: <MdSymbol>sentiment_very_dissatisfied</MdSymbol>,
    color: "var(--pink)",
    children: "20",
    symbolLabel: "Sad",
  },
});

export const Default = meta.story();
