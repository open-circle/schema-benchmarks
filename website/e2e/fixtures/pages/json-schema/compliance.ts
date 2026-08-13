import { PageObjectModel, TabObjectModel } from "#e2e/fixtures/base.ts";

class ValidationTab extends TabObjectModel<CompliancePage> {
  url = "/json-schema/compliance/validation";
  tabName = "Validation";
}

class SemanticsTab extends TabObjectModel<CompliancePage> {
  url = "/json-schema/compliance/semantics";
  tabName = "Semantics";
}

class RoundtripTab extends TabObjectModel<CompliancePage> {
  url = "/json-schema/compliance/roundtrip";
  tabName = "Roundtrip";
}

export class CompliancePage extends PageObjectModel {
  url = "/json-schema/compliance";

  breakpoints = PageObjectModel.defineBreakpoints({
    desktop: ["laptop", "desktop"],
  });

  tabs = this.page.getByRole("tablist");

  validation = new ValidationTab(this.page, this);
  semantics = new SemanticsTab(this.page, this);
  roundtrip = new RoundtripTab(this.page, this);
}
