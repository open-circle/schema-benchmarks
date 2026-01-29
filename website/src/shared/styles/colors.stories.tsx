import preview from "../../../.storybook/preview";
import { colors } from "./colors";
import "./colors.stories.css";

const meta = preview.meta({
  title: "Theme/Colors",
  render: () => (
    <div className="colors-container">
      {colors.map((color) => (
        <div
          key={color}
          className="color-box"
          style={{
            backgroundColor: `var(--${color})`,
            color: `var(--on-${color})`,
          }}
        >
          {color}
        </div>
      ))}
    </div>
  ),
});

export const Default = meta.story();
