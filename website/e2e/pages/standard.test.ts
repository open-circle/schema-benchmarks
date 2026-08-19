import { test } from "#e2e/fixtures";
import * as runtimeHelpers from "#e2e/helpers/runtime";

const library = {
  name: "yup",
  version: "1.7.1",
};

test.beforeEach(async ({ fontsLoaded, standardSchemaPage }) => {
  await standardSchemaPage.goto();

  await fontsLoaded();
});

test("can toggle between valid and invalid results", async ({ page, standardSchemaPage }) => {
  await runtimeHelpers.expectDataTypeToggle(page, standardSchemaPage);
});

test.describe("optimization filter", () => {
  test.describe("desktop", { tag: "@desktop" }, () => {
    test("can be filtered by optimization type", async ({ standardSchemaPage }) => {
      await runtimeHelpers.desktop.expectOptimizeFilter(standardSchemaPage);
    });
  });

  test.describe("mobile", { tag: "@mobile" }, () => {
    test("can be filtered by optimization type", async ({ standardSchemaPage }) => {
      await runtimeHelpers.mobile.expectOptimizeFilter(standardSchemaPage);
    });
  });
});

test.describe("error type filter", () => {
  test.describe("desktop", { tag: "@desktop" }, () => {
    test("can be filtered by error type", async ({ standardSchemaPage }) => {
      await runtimeHelpers.desktop.expectErrorTypeFilter(standardSchemaPage);
    });
  });

  test.describe("mobile", { tag: "@mobile" }, () => {
    test("can be filtered by error type", async ({ standardSchemaPage }) => {
      await runtimeHelpers.mobile.expectErrorTypeFilter(standardSchemaPage);
    });
  });
});

test.describe("desktop view", { tag: "@desktop" }, () => {
  test.beforeEach(async ({ standardSchemaPage }) => {
    await standardSchemaPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ standardSchemaPage }) => {
    await runtimeHelpers.desktop.expectTableDisplay(standardSchemaPage, library);
  });

  test("table can be sorted by column", async ({ standardSchemaPage }) => {
    await runtimeHelpers.desktop.expectTableSorting(standardSchemaPage, {
      first: /@paseri/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", { tag: "@mobile" }, () => {
  test("it displays results cards", async ({ standardSchemaPage }) => {
    await runtimeHelpers.mobile.expectCardDisplay(standardSchemaPage, library);
  });
});
