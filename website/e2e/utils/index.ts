import type { Page, Locator } from "@playwright/test";

import type { Breakpoint } from "#/shared/hooks/use-breakpoints";
import { breakpointQueries } from "#/shared/hooks/use-breakpoints";

/**
 * Returns the cell in a given row of a table by the column name.
 * @param table The table locator
 * @param row The row locator
 * @param columnName The column name to search for. Can be a substring (case-insensitive) or a RegExp.
 * @returns The cell locator
 */
export async function getCellByColumnName(
  table: Locator,
  row: Locator,
  columnName: string | RegExp,
): Promise<Locator> {
  const regexp =
    typeof columnName === "string" ? new RegExp(RegExp.escape(columnName), "i") : columnName;

  const cols = await table.getByRole("columnheader").allTextContents();

  for (let colIdx = 0; colIdx < cols.length; colIdx++)
    if (regexp.test(cols[colIdx]!)) return row.getByRole("cell").nth(colIdx);

  throw new Error(`Column with name "${columnName}" not found`);
}

export function matchBreakpoints(page: Page, breakpoints: ReadonlyArray<Breakpoint>) {
  const query = breakpoints.map((breakpoint) => `(${breakpointQueries[breakpoint]})`).join(" or ");

  return page.evaluate(([query]): boolean => window.matchMedia(query).matches, [query] as const);
}
