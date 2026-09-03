import { describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";

import { Snackbars } from "#src/shared/components/snackbar";

import * as mdx from ".";

describe("mdx", () => {
  describe("pre", () => {
    it("allows copying to clipboard", async () => {
      await page.render(
        <>
          <Snackbars />
          <mdx.pre>
            <mdx.code>console.log("Hello, world!");</mdx.code>
          </mdx.pre>
        </>,
      );
      const button = page.getByRole("button", { name: /Copy to clipboard/ });
      await button.click();
      await expect(navigator.clipboard.readText()).resolves.toBe('console.log("Hello, world!");');
      await expect.element(page.getByText(/Copied code to clipboard/)).toBeVisible();
    });

    it("shows an error when copying fails", async () => {
      using writeText = vi
        .spyOn(navigator.clipboard, "writeText")
        .mockRejectedValue(new Error("clipboard unavailable"));

      await page.render(
        <>
          <Snackbars />
          <mdx.pre>
            <mdx.code>console.log("Hello, world!");</mdx.code>
          </mdx.pre>
        </>,
      );
      await page.getByRole("button", { name: /Copy to clipboard/ }).click();

      await expect.poll(() => writeText).toHaveBeenCalledOnce();
      await expect.element(page.getByText(/Failed to copy/)).toBeVisible();
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
