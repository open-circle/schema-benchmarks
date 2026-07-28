import type { TableResult } from "@rickcedwhat/playwright-smart-table";
import { useTable } from "@rickcedwhat/playwright-smart-table";
import type { DataType } from "@schema-benchmarks/bench";
import type { OptimizeType, ErrorType } from "@schema-benchmarks/schemas";

import { BasePage } from "#e2e/fixtures/base";
import { trimSortLabels } from "#e2e/utils";
import {
  dataTypeProps,
  errorTypeProps,
  optimizeTypeProps,
} from "#src/routes/_benchmarks/_runtime/-constants";

export abstract class RuntimePage extends BasePage {
  breakpoints = BasePage.defineBreakpoints({
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

  #tableHandle: TableResult<unknown> | undefined;
  get desktop() {
    const table = this.main.getByRole("table", { name: "Results" });
    this.#tableHandle ??= useTable(table, {
      headerTransformer: ({ text }) => trimSortLabels(text),
    });
    return {
      table,
      tableHandle: this.#tableHandle,
    };
  }

  get mobile() {
    const cardsList = this.main.getByRole("list", { name: "Results" });
    const cards = cardsList.getByTestId("bench-card");
    return {
      cardsList,
      cards,
      getCardByLibraryName: (libraryName: string | RegExp) =>
        cards.filter({ hasText: libraryName }),
    };
  }
}

export function withDataToggle<
  Constructor extends abstract new (...args: Array<any>) => RuntimePage,
>(Base: Constructor) {
  abstract class DataToggleMixin extends Base {
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
  }
  return DataToggleMixin;
}

export function withErrorTypeFilter<
  Constructor extends abstract new (...args: Array<any>) => RuntimePage,
>(Base: Constructor) {
  abstract class ErrorTypeFilterMixin extends Base {
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
  }
  return ErrorTypeFilterMixin;
}

export type MixinInstanceType<Mixin extends (...args: Array<any>) => any> = InstanceType<
  ReturnType<Mixin>
>;
