import { errorTypeSchema, optimizeTypeSchema } from "@schema-benchmarks/schemas";
import { every } from "mix-n-matchers/utilities";

import { test, expect } from "#e2e/fixtures";
import type {
  RuntimePage,
  MixinInstanceType,
  withErrorTypeFilter,
} from "#e2e/fixtures/pages/_runtime";
import { ioTs } from "#e2e/utils/libraries";

export async function expectCardDisplay(runtimePage: RuntimePage, library = ioTs) {
  await test.step(`Verify ${library.name} is shown in the mobile cards`, async () => {
    const card = runtimePage.mobile.getCardByLibraryName(library.name).first();
    await card.scrollIntoViewIfNeeded();

    const versionEl = card.getByText(library.version);
    await expect(versionEl).toBeVisible();
  });
}

async function expectFilterCards(runtimePage: RuntimePage, expectedLabel: string) {
  const expectedLabelRegex = new RegExp(expectedLabel, "i");

  await expect(async () => {
    const chips = runtimePage.mobile.cards.getByTestId("bench-card-chips");
    const labels = await chips.allTextContents();

    every(labels, (label) => {
      expect(label).toMatch(expectedLabelRegex);
    });
  }).toPass();
}

export async function expectOptimizeFilter(runtimePage: RuntimePage) {
  for (const optimizeType of optimizeTypeSchema.options) {
    await test.step(`Filter mobile cards by ${runtimePage.getOptimizeTypeLabel(optimizeType)} optimization`, async () => {
      await runtimePage.selectOptimizeType(optimizeType);
      await expectFilterCards(runtimePage, runtimePage.getOptimizeTypeLabel(optimizeType));
    });
  }
}

export async function expectErrorTypeFilter(
  runtimePage: MixinInstanceType<typeof withErrorTypeFilter>,
) {
  for (const errorType of errorTypeSchema.options) {
    await test.step(`Filter mobile cards by ${runtimePage.getErrorTypeLabel(errorType)} errors`, async () => {
      await runtimePage.selectErrorType(errorType);
      await expectFilterCards(runtimePage, runtimePage.getErrorTypeLabel(errorType));
    });
  }
}
