import { useTable } from "@rickcedwhat/playwright-smart-table";

import { cache, PageObjectModel } from "#e2e/fixtures/base.ts";
import { trimSortLabels } from "#e2e/utils";

export class FromJsonPage extends PageObjectModel {
  url = "/json-schema/from-json";
  title = /JSON Schema to Schema/;

  @cache()
  get desktop() {
    const table = this.page.getByRole("table", { name: "Results" });
    return {
      table,
      tableHandle: useTable(table, {
        headerTransformer: ({ text }) => trimSortLabels(text),
      }),
    };
  }

  @cache()
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
