import type { TableResult } from "@rickcedwhat/playwright-smart-table";

import { test, expect } from "#e2e/fixtures";

export async function expectTableSorting(
  tableHandle: TableResult,
  patterns: { first: string | RegExp; last: string | RegExp },
) {
  const libraryHeaderCell = await tableHandle.getHeaderCell("library");
  const librarySortLink = libraryHeaderCell.getByRole("link");

  const firstRow = tableHandle.getRowByIndex(0);
  const firstRowLibraryCell = firstRow.getCell("library");

  await test.step("Sort libraries ascending", async () => {
    await librarySortLink.click();

    await expect(libraryHeaderCell).toHaveSort("ascending");

    await expect(firstRowLibraryCell).toHaveText(patterns.first);
  });

  await test.step("Sort libraries descending", async () => {
    await expect(async () => {
      await librarySortLink.click();

      await expect(libraryHeaderCell).toHaveSort("descending");
    }).toPass();
    await expect(firstRowLibraryCell).toHaveText(patterns.last);
  });
}
