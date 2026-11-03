import { complianceTargetSchema } from "@schema-benchmarks/json-schema-tests/types";
import { complianceTypeSchema } from "@schema-benchmarks/schemas";

import { createTest, expect } from "#e2e/fixtures";
import * as helpers from "#e2e/helpers";

import { CompliancePage } from "./$tab.e2e.model";
import { complianceTypeLabels } from "./-constants";

const test = createTest({ compliancePage: CompliancePage });

test.beforeEach(async ({ compliancePage, fontsLoaded }) => {
  await compliancePage.goto();

  await fontsLoaded();
});

async function expectDetailsDialogToBeOpen(
  compliancePage: CompliancePage,
  libraryName: string | RegExp,
) {
  await expect(compliancePage.details.dialog).toBeVisible();

  await expect(
    compliancePage.details.dialog.getByRole("heading", { name: libraryName }),
  ).toBeVisible();

  const additionalPropertiesResult = compliancePage.details.dialog.getByRole("listitem").filter({
    hasText: /additionalProperties/,
  });

  await expect(additionalPropertiesResult).toBeHidden();

  await compliancePage.details.dialog.getByText("Specification coverage").click();

  await expect(additionalPropertiesResult).toBeVisible();

  await compliancePage.details.close();

  await expect(compliancePage.details.dialog).toBeHidden();
}

test("can toggle targets", { timeout: 90_000 }, async ({ page, compliancePage }) => {
  for (const target of complianceTargetSchema.options) {
    const link = compliancePage.getTargetLink(target);

    await link.click();

    await expect(page).toHaveURL((url) => url.searchParams.get("target") === target, {
      timeout: 30_000,
    });

    await expect(link).toBeCurrent("page", { timeout: 30_000 });
  }
});

for (const complianceType of complianceTypeSchema.options) {
  test.describe(`${complianceTypeLabels[complianceType].label} tab`, () => {
    test.beforeEach(async ({ compliancePage, fontsLoaded }) => {
      await compliancePage[complianceType].select();

      await fontsLoaded();
    });

    test.describe("Desktop view", { tags: ["desktop"] }, () => {
      test.beforeEach(async ({ compliancePage }) => {
        await compliancePage[complianceType].desktop.tableHandle.init();
      });

      test("can be sorted by column", async ({ compliancePage }) => {
        const tab = compliancePage[complianceType];
        await helpers.desktop.expectTableSorting(tab.desktop.tableHandle, {
          first: tab.libraries.first,
          last: tab.libraries.last,
        });
      });

      test("can open details dialog", async ({ compliancePage }) => {
        const tab = compliancePage[complianceType];
        const { tableHandle } = tab.desktop;

        await expect(compliancePage.details.dialog).toBeHidden();

        const firstRow = tableHandle.getRowByIndex(0);
        const libraryName = await firstRow.getCell("library").innerText();
        await firstRow.getByRole("link", { name: "Open details" }).click();

        await expectDetailsDialogToBeOpen(compliancePage, libraryName);
      });
    });

    test.describe("Mobile view", { tags: ["mobile"] }, () => {
      test("can open details dialog", async ({ compliancePage }) => {
        const tab = compliancePage[complianceType];
        const listItem = tab.mobile.getListItem(tab.libraries.first).first();

        await expect(compliancePage.details.dialog).toBeHidden();

        await listItem.getByRole("link").click();

        await expectDetailsDialogToBeOpen(compliancePage, tab.libraries.first);
      });
    });
  });
}
