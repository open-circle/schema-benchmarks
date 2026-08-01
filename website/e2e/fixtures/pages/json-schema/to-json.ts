import type { JsonSchemaDirection, JsonSchemaConversionTarget } from "@schema-benchmarks/schemas";

import {
  jsonSchemaConversionTargetProps,
  jsonSchemaDirectionProps,
} from "#src/routes/_benchmarks/json-schema/_conversion/-constants";

import { BaseConversionPage } from "./_conversion";

export class ToJsonPage extends BaseConversionPage {
  url = "/json-schema/to-json";

  tabs = this.page.getByRole("tablist");

  getTabLink(tab: "Support Matrix" | "Benchmarks") {
    return this.tabs.getByRole("tab", { name: tab });
  }

  override get desktop() {
    const desktop = super.desktop;
    const supportMatrixTable = this.page.getByRole("table", { name: "Support Matrix" });
    return {
      ...desktop,
      supportMatrixTable,
      getSupportMatrixTargetHeader: (target: JsonSchemaConversionTarget) =>
        supportMatrixTable.getByRole("columnheader", {
          name: jsonSchemaConversionTargetProps.labels[target].label,
        }),
    };
  }

  override get mobile() {
    const mobile = super.mobile;
    const supportMatrixCardsList = this.page.getByRole("list", { name: "Support Matrix" });
    const supportMatrixCards = supportMatrixCardsList.getByTestId("support-matrix-card");
    return {
      ...mobile,
      supportMatrixCardsList,
      supportMatrixCards,
      getSupportMatrixCardByLibraryName: (libraryName: string | RegExp) =>
        supportMatrixCards.filter({ hasText: libraryName }),
    };
  }

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
}
