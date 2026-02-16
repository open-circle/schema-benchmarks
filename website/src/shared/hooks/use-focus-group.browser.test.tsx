import { describe, expect } from "vitest";
import { page, userEvent } from "vitest/browser";

import { it } from "#test/browser/fixtures";

import { useFocusGroup } from "./use-focus-group";

function TestComponent({ direction }: { direction: "horizontal" | "vertical" }) {
  const group = useFocusGroup({ orientation: direction });
  return (
    <div
      ref={group}
      style={{
        display: "flex",
        flexDirection: direction === "horizontal" ? "row" : "column",
      }}
    >
      <button type="button">1</button>
      <button type="button">2</button>
      <button type="button">3</button>
    </div>
  );
}

describe("useFocusGroup", () => {
  describe.each([
    ["horizontal", "ArrowRight", "ArrowLeft"],
    ["vertical", "ArrowDown", "ArrowUp"],
  ] as const)("direction: %s", (direction, nextKey, prevKey) => {
    it("should focus the next element", async () => {
      await page.renderWithProviders(<TestComponent direction={direction} />);
      await page.getByRole("button", { name: "1" }).click();
      await expect.element(page.getByRole("button", { name: "1" })).toHaveFocus();
      await userEvent.keyboard(`[${nextKey}]`);
      await expect.element(page.getByRole("button", { name: "2" })).toHaveFocus();
      await userEvent.keyboard(`[${nextKey}]`);
      await expect.element(page.getByRole("button", { name: "3" })).toHaveFocus();
    });
    it("should focus the previous element", async () => {
      await page.renderWithProviders(<TestComponent direction={direction} />);
      await page.getByRole("button", { name: "3" }).click();
      await expect.element(page.getByRole("button", { name: "3" })).toHaveFocus();
      await userEvent.keyboard(`[${prevKey}]`);
      await expect.element(page.getByRole("button", { name: "2" })).toHaveFocus();
      await userEvent.keyboard(`[${prevKey}]`);
      await expect.element(page.getByRole("button", { name: "1" })).toHaveFocus();
    });
  });
});
