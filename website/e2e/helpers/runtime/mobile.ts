import { expect } from "#e2e/fixtures";
import type { RuntimePage } from "#e2e/fixtures/pages/_runtime";
import { ioTs } from "#e2e/utils/libraries";

export async function testCardDisplay(runtimePage: RuntimePage, library = ioTs) {
  const card = runtimePage.mobile.getCardByLibraryName(library.name).first();
  await card.scrollIntoViewIfNeeded();

  const versionEl = card.getByText(library.version);
  await expect(versionEl).toBeVisible();
}
