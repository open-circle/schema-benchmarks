import preview from "../../../../.storybook/preview";
import { MdSymbol } from "../symbol";
import { Scaler } from ".";

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
