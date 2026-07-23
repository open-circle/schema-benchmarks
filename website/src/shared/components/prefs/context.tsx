import type { Compute } from "@schema-benchmarks/utils";
import { capitalize } from "@schema-benchmarks/utils";
import { createOptionalContext } from "required-react-context";
import type * as v from "valibot";

import {
  npmSiteSchema,
  styleSchema,
  themeSchema,
  ligatureSchema,
} from "#src/shared/lib/prefs/constants";

export type PrefContextValue<Name extends string, Value> = Compute<
  Record<Name, Value> & Record<`set${Capitalize<Name>}`, (value: Value) => void>
>;

function createPrefContext<Name extends string, Value>(
  name: Name,
  schema: v.SchemaWithFallback<v.GenericSchema<Value>, Value>,
) {
  return createOptionalContext<PrefContextValue<Name, Value>>({
    [name]: schema.fallback,
    [`set${capitalize(name)}`]: () => {},
  } as never).with({ name });
}

export const { ThemeContext, useTheme } = createPrefContext("theme", themeSchema);

export const { StyleContext, useStyle } = createPrefContext("style", styleSchema);

export const { NpmSiteContext, useNpmSite } = createPrefContext("npmSite", npmSiteSchema);

export const { LigatureContext, useLigature } = createPrefContext("ligature", ligatureSchema);
