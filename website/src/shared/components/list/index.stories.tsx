import { Checkbox } from "#src/shared/components/checkbox";
import { Radio } from "#src/shared/components/radio";
import { MdSymbol } from "#src/shared/components/symbol";
import preview from "#storybook/preview";

import { List, ListItem, ListItemButton, ListItemContent, ListItemExternalLink } from ".";

import "./index.stories.css";

type Supporting = "icon" | "text" | "none";
function renderSupporting(supporting: Supporting, isTrailing = false) {
  if (supporting === "icon") return <MdSymbol>{isTrailing ? "more_vert" : "favorite"}</MdSymbol>;
  if (supporting === "text") return <span className="typo-caption">meta</span>;
  return undefined;
}

const meta = preview.type<{ args: { leading: Supporting; trailing: Supporting } }>().meta({
  title: "Components/List",
  argTypes: {
    leading: {
      control: {
        type: "inline-radio",
      },
      options: ["icon", "text", "none"],
    },
    trailing: {
      control: {
        type: "inline-radio",
      },
      options: ["icon", "text", "none"],
    },
  },
  args: {
    leading: "icon",
    trailing: "none",
  },
  render: (_props) => <></>,
});

export const SingleLine = meta.story({
  render: ({ leading, trailing }) => (
    <List className="demo-list">
      {Array.from({ length: 3 }, (_, idx) => (
        <ListItem key={idx}>
          <ListItemContent
            leading={renderSupporting(leading)}
            trailing={renderSupporting(trailing, true)}
          >
            List item
          </ListItemContent>
        </ListItem>
      ))}
    </List>
  ),
});

export const TwoLine = meta.story({
  render: ({ leading, trailing }) => (
    <List className="demo-list">
      {Array.from({ length: 3 }, (_, idx) => (
        <ListItem key={idx}>
          <ListItemContent
            lines={2}
            leading={renderSupporting(leading)}
            trailing={renderSupporting(trailing, true)}
            primary="List item title"
            supporting="Secondary text"
          />
        </ListItem>
      ))}
    </List>
  ),
});

export const ThreeLine = meta.story({
  render: ({ leading, trailing }) => (
    <List className="demo-list">
      {Array.from({ length: 3 }, (_, idx) => (
        <ListItem key={idx}>
          <ListItemContent
            lines={3}
            leading={renderSupporting(leading)}
            trailing={renderSupporting(trailing, true)}
            primary="List item title"
            supporting="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultrices ultrices, nunc nisl ultrices nunc, euismod nisl nisl euismod nisl."
          />
        </ListItem>
      ))}
    </List>
  ),
});

export const Button = meta.story({
  render: () => (
    <List className="demo-list">
      <ListItem>
        <ListItemButton aria-pressed="true">
          <ListItemContent leading={<MdSymbol>edit</MdSymbol>}>Button</ListItemContent>
        </ListItemButton>
      </ListItem>

      <ListItem>
        <ListItemButton>
          <ListItemContent leading={<MdSymbol>edit</MdSymbol>}>Button</ListItemContent>
        </ListItemButton>
      </ListItem>
    </List>
  ),
});

export const Link = meta.story({
  render: () => (
    <List className="demo-list">
      <ListItem>
        <ListItemExternalLink data-status="active" href="https://example.com">
          <ListItemContent leading={<MdSymbol>edit</MdSymbol>}>Link</ListItemContent>
        </ListItemExternalLink>
      </ListItem>
      <ListItem>
        <ListItemExternalLink href="https://example.com">
          <ListItemContent leading={<MdSymbol>edit</MdSymbol>}>Link</ListItemContent>
        </ListItemExternalLink>
      </ListItem>
    </List>
  ),
});

export const LabelControls = meta.story({
  render: () => (
    <List className="demo-list">
      <ListItem>
        <ListItemContent
          as="label"
          leading={<Radio name="benchmark-order" defaultChecked value="fastest" />}
        >
          Sort by fastest
        </ListItemContent>
      </ListItem>
      <ListItem>
        <ListItemContent as="label" trailing={<Radio name="benchmark-order" value="smallest" />}>
          Sort by smallest
        </ListItemContent>
      </ListItem>
      <ListItem>
        <ListItemContent
          as="label"
          leading={<Checkbox name="filters" defaultChecked value="include-conversion" />}
        >
          Include conversion benchmarks
        </ListItemContent>
      </ListItem>
      <ListItem>
        <ListItemContent
          as="label"
          trailing={<Checkbox name="filters" value="show-experimental" />}
          lines={2}
          primary="Show experimental libraries"
          supporting="May include incomplete or unstable results"
        />
      </ListItem>
    </List>
  ),
});
