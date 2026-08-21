import { RuntimePage, withDataToggle, withErrorTypeFilter } from "#e2e/fixtures/runtime.ts";

export class StandardSchemaPage extends withErrorTypeFilter(withDataToggle(RuntimePage)) {
  url = "/standard";
  title = /Standard Schema/;
}
