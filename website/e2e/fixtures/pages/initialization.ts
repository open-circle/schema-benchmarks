import type { OptimizeType } from "@schema-benchmarks/schemas";

import { BasePOM } from "#e2e/fixtures/base";
import { getCellByColumnName } from "#e2e/utils";
import { optimizeTypeProps } from "#src/routes/_benchmarks/_runtime/-constants";

export class InitializationPage extends BasePOM {
  optimizeFilter = this.main.getByRole("list", { name: "Optimizations" });

  getOptimizeTypeLink(type: OptimizeType) {
    return this.optimizeFilter.getByRole("link", {
      name: optimizeTypeProps.labels[type].label,
    });
  }

  breakpoints = BasePOM.defineBreakpoints({
    desktop: ["laptop", "desktop"],
  });

  get desktop() {
    const table = this.page.getByRole("table", { name: "Results" });
    const headerRow = table.getByRole("row").first();
    return {
      table,
      headerRow,
      getCellByColumnName: getCellByColumnName.bind(null, table),
      getHeaderCell: (columnName: string | RegExp) =>
        headerRow.getByRole("columnheader", { name: columnName }),
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
