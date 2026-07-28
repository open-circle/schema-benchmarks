import { RuntimePage, withDataToggle, withErrorTypeFilter } from "#e2e/fixtures/pages/_runtime";

export class StandardSchemaPage extends withErrorTypeFilter(withDataToggle(RuntimePage)) {}
