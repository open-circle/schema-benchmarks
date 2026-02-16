import { describe, expect } from "vitest";
import { type Locator, page } from "vitest/browser";
import { it } from "#test/browser/fixtures";
import { alignedAnsiStyleSerializer } from "./utils";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

describe.each(["locator", "element"] as const)("toBeCurrent (with %s)", (type) => {
  function expectElement(locator: Locator) {
    return expect(type === "locator" ? locator : locator.element());
  }
  it("should pass for current element", async () => {
    await page.render(
      <a href="/about" aria-current="page">
        About
      </a>,
    );
    const link = page.getByRole("link", { name: "About" });
    expectElement(link).toBeCurrent("page");
  });
  it("should pass for current element without value", async () => {
    await page.render(
      <a href="/about" aria-current>
        About
      </a>,
    );
    const link = page.getByRole("link", { name: "About" });
    expectElement(link).toBeCurrent();
  });
  it("should fail for element without aria-current", async () => {
    await page.render(<a href="/about">About</a>);
    const link = page.getByRole("link", { name: "About" });
    expectElement(link).not.toBeCurrent();
    expect(() => expectElement(link).toBeCurrent()).toThrowErrorMatchingSnapshot();
  });
  it("should fail for element with wrong aria-current value", async () => {
    await page.render(
      <a href="/about" aria-current="step">
        About
      </a>,
    );
    const link = page.getByRole("link", { name: "About" });
    expectElement(link).not.toBeCurrent("page");
    expect(() => expectElement(link).toBeCurrent("page")).toThrowErrorMatchingSnapshot();
  });
});
