import preview from "#storybook/preview";

import "./typography.stories.css";

const styles = [
  "headline1",
  "headline2",
  "headline3",
  "headline4",
  "headline5",
  "headline6",
  "body1",
  "body2",
  "subtitle1",
  "subtitle2",
  "button",
  "overline",
  "caption",
];

const meta = preview.meta({
  title: "Theme/Typography",
  render: () => (
    <div className="typography-container">
      {styles.map((style) => (
        <p key={style} className={`typo-${style}`}>
          {style}
        </p>
      ))}
    </div>
  ),
});

export const Default = meta.story();
