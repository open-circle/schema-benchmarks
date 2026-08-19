import { useTable } from "@rickcedwhat/playwright-smart-table";
import type { JsonSchemaDirection, JsonSchemaConversionTarget } from "@schema-benchmarks/schemas";

import { cache, PageObjectModel, TabObjectModel } from "#e2e/fixtures/base.ts";
import { trimSortLabels } from "#e2e/utils/index.ts";
import {
  jsonSchemaConversionTargetProps,
  jsonSchemaDirectionProps,
} from "#src/routes/json-schema/_conversion/-constants";

class BenchmarksTab extends TabObjectModel<ToJsonPage> {
  url = "/json-schema/to-json/bench";
  tabName = "Benchmarks";

  targetToggle = this.page.getByRole("list", { name: "Target" });

  getTargetLabel(target: JsonSchemaConversionTarget) {
    return jsonSchemaConversionTargetProps.labels[target].label;
  }

  getTargetLink(target: JsonSchemaConversionTarget) {
    return this.targetToggle.getByRole("link", {
      name: this.getTargetLabel(target),
      exact: true,
    });
  }

  directionFilter = this.page.getByRole("list", { name: "Type" });

  getDirectionLabel(direction: JsonSchemaDirection) {
    return jsonSchemaDirectionProps.labels[direction].label;
  }

  getDirectionLink(direction: JsonSchemaDirection) {
    return this.directionFilter.getByRole("link", {
      name: this.getDirectionLabel(direction),
      exact: true,
    });
  }

  @cache()
  get desktop() {
    const table = this.page.getByRole("table", { name: "Results" });
    const tableHandle = useTable(table, {
      headerTransformer: ({ text }) => trimSortLabels(text),
    });
    return {
      table,
      tableHandle,
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

class SupportMatrixTab extends TabObjectModel<ToJsonPage> {
  url = "/json-schema/to-json/matrix";
  tabName = "Support Matrix";

  @cache()
  get desktop() {
    const supportMatrixTable = this.page.getByRole("table", { name: "Support Matrix" });
    return {
      supportMatrixTable,
      getSupportMatrixTargetHeader: (target: JsonSchemaConversionTarget) =>
        supportMatrixTable.getByRole("columnheader", {
          name: jsonSchemaConversionTargetProps.labels[target].label,
        }),
    };
  }

  @cache()
  get mobile() {
    const supportMatrixCardsList = this.page.getByRole("list", { name: "Support Matrix" });
    const supportMatrixCards = supportMatrixCardsList.getByTestId("support-matrix-card");
    return {
      supportMatrixCardsList,
      supportMatrixCards,
      getSupportMatrixCardByLibraryName: (libraryName: string | RegExp) =>
        supportMatrixCards.filter({ hasText: libraryName }),
    };
  }
}

export class ToJsonPage extends PageObjectModel {
  url = "/json-schema/to-json";
  title = /Schema to JSON Schema/;

  breakpoints = PageObjectModel.defineBreakpoints({
    desktop: ["laptop", "desktop"],
  });

  tabs = this.page.getByRole("tablist");

  benchmarks = new BenchmarksTab(this.page, this);
  supportMatrix = new SupportMatrixTab(this.page, this);
}
