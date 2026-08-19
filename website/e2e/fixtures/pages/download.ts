import { useTable } from "@rickcedwhat/playwright-smart-table";
import type { MinifyType } from "@schema-benchmarks/bench";

import { cache, PageObjectModel } from "#e2e/fixtures/base";
import { trimSortLabels } from "#e2e/utils";
import { minifyTypeProps } from "#src/routes/_benchmarks/download/-constants";

export class DownloadPage extends PageObjectModel {
  url = "/download";
  title = /Download/;

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
    const cardList = this.main.getByRole("list", { name: "Results" });
    return {
      cardList,
      getCardByName: (name: string | RegExp) => cardList.getByRole("listitem", { name }),
    };
  }
}
