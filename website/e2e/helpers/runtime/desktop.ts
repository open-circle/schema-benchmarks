import { expect } from "#e2e/fixtures";
import type { RuntimePage } from "#e2e/fixtures/pages/_runtime";
import { ioTs } from "#e2e/utils/libraries";

export async function expectTableDisplay(runtimePage: RuntimePage, library = ioTs) {
  await expect(runtimePage.desktop.table).toBeVisible();

  const libraryRow = runtimePage.desktop.tableHandle.getRow({ library: library.name });

  await expect(libraryRow.getCell("version")).toHaveText(library.version);
}

export async function expectTableSorting(
  runtimePage: RuntimePage,
  patterns: { first: RegExp; last: RegExp },
) {
  const libraryHeaderCell = await runtimePage.desktop.tableHandle.getHeaderCell("library");
  const librarySortLink = libraryHeaderCell.getByRole("link");

  await librarySortLink.click();

  await expect(libraryHeaderCell).toHaveAttribute("aria-sort", "ascending");

  const firstRow = runtimePage.desktop.tableHandle.getRowByIndex(0);
  const firstRowLibraryCell = firstRow.getCell("library");

  await expect(firstRowLibraryCell).toHaveText(patterns.first);

  await expect(async () => {
    await librarySortLink.click();

    await expect(libraryHeaderCell).toHaveAttribute("aria-sort", "descending");
  }).toPass();

  await expect(firstRowLibraryCell).toHaveText(patterns.last);
}
