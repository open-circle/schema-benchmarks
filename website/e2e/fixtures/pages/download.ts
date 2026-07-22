import type { Page } from "@playwright/test";
import type { MinifyType } from "@schema-benchmarks/bench";

import { minifyTypeProps } from "#/routes/_benchmarks/download/-constants";
import { BasePOM } from "#e2e/fixtures/base";

export class DownloadPage extends BasePOM {
  constructor(
    page: Page,
    public minifyToggle = page.getByRole("list", { name: "Minify" }),
    public downloadSpeedInput = page.getByRole("spinbutton", { name: "Download speed" }),
    public speedPresets = page.getByRole("toolbar", { name: "Speed presets" }),
    public resultsTable = page.getByRole("table"),
  ) {
    super(page);
  }

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
