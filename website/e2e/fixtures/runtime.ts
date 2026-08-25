import { useTable } from "@rickcedwhat/playwright-smart-table";
import type { DataType } from "@schema-benchmarks/bench";
import type { OptimizeType, ErrorType } from "@schema-benchmarks/schemas";

import { cache, PageObjectModel } from "#e2e/fixtures/base";
import { expect } from "#e2e/fixtures/expect";
import { trimSortLabels } from "#e2e/utils";
import {
  dataTypeProps,
  errorTypeProps,
  optimizeTypeProps,
} from "#src/routes/_benchmarks/_runtime/-constants";

export abstract class RuntimePage extends PageObjectModel {
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

  async selectOptimizeType(type: OptimizeType) {
    const link = this.getOptimizeTypeLink(type);

    await link.click();

    await expect(this.page).toHaveURL((url) => url.searchParams.get("optimizeType") === type);

    await expect(link).toBeCurrent("page");
  }

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
    const items = list.getByRole("listitem");
    return {
      list,
      items,
      getListItemByLibraryName: (libraryName: string | RegExp) =>
        items.filter({ hasText: libraryName }),
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

    async selectErrorType(errorType: ErrorType) {
      const link = this.getErrorTypeLink(errorType);

      await link.click();

      await expect(this.page).toHaveURL((url) => url.searchParams.get("errorType") === errorType);

      await expect(link).toBeCurrent("page");
    }
  }
  return ErrorTypeFilterMixin;
}

export type MixinInstanceType<Mixin extends (...args: Array<any>) => any> = InstanceType<
  ReturnType<Mixin>
>;
