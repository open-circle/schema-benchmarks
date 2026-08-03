import type { JsonSchemaDirection, JsonSchemaTarget } from "@schema-benchmarks/schemas";

import {
  jsonSchemaTargetProps,
  jsonSchemaDirectionProps,
} from "#src/routes/_benchmarks/json-schema/_conversion/-constants";

import { BaseConversionPage } from "./_conversion";

export class ToJsonPage extends BaseConversionPage {
  url = "/json-schema/to-json";

  tabs = this.page.getByRole("tablist");

  getTabLink(tab: "Support Matrix" | "Benchmarks") {
    return this.tabs.getByRole("tab", { name: tab });
  }

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
}
