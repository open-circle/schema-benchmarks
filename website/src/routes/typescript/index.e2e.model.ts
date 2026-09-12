import { useTable } from "@rickcedwhat/playwright-smart-table";
import { lazy } from "@schema-benchmarks/utils";

import { ComponentObjectModel, PageObjectModel } from "#e2e/fixtures/base";
import { trimSortLabels } from "#e2e/utils";

class TypesDetailsDialog extends ComponentObjectModel {
  dialog = this.page.getByRole("dialog", { name: "Inferred types" });

  closeButton = this.dialog.getByRole("button", { name: "Close" });

  close() {
    return this.closeButton.click();
  }
}

export class TypescriptPage extends PageObjectModel {
  url = "/typescript";
  title = /TypeScript Inference/;

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

  details = new TypesDetailsDialog(this.page);
}
