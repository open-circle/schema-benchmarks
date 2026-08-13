import type { TableResult } from "@rickcedwhat/playwright-smart-table";
import { useTable } from "@rickcedwhat/playwright-smart-table";

import { PageObjectModel } from "#e2e/fixtures/base.ts";
import { trimSortLabels } from "#e2e/utils/index.ts";

export class FromJsonPage extends PageObjectModel {
  url = "/json-schema/from-json";

  breakpoints = PageObjectModel.defineBreakpoints({
    desktop: ["laptop", "desktop"],
  });

  #tableHandle: TableResult<unknown> | undefined;
  get desktop() {
    const table = this.page.getByRole("table", { name: "Results" });
    this.#tableHandle ??= useTable(table, {
      headerTransformer: ({ text }) => trimSortLabels(text),
    });
    return {
      table,
      tableHandle: this.#tableHandle,
    };
  }

  get mobile() {
    const cardsList = this.page.getByRole("list", { name: "Results" });
    const cards = cardsList.getByTestId("bench-card");
    return {
      cardsList,
      cards,
      getCardByLibraryName: (libraryName: string | RegExp) =>
        cards.filter({ hasText: libraryName }),
    };
  }
}
