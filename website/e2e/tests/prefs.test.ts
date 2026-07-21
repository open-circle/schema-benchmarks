import {
  styleSchema,
  themeSchema,
  npmSiteSchema,
  ligatureSchema,
} from "#/shared/lib/prefs/constants";
import { test, expect } from "#e2e/fixtures";

test("dialog opens", async ({ page, prefs }) => {
  await page.goto("/");

  await prefs.openDialog();

  await expect(prefs.dialog).toBeVisible();
});

test.describe("dialog closes", () => {
  test("by clicking the backdrop", async ({ page, prefs }) => {
    await page.goto("/");

    await prefs.openDialog();

    await page.mouse.click(0, 0);

    await expect(prefs.dialog).not.toBeVisible();
  });
  test("by pressing the escape key", async ({ page, prefs }) => {
    await page.goto("/");

    await prefs.openDialog();

    await expect(async () => {
      await prefs.dialog.press("Escape");

      await expect(prefs.dialog).not.toBeVisible();
    }).toPass();
  });
});

test("it can pick style options", async ({ page, prefs }) => {
  await page.goto("/");

  await prefs.openDialog();

  for (const option of styleSchema.options) {
    const button = await prefs.getStyleOption(option);
    await button.click();
    await expect(button).toBePressed();
  }
});

test("it can pick theme options", async ({ page, prefs }) => {
  await page.goto("/");

  await prefs.openDialog();

  for (const option of themeSchema.options) {
    const button = await prefs.getThemeOption(option);
    await button.click();
    await expect(button).toBePressed();
  }
});

test("it can pick npm site options", async ({ page, prefs }) => {
  await page.goto("/");

  await prefs.openDialog();

  for (const option of npmSiteSchema.options) {
    const button = await prefs.getNpmSiteOption(option);
    await button.click();
    await expect(button).toBePressed();
  }
});

test("it can pick ligature options", async ({ page, prefs }) => {
  await page.goto("/");

  await prefs.openDialog();

  for (const option of ligatureSchema.options) {
    const button = await prefs.getLigatureOption(option);
    await button.click();
    await expect(button).toBePressed();
  }
});
