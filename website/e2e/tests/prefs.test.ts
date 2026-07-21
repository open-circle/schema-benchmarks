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

test("it can pick style options, persisting after refresh", async ({ page, prefs }) => {
  await page.goto("/");

  await prefs.openDialog();

  for (const option of styleSchema.options) {
    const button = await prefs.getStyleOption(option);
    await button.click();
    await expect(button).toBePressed();

    await expect(prefs.documentElement).toHaveAttribute("data-style", option);

    await page.reload();

    await prefs.openDialog();

    await expect(button).toBePressed();

    await expect(prefs.documentElement).toHaveAttribute("data-style", option);
  }
});

test("it can pick theme options, persisting after refresh", async ({ page, prefs }) => {
  await page.goto("/");

  await prefs.openDialog();

  for (const option of themeSchema.options) {
    const button = await prefs.getThemeOption(option);
    await button.click();

    await expect(button).toBePressed();

    await expect(prefs.documentElement).toHaveAttribute("data-theme", option);

    await page.reload();

    await prefs.openDialog();

    await expect(button).toBePressed();

    await expect(prefs.documentElement).toHaveAttribute("data-theme", option);
  }
});

test("it can pick npm site options, persisting after refresh", async ({ page, prefs }) => {
  await page.goto("/");

  const downloadCount = page.getByRole("link", { name: "Download count for ajv:" }).first();

  for (const option of npmSiteSchema.options) {
    await prefs.openDialog();

    const button = await prefs.getNpmSiteOption(option);

    await button.click();

    await expect(button).toBePressed();

    await page.goto("/libraries");

    await downloadCount.scrollIntoViewIfNeeded({ timeout: 1000 });

    await expect(downloadCount).toBeVisible();

    await expect(downloadCount).toHaveAttribute("href", `https://www.${option}/package/ajv`);

    await page.reload();

    await prefs.openDialog();

    await expect(button).toBePressed();

    await page.goto("/libraries");

    await downloadCount.scrollIntoViewIfNeeded({ timeout: 1000 });

    await expect(downloadCount).toBeVisible();

    await expect(downloadCount).toHaveAttribute("href", `https://www.${option}/package/ajv`);
  }
});

test("it can pick ligature options, persisting after refresh", async ({ page, prefs }) => {
  await page.goto("/");

  await prefs.openDialog();

  for (const option of ligatureSchema.options) {
    const button = await prefs.getLigatureOption(option);
    await button.click();

    await expect(button).toBePressed();

    await expect(prefs.documentElement).toHaveAttribute("data-liga", option);

    await page.reload();

    await prefs.openDialog();

    await expect(button).toBePressed();

    await expect(prefs.documentElement).toHaveAttribute("data-liga", option);
  }
});
