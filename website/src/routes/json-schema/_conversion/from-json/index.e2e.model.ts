import { useTable } from "@rickcedwhat/playwright-smart-table";
import { lazy } from "@schema-benchmarks/utils";

import { PageObjectModel } from "#e2e/fixtures/base.ts";
import { trimSortLabels } from "#e2e/utils";

export class FromJsonPage extends PageObjectModel {
  url = "/json-schema/from-json";
  title = /JSON Schema to Schema/;

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
