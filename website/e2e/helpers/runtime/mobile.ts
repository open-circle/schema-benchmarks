import { expect } from "#e2e/fixtures";
import type { RuntimePage } from "#e2e/fixtures/pages/_runtime";
import { library as ioTs } from "#e2e/utils/constants";

export async function testCardDisplay(runtimePage: RuntimePage, library = ioTs) {
  const card = runtimePage.mobile.getCardByLibraryName(library.name).first();
  await card.scrollIntoViewIfNeeded();

  const versionEl = card.getByText(library.version);
  await expect(versionEl).toBeVisible();
}
