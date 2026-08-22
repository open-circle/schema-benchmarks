import { RuntimePage, withDataToggle } from "#e2e/fixtures/runtime.ts";

export class ValidationPage extends withDataToggle(RuntimePage) {
  url = "/validation";
  title = /Validation/;
}
