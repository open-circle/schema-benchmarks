import type { TableResult } from "@rickcedwhat/playwright-smart-table";
import { useTable } from "@rickcedwhat/playwright-smart-table";
import type { JsonSchemaDirection, JsonSchemaTarget } from "@schema-benchmarks/schemas";

import { trimSortLabels } from "#e2e/utils/index.ts";
import {
  jsonSchemaTargetProps,
  jsonSchemaDirectionProps,
} from "#src/routes/_benchmarks/json-schema/conversion/-constants";

import { BasePage } from "../../base";

export class JsonSchemaConversionPage extends BasePage {
  url = "/json-schema/conversion";

  breakpoints = BasePage.defineBreakpoints({
    desktop: ["laptop", "desktop"],
  });

  targetToggle = this.page.getByRole("list", { name: "Target" });

  getTargetLabel(target: JsonSchemaTarget) {
    return jsonSchemaTargetProps.labels[target].label;
  }

  getTargetLink(target: JsonSchemaTarget) {
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
