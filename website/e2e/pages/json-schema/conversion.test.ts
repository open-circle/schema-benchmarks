import { jsonSchemaTargetSchema, jsonSchemaDirectionSchema } from "@schema-benchmarks/schemas";

import { test, expect } from "#e2e/fixtures";

test.beforeEach(
  "Go to JSON schema conversion page",
  async ({ page, jsonSchemaConversionPage, fontsLoaded }) => {
    await jsonSchemaConversionPage.goto();

    await fontsLoaded();

    await expect(page).toHaveTitle(/JSON Schema Conversion/);
  },
);

test("can toggle targets", async ({ page, jsonSchemaConversionPage }) => {
  for (const target of jsonSchemaTargetSchema.options) {
    const link = jsonSchemaConversionPage.getTargetLink(target);

    await link.click();

    await expect(link).toHaveAttribute("aria-current", "page");

    await expect(page).toHaveURL((url) => url.searchParams.get("target") === target);
  }
});

test("can filter by direction", async ({ page, matchBreakpoints, jsonSchemaConversionPage }) => {
  const isDesktop = await matchBreakpoints(jsonSchemaConversionPage.breakpoints.desktop);
  for (const direction of jsonSchemaDirectionSchema.options) {
    const link = jsonSchemaConversionPage.getDirectionLink(direction);

    await link.click();

    await expect(link).toHaveAttribute("aria-current", "page");

    await expect(page).toHaveURL((url) => url.searchParams.get("direction") === direction);

    // oxlint-disable-next-line playwright/no-conditional-in-test
    if (isDesktop) {
      for await (const { row } of jsonSchemaConversionPage.desktop.tableHandle) {
        const directionCell = row.getCell("type");
        // oxlint-disable-next-line playwright/no-conditional-expect
        await expect(directionCell).toHaveText(
          jsonSchemaConversionPage.getDirectionLabel(direction),
        );
      }
    } else {
      const cards = await jsonSchemaConversionPage.mobile.cards.all();
      for (const card of cards) {
        const chipsList = card.getByTestId("bench-card-chips");

        const chips = chipsList.getByRole("listitem");

        // oxlint-disable-next-line playwright/no-conditional-expect
        await expect(
          chips.filter({
            hasText: jsonSchemaConversionPage.getDirectionLabel(direction),
          }),
        ).toHaveCount(1);
      }
    }
  }
});

test.describe("desktop view", () => {
  test.beforeEach("check desktop view", async ({ matchBreakpoints, jsonSchemaConversionPage }) => {
    const isDesktop = await matchBreakpoints(jsonSchemaConversionPage.breakpoints.desktop);
    test.skip(!isDesktop, "This test is only for desktop viewports");

    await jsonSchemaConversionPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ jsonSchemaConversionPage }) => {
    await expect(jsonSchemaConversionPage.desktop.table).toBeVisible();

    const ajvRow = jsonSchemaConversionPage.desktop.tableHandle.getRow({ library: "ajv" });

    await expect(ajvRow.getCell("version")).toHaveText(/^\d+\.\d+\.\d+$/);
  });

  test("table can be sorted by column", async ({ jsonSchemaConversionPage }) => {
    const libraryHeaderCell =
      await jsonSchemaConversionPage.desktop.tableHandle.getHeaderCell("library");
    const librarySortLink = libraryHeaderCell.getByRole("link");

    await librarySortLink.click();

    await expect(libraryHeaderCell).toHaveAttribute("aria-sort", "ascending");

    const firstRow = jsonSchemaConversionPage.desktop.tableHandle.getRowByIndex(0);
    const firstRowLibraryCell = firstRow.getCell("library");

    await expect(firstRowLibraryCell).toHaveText(/ajv/i);

    await expect(async () => {
      await librarySortLink.click();

      await expect(libraryHeaderCell).toHaveAttribute("aria-sort", "descending");
    }).toPass();

    await expect(firstRowLibraryCell).toHaveText(/zod/i);
  });
});

test.describe("mobile view", () => {
  test.beforeEach("check mobile view", async ({ matchBreakpoints, jsonSchemaConversionPage }) => {
    const isDesktop = await matchBreakpoints(jsonSchemaConversionPage.breakpoints.desktop);
    test.skip(isDesktop, "This test is only for mobile viewports");
  });

  test("it displays results cards", async ({ jsonSchemaConversionPage }) => {
    const card = jsonSchemaConversionPage.mobile.getCardByLibraryName("ajv");

    await card.scrollIntoViewIfNeeded();

    await expect(card).toBeVisible();

    const versionEl = card.getByText(/\d+\.\d+\.\d+/);

    await expect(versionEl).toBeVisible();
  });
});
