import { RuntimePage, withDataToggle, withErrorTypeFilter } from "#e2e/fixtures/runtime.ts";

export class ParsingPage extends withErrorTypeFilter(withDataToggle(RuntimePage)) {
  url = "/parsing";
  title = /Parsing/;
}
