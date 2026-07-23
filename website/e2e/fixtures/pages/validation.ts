import type { DataType } from "@schema-benchmarks/bench";

import { RuntimePage } from "#e2e/fixtures/pages/_runtime";
import { dataTypeProps } from "#src/routes/_benchmarks/_runtime/-constants";

export class ValidationPage extends RuntimePage {
  dataToggle = this.main.getByRole("list", { name: "Data" });

  getDataTypeLink(dataType: DataType) {
    return this.dataToggle.getByRole("link", {
      name: dataTypeProps.labels[dataType].label,
      exact: true,
    });
  }
}
