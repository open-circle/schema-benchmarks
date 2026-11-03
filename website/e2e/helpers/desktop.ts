import type { TableResult } from "@rickcedwhat/playwright-smart-table";

import { expect } from "#e2e/fixtures/expect";

export async function expectTableSorting(
  tableHandle: TableResult,
  patterns: { first: string | RegExp; last: string | RegExp },
) {
  const libraryHeaderCell = await tableHandle.getHeaderCell("library");
  const librarySortLink = libraryHeaderCell.getByRole("link");

  const firstRow = tableHandle.getRowByIndex(0);
  const firstRowLibraryCell = firstRow.getCell("library");

  await librarySortLink.click();

  await expect(libraryHeaderCell).toHaveSort("ascending");

  await expect(firstRowLibraryCell).toHaveText(patterns.first);

  await expect(async () => {
    if ((await libraryHeaderCell.getAttribute("aria-sort")) !== "descending") {
      await librarySortLink.click();
    }

    await expect(libraryHeaderCell).toHaveSort("descending", { timeout: 500 });
  }).toPass({ timeout: 5_000 });
  await expect(firstRowLibraryCell).toHaveText(patterns.last);
}
