import { useTable } from "@rickcedwhat/playwright-smart-table";
import type { JsonSchemaDirection, JsonSchemaConversionTarget } from "@schema-benchmarks/schemas";

import { lazy, PageObjectModel, TabObjectModel } from "#e2e/fixtures/base.ts";
import { expect } from "#e2e/fixtures/expect";
import { trimSortLabels } from "#e2e/utils";
import {
  jsonSchemaConversionTargetProps,
  jsonSchemaDirectionProps,
} from "#src/routes/json-schema/_conversion/-constants";

class BenchmarksTab extends TabObjectModel<ToJsonPage> {
  url = "/json-schema/to-json/bench";
  tabName = "Benchmarks";

  targetToggle = this.page.getByRole("list", { name: "Target" });

  getTargetLabel(target: JsonSchemaConversionTarget) {
    return jsonSchemaConversionTargetProps.labels[target].label;
  }

  getTargetLink(target: JsonSchemaConversionTarget) {
    return this.targetToggle.getByRole("link", {
      name: this.getTargetLabel(target),
      exact: true,
    });
  }

  directionFilter = this.page.getByRole("list", { name: "Type" });

  getDirectionLabel(direction: JsonSchemaDirection) {
    return jsonSchemaDirectionProps.labels[direction].label;
  }

  getDirectionLink(direction: JsonSchemaDirection) {
    return this.directionFilter.getByRole("link", {
      name: this.getDirectionLabel(direction),
      exact: true,
    });
  }

  async selectDirection(direction: JsonSchemaDirection) {
    const link = this.getDirectionLink(direction);

    await link.click();

    await expect(link).toBeCurrent("page");

    await expect(this.page).toHaveURL((url) => url.searchParams.get("direction") === direction);
  }

  @lazy
  get desktop() {
    const table = this.page.getByRole("table", { name: "Results" });
    return {
      table,
      tableHandle: useTable(table, {
        headerTransformer: ({ text }) => trimSortLabels(text),
      }),
    };
  }

  @lazy
  get mobile() {
    const items = this.page.getByRole("list", { name: "Results" }).getByRole("listitem");
    return {
      items,
      getListItemByLibraryName: (libraryName: string | RegExp) =>
        items.filter({ hasText: libraryName }),
    };
  }
}

class SupportMatrixTab extends TabObjectModel<ToJsonPage> {
  url = "/json-schema/to-json/matrix";
  tabName = "Support Matrix";

  @lazy
  get desktop() {
    const supportMatrixTable = this.page.getByRole("table", { name: "Support Matrix" });
    return {
      supportMatrixTable,
      getSupportMatrixTargetHeader: (target: JsonSchemaConversionTarget) =>
        supportMatrixTable.getByRole("columnheader", {
          name: jsonSchemaConversionTargetProps.labels[target].label,
        }),
    };
  }

  @lazy
  get mobile() {
    const items = this.page.getByRole("list", { name: "Support Matrix" }).getByRole("listitem");
    return {
      items,
      getItemByLibraryName: (libraryName: string | RegExp) =>
        items.filter({ hasText: libraryName }),
    };
  }
}

export class ToJsonPage extends PageObjectModel {
  url = "/json-schema/to-json";
  title = /Schema to JSON Schema/;

  tabs = this.page.getByRole("tablist");

  benchmarks = new BenchmarksTab(this.page, this);
  supportMatrix = new SupportMatrixTab(this.page, this);
}
