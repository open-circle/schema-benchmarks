import { describe, expect } from "vitest";
import { page } from "vitest/browser";

import { it } from "#test/browser/fixtures";

import { MdSymbol } from "../symbol";
import { ToggleButton } from "./toggle";

describe("ToggleButton", () => {
  it("should be active", async () => {
    await page.render(
      <ToggleButton active tooltip="Edit">
        <MdSymbol>edit</MdSymbol>
      </ToggleButton>,
    );
    await expect.element(page.getByRole("button", { name: "Edit" })).toBePressed();
  });
  it("should not be active", async () => {
    await page.render(
      <ToggleButton tooltip="Edit">
        <MdSymbol>edit</MdSymbol>
      </ToggleButton>,
    );
    await expect.element(page.getByRole("button", { name: "Edit" })).not.toBePressed();
  });
});
