import type { StringFormat } from "@schema-benchmarks/schemas";

import { stringFormatProps } from "#src/routes/_benchmarks/_runtime/-constants";

import { RuntimePage, withDataToggle } from "./_runtime";

export class StringPage extends withDataToggle(RuntimePage) {
  url = "/string";
  title = /String/;

  formatOptions = this.page.getByRole("list", { name: "Format" });

  getFormatLabel(format: StringFormat) {
    return stringFormatProps.labels[format].label;
  }

  getFormatLink(format: StringFormat) {
    return this.formatOptions.getByRole("link", {
      name: this.getFormatLabel(format),
      exact: true,
    });
  }
}
