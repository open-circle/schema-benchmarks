import { RuntimePage, withDataToggle, withErrorTypeFilter } from "#e2e/fixtures/pages/_runtime";

export class ParsingPage extends withErrorTypeFilter(withDataToggle(RuntimePage)) {}
