import type { DataType } from "@schema-benchmarks/bench";
import type { OptimizeType, ErrorType } from "@schema-benchmarks/schemas";

import { BasePOM } from "#e2e/fixtures/base";
import { getCellByColumnName } from "#e2e/utils";
import {
  dataTypeProps,
  errorTypeProps,
  optimizeTypeProps,
} from "#src/routes/_benchmarks/_runtime/-constants";

export class RuntimePage extends BasePOM {
  breakpoints = BasePOM.defineBreakpoints({
    desktop: ["laptop", "desktop"],
  });

  optimizeFilter = this.main.getByRole("list", { name: "Optimizations" });

  getOptimizeTypeLabel(type: OptimizeType) {
    return optimizeTypeProps.labels[type].label;
  }

  getOptimizeTypeLink(type: OptimizeType) {
    return this.optimizeFilter.getByRole("link", {
      name: this.getOptimizeTypeLabel(type),
      exact: true,
    });
  }

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

export function withDataToggle<Constructor extends new (...args: Array<any>) => RuntimePage>(
  Base: Constructor,
) {
  return class extends Base {
    dataToggle = this.main.getByRole("list", { name: "Data" });

    getDataTypeLabel(dataType: DataType) {
      return dataTypeProps.labels[dataType].label;
    }

    getDataTypeLink(dataType: DataType) {
      return this.dataToggle.getByRole("link", {
        name: this.getDataTypeLabel(dataType),
        exact: true,
      });
    }
  };
}

export function withErrorTypeFilter<Constructor extends new (...args: Array<any>) => RuntimePage>(
  Base: Constructor,
) {
  return class extends Base {
    errorTypeFilter = this.main.getByRole("list", { name: "Abort early" });

    getErrorTypeLabel(errorType: ErrorType) {
      return errorTypeProps.labels[errorType].label;
    }

    getErrorTypeLink(errorType: ErrorType) {
      return this.errorTypeFilter.getByRole("link", {
        name: this.getErrorTypeLabel(errorType),
        exact: true,
      });
    }
  };
}

export type MixinInstanceType<Mixin extends (...args: Array<any>) => any> = InstanceType<
  ReturnType<Mixin>
>;
