import preview from "../../../.storybook/preview";
import clsx from "clsx";
import "./elevation.stories.css";

const meta = preview.meta({
  title: "Theme/Elevation",
  render: () => (
    <div className="elevation-container">
      {Array.from({ length: 25 }, (_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: Not dynamic
          key={i}
          className={clsx("elevation-box", i === 0 && "bordered")}
          style={
            {
              boxShadow: `var(--elevation-${i})`,
              "--elevation-overlay-opacity": `var(--elevation-${i}-overlay-opacity)`,
            } as React.CSSProperties
          }
        >
          {i}
        </div>
      ))}
    </div>
  ),
});

export const Default = meta.story();

export const Transition = meta.story({
  render: () => (
    <div className="elevation-box elevation-transition">Hover me</div>
  ),
});
