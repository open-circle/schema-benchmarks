import {
  jsonSchemaConversionTargetSchema,
  jsonSchemaDirectionSchema,
} from "@schema-benchmarks/schemas";
import { every, everyAsync } from "mix-n-matchers/utilities";

import { createTest, expect } from "#e2e/fixtures";
import * as helpers from "#e2e/helpers";
import { substringToRegex } from "#e2e/utils";
import { libraryVersions } from "#e2e/utils/library-versions.gen";

import { ToJsonPage } from "./$tab.e2e.model";

const test = createTest({ toJsonPage: ToJsonPage });

test.beforeEach("Go to JSON schema to-json page", async ({ toJsonPage, fontsLoaded }) => {
  await toJsonPage.goto();

  await fontsLoaded();
});

test.describe("support matrix tab", () => {
  test.beforeEach("switch to support matrix tab", async ({ page, toJsonPage }) => {
    await toJsonPage.supportMatrix.select();

    await expect(toJsonPage.supportMatrix.tabLink).toBeCurrent("page");

    await expect(page).toHaveURL((url) => toJsonPage.supportMatrix.matchesUrl(url));
  });

  test.describe("desktop view", { tag: "@desktop" }, () => {
    test("it displays support matrix table", async ({ toJsonPage }) => {
      await expect(toJsonPage.supportMatrix.desktop.supportMatrixTable).toBeVisible();
      await expect(
        toJsonPage.supportMatrix.desktop.getSupportMatrixTargetHeader("draft-2020-12"),
      ).toBeVisible();
    });
  });

  test.describe("mobile view", { tag: "@mobile" }, () => {
    test("it displays support matrix list", async ({ toJsonPage }) => {
      const item = toJsonPage.supportMatrix.mobile.getItemByLibraryName("arktype");

      await item.scrollIntoViewIfNeeded();

      await expect(item).toBeVisible();
      await expect(item.getByText(libraryVersions.arktype)).toBeVisible();
    });
  });
});

test.describe("benchmarks tab", () => {
  test.beforeEach("switch to benchmarks tab", async ({ page, toJsonPage }) => {
    await toJsonPage.benchmarks.select();

    await expect(toJsonPage.benchmarks.tabLink).toBeCurrent("page");

    await expect(page).toHaveURL((url) => toJsonPage.benchmarks.matchesUrl(url));
  });

  test("can toggle targets", async ({ page, toJsonPage }) => {
    for (const target of jsonSchemaConversionTargetSchema.options) {
      const link = toJsonPage.benchmarks.getTargetLink(target);

      await expect(async () => {
        await link.click();

        await expect(page).toHaveURL((url) => url.searchParams.get("target") === target);

        await expect(link).toBeCurrent("page");
      }).toPass();
    }
  });

  test.describe("desktop direction filtering", { tag: "@desktop" }, () => {
    test("shows matching table rows", async ({ toJsonPage }) => {
      for (const direction of jsonSchemaDirectionSchema.options) {
        await toJsonPage.benchmarks.selectDirection(direction);

        const expectedDirection = toJsonPage.benchmarks.getDirectionLabel(direction);
        await expect(async () => {
          await everyAsync(toJsonPage.benchmarks.desktop.tableHandle, async ({ row }) => {
            await expect(row.getCell("type")).toHaveText(expectedDirection);
          });
        }).toPass();
      }
    });
  });

  test.describe("mobile direction filtering", { tag: "@mobile" }, () => {
    test("shows matching list labels", async ({ toJsonPage }) => {
      for (const direction of jsonSchemaDirectionSchema.options) {
        await toJsonPage.benchmarks.selectDirection(direction);

        const expectedDirectionRegex = substringToRegex(
          toJsonPage.benchmarks.getDirectionLabel(direction),
        );
        await expect(async () => {
          const labels = await toJsonPage.benchmarks.mobile.items.allTextContents();

          every(labels, (label) => {
            expect(label).toMatch(expectedDirectionRegex);
          });
        }).toPass();
      }
    });
  });

  test.describe("desktop view", { tag: "@desktop" }, () => {
    test.beforeEach(async ({ toJsonPage }) => {
      await toJsonPage.benchmarks.desktop.tableHandle.init();
    });

    test("it displays results table", async ({ toJsonPage }) => {
      await expect(toJsonPage.benchmarks.desktop.table).toBeVisible();

      const zodRow = toJsonPage.benchmarks.desktop.tableHandle.getRow({ library: "zod" });

      await expect(zodRow.getCell("version")).toHaveText(libraryVersions.zod);
    });

    test("table can be sorted by column", async ({ toJsonPage }) => {
      await helpers.desktop.expectTableSorting(toJsonPage.benchmarks.desktop.tableHandle, {
        first: /arktype/i,
        last: /zod/i,
      });
    });
  });

  test.describe("mobile view", { tag: "@mobile" }, () => {
    test("it displays results list", async ({ toJsonPage }) => {
      const item = toJsonPage.benchmarks.mobile.getListItemByLibraryName("zod").first();

      await expect(item).toBeVisible();

      const versionEl = item.getByText(libraryVersions.zod);

      await expect(versionEl).toBeVisible();
    });
  });
});
