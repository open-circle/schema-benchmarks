import { mergeRefs } from "@schema-benchmarks/utils/react";
import type { Ref } from "react";
import { assert, describe, expect, vi } from "vitest";
import { page } from "vitest/browser";

import { it } from "#test/browser/fixtures";

import { Tab, TabPanel, Tabs, useTabs, TabPanels } from ".";

function TabsFixture({ ref }: { ref?: Ref<HTMLDivElement> }) {
  const { getPanelProps, getTabProps, panelsRef } = useTabs(["first", "second"], "first");

  return (
    <>
      <Tabs ariaLabel="Tabs">
        <Tab {...getTabProps("first")}>First</Tab>
        <Tab {...getTabProps("second")}>Second</Tab>
      </Tabs>
      <TabPanels ref={mergeRefs(panelsRef, ref)}>
        <TabPanel {...getPanelProps("first")}>First panel</TabPanel>
        <TabPanel {...getPanelProps("second")}>Second panel</TabPanel>
      </TabPanels>
    </>
  );
}

describe("useTabs", () => {
  it("switches tabs", async () => {
    await page.render(<TabsFixture />);
    const firstTab = page.getByRole("tab", { name: "First" });
    const secondTab = page.getByRole("tab", { name: "Second" });
    const secondPanel = page.getByText("Second panel");
    await expect.element(firstTab).toHaveAttribute("aria-selected", "true");
    expect(secondPanel).not.toBeVisible();
    await secondTab.click();
    await expect.element(secondTab).toHaveAttribute("aria-selected", "true");
    await expect.element(secondPanel).toBeVisible();
  });

  it("uses view transitions with the correct direction", async () => {
    const panelsRef = { current: null as HTMLDivElement | null };

    await page.render(<TabsFixture ref={panelsRef} />);

    await expect.ref(panelsRef).not.toBeNull();

    assert(panelsRef.current, "panelsRef.current should not be null");

    using startViewTransition = vi.spyOn(panelsRef.current, "startViewTransition");

    await page.getByRole("tab", { name: "Second" }).click();

    expect(startViewTransition).toHaveBeenLastCalledWith(
      expect.objectContaining({ types: ["next"] }),
    );

    await page.getByRole("tab", { name: "First" }).click();
    expect(startViewTransition).toHaveBeenLastCalledWith(
      expect.objectContaining({ types: ["prev"] }),
    );
  });
});
