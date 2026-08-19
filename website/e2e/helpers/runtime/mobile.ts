import { test, expect } from "#e2e/fixtures";
import type { RuntimePage } from "#e2e/fixtures/pages/_runtime";
import { ioTs } from "#e2e/utils/libraries";

export async function expectCardDisplay(runtimePage: RuntimePage, library = ioTs) {
  await test.step(`Verify ${library.name} is shown in the mobile cards`, async () => {
    const card = runtimePage.mobile.getCardByLibraryName(library.name).first();
    await card.scrollIntoViewIfNeeded();

    const versionEl = card.getByText(library.version);
    await expect(versionEl).toBeVisible();
  });
}
