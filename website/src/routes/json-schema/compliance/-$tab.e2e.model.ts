import { useTable } from "@rickcedwhat/playwright-smart-table";
import type { ComplianceTarget } from "@schema-benchmarks/json-schema-tests/types";
import type { ComplianceType } from "@schema-benchmarks/schemas";

import {
  cache,
  ComponentObjectModel,
  PageObjectModel,
  TabObjectModel,
} from "#e2e/fixtures/base.ts";
import { trimSortLabels } from "#e2e/utils";
import {
  complianceTargetProps,
  complianceTypeLabels,
} from "#src/routes/json-schema/compliance/-constants";

class ComplianceDetailsDialog extends ComponentObjectModel {
  dialog = this.page.getByRole("dialog", { name: "Compliance" });

  closeButton = this.dialog.getByRole("button", { name: "Close" });

  close() {
    return this.closeButton.click();
  }
}

abstract class ComplianceTab extends TabObjectModel<CompliancePage> {
  abstract complianceType: ComplianceType;
  @cache()
  get tabName() {
    return complianceTypeLabels[this.complianceType].label;
  }
  // the base class tries to set the tabName property (to undefined), but we don't want to allow that in this subclass
  set tabName(_) {}

  abstract libraries: {
    first: string | RegExp;
    last: string | RegExp;
  };

  @cache()
  get desktop() {
    const table = this.page.getByRole("table", { name: "Compliance Table" });

    return {
      table,
      tableHandle: useTable(table, {
        headerTransformer: ({ text }) => trimSortLabels(text),
      }),
    };
  }

  @cache()
  get mobile() {
    const list = this.page.getByRole("list", { name: "Compliance List" });
    return {
      list,
      getListItem: (libraryName: string | RegExp) =>
        list.getByRole("listitem").filter({ hasText: libraryName }),
    };
  }
}

class ValidationTab extends ComplianceTab {
  url = "/json-schema/compliance/validation";
  complianceType = "validation" as const;

  libraries = {
    first: /@cfworker\/json-schema/i,
    last: /z-schema/i,
  };
}

class SemanticsTab extends ComplianceTab {
  url = "/json-schema/compliance/semantics";
  complianceType = "semantics" as const;

  libraries = {
    first: /arktype/i,
    last: /zod/i,
  };
}

class RoundtripTab extends ComplianceTab {
  url = "/json-schema/compliance/roundtrip";
  complianceType = "roundtrip" as const;

  libraries = {
    first: /arktype/i,
    last: /zod/i,
  };
}

export class CompliancePage extends PageObjectModel {
  url = "/json-schema/compliance";
  title = /Compliance/;

  targetToggle = this.page.getByRole("list", { name: "Target" });

  getTargetLabel(target: ComplianceTarget) {
    return complianceTargetProps.labels[target].label;
  }
  getTargetLink(target: ComplianceTarget) {
    return this.targetToggle.getByRole("link", {
      name: this.getTargetLabel(target),
      exact: true,
    });
  }

  tabs = this.page.getByRole("tablist");

  validation = new ValidationTab(this.page, this);
  semantics = new SemanticsTab(this.page, this);
  roundtrip = new RoundtripTab(this.page, this);

  details = new ComplianceDetailsDialog(this.page);
}
