import {
  jsonSchemaConversionTargetSchema,
  jsonSchemaDirectionSchema,
} from "@schema-benchmarks/schemas";
import { every, everyAsync } from "mix-n-matchers/utilities";

import { test, expect } from "#e2e/fixtures";

test.beforeEach("Go to JSON schema to-json page", async ({ toJsonPage, fontsLoaded }) => {
  await toJsonPage.goto();

  await fontsLoaded();
});

test.describe("support matrix tab", () => {
  test.beforeEach("switch to support matrix tab", async ({ page, toJsonPage }) => {
    await toJsonPage.supportMatrix.select();

    await expect(toJsonPage.supportMatrix.tabLink).toBeCurrent("page");

    await expect(page).toHaveURL((url) => toJsonPage.supportMatrix.matchesUrl(url));
  });

  test.describe("desktop view", { tag: "@desktop" }, () => {
    test("it displays support matrix table", async ({ toJsonPage }) => {
      await expect(toJsonPage.supportMatrix.desktop.supportMatrixTable).toBeVisible();
      await expect(
        toJsonPage.supportMatrix.desktop.getSupportMatrixTargetHeader("draft-2020-12"),
      ).toBeVisible();
    });
  });

  test.describe("mobile view", { tag: "@mobile" }, () => {
    test("it displays support matrix cards", async ({ toJsonPage }) => {
      const card = toJsonPage.supportMatrix.mobile.getSupportMatrixCardByLibraryName("arktype");

      await card.scrollIntoViewIfNeeded();

      await expect(card).toBeVisible();
      await expect(card.getByText(/^\d+\.\d+\.\d+$/)).toBeVisible();
    });
  });
});

test.describe("benchmarks tab", () => {
  test.beforeEach("switch to benchmarks tab", async ({ page, toJsonPage }) => {
    await toJsonPage.benchmarks.select();

    await expect(toJsonPage.benchmarks.tabLink).toBeCurrent("page");

    await expect(page).toHaveURL((url) => toJsonPage.benchmarks.matchesUrl(url));
  });

  test("can toggle targets", async ({ page, toJsonPage }) => {
    for (const target of jsonSchemaConversionTargetSchema.options) {
      const link = toJsonPage.benchmarks.getTargetLink(target);

      await expect(async () => {
        await link.click();

        await expect(page).toHaveURL((url) => url.searchParams.get("target") === target);

        await expect(link).toBeCurrent("page");
      }).toPass();
    }
  });

  test.describe("desktop direction filtering", { tag: "@desktop" }, () => {
    test("shows matching table rows", async ({ toJsonPage }) => {
      for (const direction of jsonSchemaDirectionSchema.options) {
        await toJsonPage.benchmarks.selectDirection(direction);

        const expectedDirection = toJsonPage.benchmarks.getDirectionLabel(direction);
        await expect(async () => {
          await everyAsync(toJsonPage.benchmarks.desktop.tableHandle, async ({ row }) => {
            await expect(row.getCell("type")).toHaveText(expectedDirection);
          });
        }).toPass();
      }
    });
  });

  test.describe("mobile direction filtering", { tag: "@mobile" }, () => {
    test("shows matching card chips", async ({ toJsonPage }) => {
      for (const direction of jsonSchemaDirectionSchema.options) {
        await toJsonPage.benchmarks.selectDirection(direction);

        const expectedDirectionRegex = new RegExp(
          toJsonPage.benchmarks.getDirectionLabel(direction),
          "i",
        );
        await expect(async () => {
          const chips = toJsonPage.benchmarks.mobile.cards.getByTestId("bench-card-chips");
          const labels = await chips.allTextContents();

          every(labels, (label) => {
            expect(label).toMatch(expectedDirectionRegex);
          });
        }).toPass();
      }
    });
  });

  test.describe("desktop view", { tag: "@desktop" }, () => {
    test.beforeEach(async ({ toJsonPage }) => {
      await toJsonPage.benchmarks.desktop.tableHandle.init();
    });

    test("it displays results table", async ({ toJsonPage }) => {
      await expect(toJsonPage.benchmarks.desktop.table).toBeVisible();

      const zodRow = toJsonPage.benchmarks.desktop.tableHandle.getRow({ library: "zod" });

      await expect(zodRow.getCell("version")).toHaveText(/^\d+\.\d+\.\d+$/);
    });

    test("table can be sorted by column", async ({ toJsonPage }) => {
      const libraryHeaderCell =
        await toJsonPage.benchmarks.desktop.tableHandle.getHeaderCell("library");
      const librarySortLink = libraryHeaderCell.getByRole("link");

      await librarySortLink.click();

      await expect(libraryHeaderCell).toHaveSort("ascending");

      const firstRow = toJsonPage.benchmarks.desktop.tableHandle.getRowByIndex(0);
      const firstRowLibraryCell = firstRow.getCell("library");

      await expect(firstRowLibraryCell).toHaveText(/arktype/i);

      await expect(async () => {
        await librarySortLink.click();

        await expect(libraryHeaderCell).toHaveSort("descending");
      }).toPass();

      await expect(firstRowLibraryCell).toHaveText(/zod/i);
    });
  });

  test.describe("mobile view", { tag: "@mobile" }, () => {
    test("it displays results cards", async ({ toJsonPage }) => {
      const card = toJsonPage.benchmarks.mobile.getCardByLibraryName("zod").first();

      await expect(card).toBeVisible();

      const versionEl = card.getByText(/\d+\.\d+\.\d+/);

      await expect(versionEl).toBeVisible();
    });
  });
});
