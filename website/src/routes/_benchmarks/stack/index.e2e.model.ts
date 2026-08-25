import { useTable } from "@rickcedwhat/playwright-smart-table";

import { cache, PageObjectModel } from "#e2e/fixtures/base";
import { trimSortLabels } from "#e2e/utils";

export class StackPage extends PageObjectModel {
  url = "/stack";
  title = /Stack/;

  @cache()
  get desktop() {
    const table = this.main.getByRole("table", { name: "Results" });
    return {
      table,
      tableHandle: useTable(table, {
        headerTransformer: ({ text }) => trimSortLabels(text),
      }),
    };
  }

  @cache()
  get mobile() {
    const list = this.main.getByRole("list", { name: "Results" });
    return {
      list,
      getListItemByLibraryName: (libraryName: string | RegExp) =>
        list.getByRole("listitem").filter({ hasText: libraryName }),
    };
  }
}
