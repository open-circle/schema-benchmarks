import type { JsonSchemaDirection } from "@schema-benchmarks/schemas";
import { jsonSchemaTargetSchema, jsonSchemaDirectionSchema } from "@schema-benchmarks/schemas";
import { every, everyAsync } from "mix-n-matchers/utilities";

import { test, expect } from "#e2e/fixtures";
import type { ToJsonPage } from "#e2e/fixtures/pages/json-schema/to-json";

async function expectResultsToMatchDirection(
  toJsonPage: ToJsonPage,
  direction: JsonSchemaDirection,
  isDesktop: boolean,
) {
  const expectedDirection = toJsonPage.getDirectionLabel(direction);
  if (isDesktop) {
    await expect(async () => {
      await everyAsync(toJsonPage.desktop.tableHandle, async ({ row }) => {
        await expect(row.getCell("type")).toHaveText(expectedDirection);
      });
    }).toPass();
  } else {
    const expectedDirectionRegex = new RegExp(expectedDirection, "i");
    await expect(async () => {
      const chips = toJsonPage.mobile.cards.getByTestId("bench-card-chips");
      const labels = await chips.allTextContents();

      every(labels, (label) => {
        expect(label).toMatch(expectedDirectionRegex);
      });
    }).toPass();
  }
}

test.beforeEach("Go to JSON schema to-json page", async ({ page, toJsonPage, fontsLoaded }) => {
  await toJsonPage.goto();

  await fontsLoaded();

  await expect(page).toHaveTitle(/Schema to JSON Schema/);
});

test.describe("support matrix tab", () => {
  test.beforeEach("switch to support matrix tab", async ({ page, toJsonPage }) => {
    const supportMatrixTabLink = toJsonPage.getTabLink("Support Matrix");

    await supportMatrixTabLink.click();

    await expect(supportMatrixTabLink).toBeCurrent("page");

    await expect(page).toHaveURL((url) => url.searchParams.get("tab") === "matrix");
  });

  test.describe("desktop view", () => {
    test.beforeEach("check desktop view", async ({ matchBreakpoints, toJsonPage }) => {
      const isDesktop = await matchBreakpoints(toJsonPage.breakpoints.desktop);
      test.skip(!isDesktop, "This test is only for desktop viewports");
    });

    test("it displays support matrix table", async ({ toJsonPage }) => {
      await expect(toJsonPage.desktop.supportMatrixTable).toBeVisible();
      await expect(toJsonPage.desktop.getSupportMatrixTargetHeader("draft-2020-12")).toBeVisible();
    });
  });

  test.describe("mobile view", () => {
    test.beforeEach("check mobile view", async ({ matchBreakpoints, toJsonPage }) => {
      const isDesktop = await matchBreakpoints(toJsonPage.breakpoints.desktop);
      test.skip(isDesktop, "This test is only for mobile viewports");
    });

    test("it displays support matrix cards", async ({ toJsonPage }) => {
      const card = toJsonPage.mobile.getSupportMatrixCardByLibraryName("arktype");

      await card.scrollIntoViewIfNeeded();

      await expect(card).toBeVisible();
      await expect(card.getByText(/^\d+\.\d+\.\d+$/)).toBeVisible();
    });
  });
});

test.describe("benchmarks tab", () => {
  test.beforeEach("switch to benchmarks tab", async ({ page, toJsonPage }) => {
    const benchmarksTabLink = toJsonPage.getTabLink("Benchmarks");

    await benchmarksTabLink.click();

    await expect(benchmarksTabLink).toBeCurrent("page");

    await expect(page).toHaveURL((url) => url.searchParams.get("tab") === "bench");
  });

  test("can toggle targets", async ({ page, toJsonPage }) => {
    for (const target of jsonSchemaTargetSchema.options) {
      const link = toJsonPage.getTargetLink(target);

      await link.click();

      await expect(link).toBeCurrent("page");

      await expect(page).toHaveURL((url) => url.searchParams.get("target") === target);
    }
  });

  test("can filter by direction", async ({ page, matchBreakpoints, toJsonPage }) => {
    const isDesktop = await matchBreakpoints(toJsonPage.breakpoints.desktop);
    for (const direction of jsonSchemaDirectionSchema.options) {
      const link = toJsonPage.getDirectionLink(direction);

      await link.click();

      await expect(link).toBeCurrent("page");

      await expect(page).toHaveURL((url) => url.searchParams.get("direction") === direction);

      await expectResultsToMatchDirection(toJsonPage, direction, isDesktop);
    }
  });

  test.describe("desktop view", () => {
    test.beforeEach("check desktop view", async ({ matchBreakpoints, toJsonPage }) => {
      const isDesktop = await matchBreakpoints(toJsonPage.breakpoints.desktop);
      test.skip(!isDesktop, "This test is only for desktop viewports");

      await toJsonPage.desktop.tableHandle.init();
    });

    test("it displays results table", async ({ toJsonPage }) => {
      await expect(toJsonPage.desktop.table).toBeVisible();

      const zodRow = toJsonPage.desktop.tableHandle.getRow({ library: "zod" });

      await expect(zodRow.getCell("version")).toHaveText(/^\d+\.\d+\.\d+$/);
    });

    test("table can be sorted by column", async ({ toJsonPage }) => {
      const libraryHeaderCell = await toJsonPage.desktop.tableHandle.getHeaderCell("library");
      const librarySortLink = libraryHeaderCell.getByRole("link");

      await librarySortLink.click();

      await expect(libraryHeaderCell).toHaveAttribute("aria-sort", "ascending");

      const firstRow = toJsonPage.desktop.tableHandle.getRowByIndex(0);
      const firstRowLibraryCell = firstRow.getCell("library");

      await expect(firstRowLibraryCell).toHaveText(/arktype/i);

      await expect(async () => {
        await librarySortLink.click();

        await expect(libraryHeaderCell).toHaveAttribute("aria-sort", "descending");
      }).toPass();

      await expect(firstRowLibraryCell).toHaveText(/zod/i);
    });
  });

  test.describe("mobile view", () => {
    test.beforeEach("check mobile view", async ({ matchBreakpoints, toJsonPage }) => {
      const isDesktop = await matchBreakpoints(toJsonPage.breakpoints.desktop);
      test.skip(isDesktop, "This test is only for mobile viewports");
    });

    test("it displays results cards", async ({ toJsonPage }) => {
      const card = toJsonPage.mobile.getCardByLibraryName("zod").first();

      await expect(card).toBeVisible();

      const versionEl = card.getByText(/\d+\.\d+\.\d+/);

      await expect(versionEl).toBeVisible();
    });
  });
});
