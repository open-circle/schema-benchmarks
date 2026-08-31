import { useTable } from "@rickcedwhat/playwright-smart-table";
import type { MinifyType } from "@schema-benchmarks/bench";

import { lazy, PageObjectModel } from "#e2e/fixtures/base";
import { trimSortLabels } from "#e2e/utils";

import { minifyTypeProps } from "./-constants";

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

  @lazy
  get desktop() {
    const table = this.main.getByRole("table", { name: "Results" });
    return {
      table,
      tableHandle: useTable(table, {
        headerTransformer: ({ text }) => trimSortLabels(text),
      }),
    };
  }

  @lazy
  get mobile() {
    const list = this.main.getByRole("list", { name: "Results" });
    return {
      list,
      getListItem: (libraryName: string | RegExp) =>
        list.getByRole("listitem").filter({ hasText: libraryName }),
      getDetailsByLibrary: (libraryName: string | RegExp) =>
        list.getByRole("listitem").filter({ hasText: libraryName }).locator("details"),
    };
  }
}
