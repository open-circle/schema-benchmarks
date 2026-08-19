import type { Page } from "@playwright/test";
import { dataTypeSchema } from "@schema-benchmarks/bench";

import { test, expect } from "#e2e/fixtures";
import type { MixinInstanceType, withDataToggle } from "#e2e/fixtures/pages/_runtime";

export * as desktop from "./desktop";
export * as mobile from "./mobile";

export async function expectDataTypeToggle(
  page: Page,
  runtimePage: MixinInstanceType<typeof withDataToggle>,
) {
  for (const dataType of dataTypeSchema.options) {
    await test.step(`Select ${dataType} data`, async () => {
      const dataTypeLink = runtimePage.getDataTypeLink(dataType);

      await dataTypeLink.click();

      await expect(page).toHaveURL((url) => url.searchParams.get("dataType") === dataType);

      await expect(dataTypeLink).toBeCurrent("page");
    });
  }
}
