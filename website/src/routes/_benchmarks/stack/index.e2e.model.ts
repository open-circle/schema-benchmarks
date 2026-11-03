import { useTable as createTableHandle } from "@rickcedwhat/playwright-smart-table";

import { PageObjectModel } from "#e2e/fixtures/base";
import { trimSortLabels } from "#e2e/utils";

export class StackPage extends PageObjectModel {
  url = "/stack";
  title = /Stack/;

  #desktopTableHandle?: ReturnType<typeof createTableHandle>;

  get desktop() {
    const table = this.main.getByRole("table", { name: "Results" });
    return {
      table,
      tableHandle: (this.#desktopTableHandle ??= createTableHandle(table, {
        headerTransformer: ({ text }) => trimSortLabels(text),
      })),
    };
  }

  get mobile() {
    const list = this.main.getByRole("list", { name: "Results" });
    return {
      list,
      getListItemByLibraryName: (libraryName: string | RegExp) =>
        list.getByRole("listitem").filter({ hasText: libraryName }),
    };
  }
}
