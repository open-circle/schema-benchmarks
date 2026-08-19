import { test, expect } from "#e2e/fixtures";
import type { RuntimePage } from "#e2e/fixtures/pages/_runtime";
import { ioTs } from "#e2e/utils/libraries";

export async function expectTableDisplay(runtimePage: RuntimePage, library = ioTs) {
  await test.step(`Verify ${library.name} is shown in the desktop table`, async () => {
    await expect(runtimePage.desktop.table).toBeVisible();

    const libraryRow = runtimePage.desktop.tableHandle.getRow({ library: library.name });

    await expect(libraryRow.getCell("version")).toHaveText(library.version);
  });
}

export async function expectTableSorting(
  runtimePage: RuntimePage,
  patterns: { first: RegExp; last: RegExp },
) {
  const libraryHeaderCell = await runtimePage.desktop.tableHandle.getHeaderCell("library");
  const librarySortLink = libraryHeaderCell.getByRole("link");

  const firstRow = runtimePage.desktop.tableHandle.getRowByIndex(0);
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
