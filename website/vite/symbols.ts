import ts from "dedent";
import type { Plugin } from "vite";

const component = "MdSymbol";

interface Options {
  /* Symbols that may not be picked up by the plugin, usually because they were interpolated (<MdSymbol>{icon}</MdSymbol>) instead of hardcoded (<MdSymbol>icon</MdSymbol>). */
  knownSymbols?: Array<string>;
}

export default function materialSymbols({
  knownSymbols = [],
}: Options = {}): Plugin {
  const usedSymbols = new Set(knownSymbols);
  const virtualModuleId = "virtual:used-symbols";
  const resolvedVirtualModuleId = `\0${virtualModuleId}`;

  return {
    name: "used-symbols",
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const stringified = [];
        for (const symbol of usedSymbols.values()) {
          stringified.push(`"${symbol}"`);
        }
        return ts`export default [${stringified.sort().join(",")}];`;
      }
    },
  };
}
