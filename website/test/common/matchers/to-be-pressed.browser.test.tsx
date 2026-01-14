import { it } from "@test/browser/fixtures";
import { describe, expect } from "vitest";
import { type Locator, page } from "vitest/browser";
import { alignedAnsiStyleSerializer } from "./utils";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

describe.each([
  "locator",
  "element",
] as const)("toBePressed (with %s)", (type) => {
  function expectElement(locator: Locator) {
    return expect(type === "locator" ? locator : locator.element());
  }
  it("should pass for pressed button", async () => {
    await page.render(
      <button type="button" aria-pressed="true">
        Pressed
      </button>,
    );
    const button = page.getByRole("button", { name: "Pressed" });
    expectElement(button).toBePressed();
  });
  it("should pass for pressed input[type=button]", async () => {
    await page.render(<input type="button" aria-pressed="true" />);
    const button = page.getByRole("button");
    expectElement(button).toBePressed();
  });
  it("should fail for unpressed button", async () => {
    await page.render(
      <button type="button" aria-pressed="false">
        Pressed
      </button>,
    );
    const button = page.getByRole("button", { name: "Pressed" });
    expectElement(button).not.toBePressed();
    expect(() =>
      expectElement(button).toBePressed(),
    ).toThrowErrorMatchingSnapshot();
  });
  it("should fail for button without aria-pressed", async () => {
    await page.render(<button type="button">Pressed</button>);
    const button = page.getByRole("button", { name: "Pressed" });
    expectElement(button).not.toBePressed();
    expect(() =>
      expectElement(button).toBePressed(),
    ).toThrowErrorMatchingSnapshot();
  });
  it("should fail for non-button", async () => {
    await page.render(<div>Pressed</div>);
    const div = page.getByText("Pressed");
    expect(() =>
      expectElement(div).toBePressed(),
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      expectElement(div).not.toBePressed(),
    ).toThrowErrorMatchingSnapshot();
  });
});
