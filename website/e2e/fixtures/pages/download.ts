import type { MinifyType } from "@schema-benchmarks/bench";

import { BasePOM } from "#e2e/fixtures/base";
import { getCellByColumnName } from "#e2e/utils";
import { minifyTypeProps } from "#src/routes/_benchmarks/download/-constants";

export class DownloadPage extends BasePOM {
  minifyToggle = this.main.getByRole("list", { name: "Minify" });
  downloadSpeedInput = this.main.getByRole("spinbutton", { name: "Download speed" });
  speedPresets = this.main.getByRole("toolbar", { name: "Speed presets" });

  breakpoints = {
    desktop: ["laptop", "desktop"] as const,
  };

  get desktop() {
    const table = this.main.getByRole("table", { name: "Results" });
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
    const cardList = this.main.getByRole("list", { name: "Results" });
    return {
      cardList,
      getCardByName: (name: string | RegExp) => cardList.getByRole("listitem", { name }),
    };
  }

  getMinifyTypeLink(minifyType: MinifyType) {
    return this.minifyToggle.getByRole("link", {
      name: minifyTypeProps.labels[minifyType].label,
      exact: true,
    });
  }

  getSpeedPresetButtonByLabel(label: string) {
    return this.speedPresets.getByRole("link", { name: label });
  }
}
