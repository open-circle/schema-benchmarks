import { createTest } from "#e2e/fixtures";
import * as helpers from "#e2e/helpers";

import { ParsingPage } from "./index.e2e.model";

const test = createTest({ parsingPage: ParsingPage });

test.beforeEach(async ({ fontsLoaded, parsingPage }) => {
  await parsingPage.goto();

  await fontsLoaded();
});

test("can toggle between valid and invalid results", async ({ page, parsingPage }) => {
  await helpers.runtime.expectDataTypeToggle(page, parsingPage);
});

test.describe("optimization filter", () => {
  test.describe("desktop", { tag: "@desktop" }, () => {
    test("can be filtered by optimization type", async ({ parsingPage }) => {
      await helpers.runtime.desktop.expectOptimizeFilter(parsingPage);
    });
  });

  test.describe("mobile", { tag: "@mobile" }, () => {
    test("can be filtered by optimization type", async ({ parsingPage }) => {
      await helpers.runtime.mobile.expectOptimizeFilter(parsingPage);
    });
  });
});

test.describe("error type filter", () => {
  test.describe("desktop", { tag: "@desktop" }, () => {
    test("can be filtered by error type", async ({ parsingPage }) => {
      await helpers.runtime.desktop.expectErrorTypeFilter(parsingPage);
    });
  });

  test.describe("mobile", { tag: "@mobile" }, () => {
    test("can be filtered by error type", async ({ parsingPage }) => {
      await helpers.runtime.mobile.expectErrorTypeFilter(parsingPage);
    });
  });
});

test.describe("desktop view", { tag: "@desktop" }, () => {
  test.beforeEach(async ({ parsingPage }) => {
    await parsingPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ parsingPage }) => {
    await helpers.runtime.desktop.expectTableDisplay(parsingPage);
  });

  test("table can be sorted by column", async ({ parsingPage }) => {
    await helpers.desktop.expectTableSorting(parsingPage.desktop.tableHandle, {
      first: /@paseri/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", { tag: "@mobile" }, () => {
  test("it displays results list items", async ({ parsingPage }) => {
    await helpers.runtime.mobile.expectListDisplay(parsingPage);
  });
});
