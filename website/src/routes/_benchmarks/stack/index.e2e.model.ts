import { useTable } from "@rickcedwhat/playwright-smart-table";
import { lazy } from "@schema-benchmarks/utils";

import { PageObjectModel } from "#e2e/fixtures/base";
import { trimSortLabels } from "#e2e/utils";

export class StackPage extends PageObjectModel {
  url = "/stack";
  title = /Stack/;

  @lazy
  get desktop() {
    const table = this.main.getByRole("table", { name: "Results" });
    return {
      table,
      tableHandle: useTable(table, {
        headerTransformer: ({ text }) => trimSortLabels(text),
      }),
    };
  }

  @lazy
  get mobile() {
    const list = this.main.getByRole("list", { name: "Results" });
    return {
      list,
      getListItemByLibraryName: (libraryName: string | RegExp) =>
        list.getByRole("listitem").filter({ hasText: libraryName }),
    };
  }
}
