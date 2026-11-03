import { chromium } from "playwright";
import { test } from "vite-plus/test";

import { expect } from "./expect";

test("Playwright assertions retry and support custom matchers under Vitest", async () => {
  const browser = await chromium.launch({ channel: "chromium" });
  try {
    const page = await browser.newPage();
    await page.setContent('<button aria-pressed="false">Toggle</button>');
    const button = page.getByRole("button", { name: "Toggle" });
    await expect(button).not.toBePressed();
    await page.evaluate(() => {
      setTimeout(() => {
        document.querySelector("button")?.setAttribute("aria-pressed", "true");
        document.title = "Ready";
      }, 50);
    });
    await expect(button).toBePressed();
    await expect(page).toHaveTitle("Ready");
    await expect(page).toHaveURL("about:blank", { timeout: 15_000 });
    await expect(async () => {
      await expect(button).toHaveText("Toggle");
    }).toPass({ timeout: 1_000 });
  } finally {
    await browser.close();
  }
});
