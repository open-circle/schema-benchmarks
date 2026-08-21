import { createTest, expect } from "#e2e/fixtures";
import { PrefsDialog } from "#e2e/fixtures/components/prefs.ts";
import {
  styleSchema,
  themeSchema,
  npmSiteSchema,
  ligatureSchema,
} from "#src/shared/lib/prefs/constants";

const test = createTest({ prefs: PrefsDialog });

test.beforeEach("Go to homepage", async ({ page, fontsLoaded }) => {
  await page.goto("/");

  await fontsLoaded();
});

test("dialog opens", { tag: "@smoke" }, async ({ prefs }) => {
  await prefs.openDialog();

  await expect(prefs.dialog).toBeVisible();
});

test.describe("dialog closes", () => {
  test("by clicking the backdrop", async ({ page, prefs }) => {
    await prefs.openDialog();

    await page.mouse.click(0, 0);

    await expect(prefs.dialog).toBeHidden();
  });

  test("by pressing the escape key", async ({ prefs }) => {
    await prefs.openDialog();

    await expect(async () => {
      await prefs.dialog.press("Escape");

      await expect(prefs.dialog).toBeHidden();
    }).toPass();
  });
});

test("it can pick style options, persisting after refresh", async ({ page, prefs }) => {
  await prefs.openDialog();

  for (const option of styleSchema.options) {
    await test.step(`Pick ${option} style`, async () => {
      const button = await prefs.getStyleOption(option);
      await button.click();
      await expect(button).toBePressed();

      await expect(prefs.documentElement).toHaveAttribute("data-style", option);

      await page.reload();

      await prefs.openDialog();

      await expect(button).toBePressed();

      await expect(prefs.documentElement).toHaveAttribute("data-style", option);
    });
  }
});

test("it can pick theme options, persisting after refresh", async ({ page, prefs }) => {
  await prefs.openDialog();

  for (const option of themeSchema.options) {
    await test.step(`Pick ${option} theme`, async () => {
      const button = await prefs.getThemeOption(option);
      await button.click();

      await expect(button).toBePressed();

      await expect(prefs.documentElement).toHaveAttribute("data-theme", option);

      await page.reload();

      await prefs.openDialog();

      await expect(button).toBePressed();

      await expect(prefs.documentElement).toHaveAttribute("data-theme", option);
    });
  }
});

test("it can pick npm site options, persisting after refresh", async ({ page, prefs }) => {
  const downloadCount = page.getByRole("link", { name: "Download count for ajv:" }).first();

  for (const option of npmSiteSchema.options) {
    await test.step(`Pick ${option} npm link target`, async () => {
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
    });
  }
});

test("it can pick ligature options, persisting after refresh", async ({ page, prefs }) => {
  await prefs.openDialog();

  for (const option of ligatureSchema.options) {
    await test.step(`Pick ${option} ligature option`, async () => {
      const button = await prefs.getLigatureOption(option);
      await button.click();

      await expect(button).toBePressed();

      await expect(prefs.documentElement).toHaveAttribute("data-liga", option);

      await page.reload();

      await prefs.openDialog();

      await expect(button).toBePressed();

      await expect(prefs.documentElement).toHaveAttribute("data-liga", option);
    });
  }
});
