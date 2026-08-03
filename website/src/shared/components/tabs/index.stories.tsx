import { linkOptions, useSearch } from "@tanstack/react-router";

import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import preview from "#storybook/preview";

import type { TabVariant } from ".";
import { Tabs, Tab, InternalTabLink, TabPanel, useTabs, useTabLinks, TabPanels } from ".";

interface StoryArgs {
  orientation: "horizontal" | "vertical";
  variant?: TabVariant;
}

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: "Components/Tabs",
  args: {
    orientation: "horizontal",
    variant: "fullwidth",
  },
  argTypes: {
    orientation: {
      control: {
        type: "inline-radio",
      },
      options: ["horizontal", "vertical"],
    },
    variant: {
      control: {
        type: "inline-radio",
      },
      options: ["fullwidth", "responsive"],
    },
  },
  parameters: {
    layout: "fullscreen",
  },
});

export default meta;

function DemoTabs({ orientation, variant }: StoryArgs) {
  const { getTabProps, getPanelProps, panelsRef } = useTabs(["home", "user", "settings"], "home");
  return (
    <div className="demo-tabs-container">
      <Tabs {...{ orientation, variant }} ariaLabel="Demo Tabs">
        <Tab {...getTabProps("home")}>
          <MdSymbol>home</MdSymbol>
          Home
        </Tab>
        <Tab {...getTabProps("user")}>
          <MdSymbol>person</MdSymbol>
          User
        </Tab>
        <Tab {...getTabProps("settings")}>
          <MdSymbol>settings</MdSymbol>
          Settings
        </Tab>
      </Tabs>
      <TabPanels ref={panelsRef} {...{ orientation }}>
        <TabPanel {...getPanelProps("home")}>
          <table>
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Row 1, Cell 1</td>
                <td>Row 1, Cell 2</td>
              </tr>
              <tr>
                <td>Row 2, Cell 1</td>
                <td>Row 2, Cell 2</td>
              </tr>
            </tbody>
          </table>
        </TabPanel>
        <TabPanel {...getPanelProps("user")}>User content</TabPanel>
        <TabPanel {...getPanelProps("settings")}>Settings content</TabPanel>
      </TabPanels>
    </div>
  );
}

export const Default = meta.story({
  render: (args) => <DemoTabs {...args} />,
});

const LINK_TABS = ["invalid", "valid"] as const;

function DemoLinkTabs({ orientation, variant }: StoryArgs) {
  const dataType = useSearch({
    from: "/parsing/" as "/_benchmarks/_runtime/parsing/",
    select: ({ dataType }) => dataType,
  });
  const { panelsRef, getTabLinkProps, getPanelProps } = useTabLinks(LINK_TABS, dataType);
  return (
    <div className="demo-tabs-container">
      <Tabs {...{ orientation, variant }} ariaLabel="Demo Tabs">
        <InternalTabLink
          {...getTabLinkProps(
            "invalid",
            linkOptions({ to: "/parsing", search: { dataType: "invalid" } }),
          )}
          id="invalid"
          panelId="invalid-panel"
        >
          Invalid
        </InternalTabLink>
        <InternalTabLink
          {...getTabLinkProps(
            "valid",
            linkOptions({ to: "/parsing", search: { dataType: "valid" } }),
          )}
          id="valid"
          panelId="valid-panel"
        >
          Valid
        </InternalTabLink>
      </Tabs>
      <TabPanels ref={panelsRef} {...{ orientation }}>
        <TabPanel {...getPanelProps("invalid")}>Invalid content</TabPanel>
        <TabPanel {...getPanelProps("valid")}>Valid content</TabPanel>
      </TabPanels>
    </div>
  );
}

export const LinkTabs = meta.story({
  render: (args) => <DemoLinkTabs {...args} />,
  parameters: {
    tanstack: {
      router: {
        route: {
          path: "/parsing/",
        },
        query: {
          dataType: "invalid",
        },
      },
    },
  },
});
