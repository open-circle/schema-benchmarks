import preview from "../../../.storybook/preview";
import "./animation.stories.css";

const curves = [
  "enter",
  "exit-permanent",
  "standard",
  "exit-temporary",
] as const;
type Curve = (typeof curves)[number];

const meta = preview.type<{ args: { curve: Curve } }>().meta({
  title: "Theme/Animation",
  render: ({ curve }) => (
    <div className="animation-container">
      <div
        className="animation-box card"
        style={{ animationTimingFunction: `var(--${curve}-curve)` }}
      >
        {curve}
      </div>
    </div>
  ),
  argTypes: {
    curve: {
      control: {
        type: "radio",
      },
      options: curves,
    },
  },
  args: {
    curve: "standard",
  },
});

export const Default = meta.story();
