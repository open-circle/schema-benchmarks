import type { Locator } from "@playwright/test";
import type { MinifyType } from "@schema-benchmarks/bench";

import { minifyTypeProps } from "#/routes/_benchmarks/download/-constants";
import { BasePOM } from "#e2e/fixtures/base";
import { getCellByColumnName } from "#e2e/utils";

export class DownloadPage extends BasePOM {
  minifyToggle = this.page.getByRole("list", { name: "Minify" });
  downloadSpeedInput = this.page.getByRole("spinbutton", { name: "Download speed" });
  speedPresets = this.page.getByRole("toolbar", { name: "Speed presets" });

  breakpoints = {
    desktop: ["laptop", "desktop"] as const,
  };

  desktop = {
    table: this.main.getByRole("table", { name: "Results" }),
    getCellByColumnName: (row: Locator, columnName: string | RegExp) =>
      getCellByColumnName(this.desktop.table, row, columnName),
  };

  mobile = {
    cardList: this.main.getByRole("list", { name: "Results" }),
    getCardByName: (name: string | RegExp) => this.mobile.cardList.getByRole("listitem", { name }),
  };

  selectMinifyType(minifyType: MinifyType) {
    return this.minifyToggle
      .getByRole("link", {
        name: minifyTypeProps.labels[minifyType].label,
        exact: true,
      })
      .click();
  }

  getSpeedPresetButtonByLabel(label: string) {
    return this.speedPresets.getByRole("link", { name: label });
  }
}
