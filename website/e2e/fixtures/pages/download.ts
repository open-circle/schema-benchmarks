import type { TableResult } from "@rickcedwhat/playwright-smart-table";
import { useTable } from "@rickcedwhat/playwright-smart-table";
import type { MinifyType } from "@schema-benchmarks/bench";

import { BasePage } from "#e2e/fixtures/base";
import { trimSortLabels } from "#e2e/utils";
import { minifyTypeProps } from "#src/routes/_benchmarks/download/-constants";

export class DownloadPage extends BasePage {
  url = "/download";

  minifyToggle = this.main.getByRole("list", { name: "Minify" });

  getMinifyTypeLink(minifyType: MinifyType) {
    return this.minifyToggle.getByRole("link", {
      name: minifyTypeProps.labels[minifyType].label,
      exact: true,
    });
  }

  downloadSpeedInput = this.main.getByRole("spinbutton", { name: "Download speed" });

  speedPresets = this.main.getByRole("toolbar", { name: "Speed presets" });

  getSpeedPresetButtonByLabel(label: string) {
    return this.speedPresets.getByRole("link", { name: label });
  }

  breakpoints = BasePage.defineBreakpoints({
    desktop: ["laptop", "desktop"],
  });

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
    const cardList = this.main.getByRole("list", { name: "Results" });
    return {
      cardList,
      getCardByName: (name: string | RegExp) => cardList.getByRole("listitem", { name }),
    };
  }
}
