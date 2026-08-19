import { complianceTargetSchema } from "@schema-benchmarks/json-schema-tests/types";
import { complianceTypeSchema } from "@schema-benchmarks/schemas";

import { test, expect } from "#e2e/fixtures";
import type { CompliancePage } from "#e2e/fixtures/pages/json-schema/compliance.ts";
import { complianceTypeLabels } from "#src/routes/json-schema/compliance/-constants";

test.beforeEach(
  "Go to JSON schema compliance page",
  async ({ page, compliancePage, fontsLoaded }) => {
    await compliancePage.goto();

    await fontsLoaded();

    await expect(page).toHaveTitle(/Compliance/);
  },
);

async function expectDetailsDialogToBeOpen(
  compliancePage: CompliancePage,
  libraryName: string | RegExp,
) {
  await test.step("Verify dialog heading", async () => {
    await expect(compliancePage.details.dialog).toBeVisible();

    await expect(
      compliancePage.details.dialog.getByRole("heading", { name: libraryName }),
    ).toBeVisible();
  });

  await test.step("Expand specification coverage", async () => {
    const additionalPropertiesResult = compliancePage.details.dialog.getByRole("listitem").filter({
      hasText: /additionalProperties/,
    });

    await expect(additionalPropertiesResult).toBeHidden();

    await compliancePage.details.dialog.getByText("Specification coverage").click();

    await expect(additionalPropertiesResult).toBeVisible();
  });

  await test.step("Close the details dialog", async () => {
    await compliancePage.details.close();

    await expect(compliancePage.details.dialog).toBeHidden();
  });
}

test("can toggle targets", async ({ page, compliancePage }) => {
  for (const target of complianceTargetSchema.options) {
    await test.step(`Select ${compliancePage.getTargetLabel(target)} target`, async () => {
      const link = compliancePage.getTargetLink(target);

      await expect(async () => {
        await link.click();

        await expect(link).toBeCurrent("page");

        await expect(page).toHaveURL((url) => url.searchParams.get("target") === target);
      }).toPass();
    });
  }
});

for (const complianceType of complianceTypeSchema.options) {
  test.describe(`${complianceTypeLabels[complianceType].label} tab`, () => {
    test.beforeEach("switch to tab", async ({ page, compliancePage, fontsLoaded }) => {
      await compliancePage[complianceType].select();

      await fontsLoaded();

      await expect(page).toHaveTitle(/Compliance/);
    });

    test.describe("Desktop view", () => {
      test.beforeEach(async ({ matchBreakpoints, compliancePage }) => {
        const isDesktop = await matchBreakpoints(compliancePage.breakpoints.desktop);
        test.skip(!isDesktop, "This test is only for desktop viewports");

        await compliancePage[complianceType].desktop.tableHandle.init();
      });

      test("can be sorted by column", async ({ compliancePage }) => {
        const tab = compliancePage[complianceType];
        const { tableHandle } = tab.desktop;

        const libraryHeaderCell = await tableHandle.getHeaderCell("library");
        const librarySortLink = libraryHeaderCell.getByRole("link");

        const firstRow = tableHandle.getRowByIndex(0);
        const firstRowLibraryCell = firstRow.getCell("library");

        await test.step("Sort libraries ascending", async () => {
          await librarySortLink.click();

          await expect(libraryHeaderCell).toHaveSort("ascending");

          await expect(firstRowLibraryCell).toHaveText(tab.libraries.first);
        });

        await test.step("Sort libraries descending", async () => {
          await librarySortLink.click();

          await expect(libraryHeaderCell).toHaveSort("descending");

          await expect(firstRowLibraryCell).toHaveText(tab.libraries.last);
        });
      });

      test("can open details dialog", async ({ compliancePage }) => {
        const tab = compliancePage[complianceType];
        const { tableHandle } = tab.desktop;

        await expect(compliancePage.details.dialog).toBeHidden();

        const libraryName = await test.step("Open details for the first library", async () => {
          const firstRow = tableHandle.getRowByIndex(0);
          const libraryName = await firstRow.getCell("library").innerText();
          await firstRow.getByRole("link", { name: "Open details" }).click();

          return libraryName;
        });

        await expectDetailsDialogToBeOpen(compliancePage, libraryName);
      });
    });

    test.describe("Mobile view", () => {
      test.beforeEach(async ({ matchBreakpoints, compliancePage }) => {
        const isDesktop = await matchBreakpoints(compliancePage.breakpoints.desktop);
        test.skip(isDesktop, "This test is only for mobile viewports");
      });

      test("can open details dialog", async ({ compliancePage }) => {
        const tab = compliancePage[complianceType];
        const listItem = tab.mobile.getListItem(tab.libraries.first).first();

        await expect(compliancePage.details.dialog).toBeHidden();

        await test.step("Open details from the first library card", async () => {
          await listItem.getByRole("link").click();
        });

        await expectDetailsDialogToBeOpen(compliancePage, tab.libraries.first);
      });
    });
  });
}
