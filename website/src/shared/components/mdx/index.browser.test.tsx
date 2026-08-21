import { describe, expect, it } from "vitest";
import { page } from "vitest/browser";

import * as mdx from ".";

describe("mdx", () => {
  describe("pre", () => {
    it("allows copying to clipboard", async () => {
      await page.render(
        <mdx.pre>
          <mdx.code>console.log("Hello, world!");</mdx.code>
        </mdx.pre>,
      );
      const button = page.getByRole("button", { name: "Copy to clipboard" });
      await button.click();
      await expect(navigator.clipboard.readText()).resolves.toBe('console.log("Hello, world!");');
    });
  });
  describe("a", () => {
    it("adds tracking props to external links", async () => {
      await page.render(<mdx.a href="https://example.com">External link</mdx.a>);
      const link = page.getByRole("link", { name: "External link" });
      await expect.element(link).toHaveAttribute("data-umami-event", "external_link_click");
      await expect.element(link).toHaveAttribute("data-umami-event-url", "https://example.com");
    });
    it("does not add tracking props to internal links", async () => {
      await page.render(<mdx.a href="/internal">Internal link</mdx.a>);
      const link = page.getByRole("link", { name: "Internal link" });
      await expect.element(link).not.toHaveAttribute("data-umami-event");
      await expect.element(link).not.toHaveAttribute("data-umami-event-url");
    });
  });
});
