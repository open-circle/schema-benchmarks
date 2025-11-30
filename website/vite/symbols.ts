import { partition } from "@schema-benchmarks/utils";
import esquery from "esquery";
import type { Literal } from "estree";
import type { Plugin } from "vite";

const component = "MdSymbol";

export const symbolsUrl =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";

// based on https://github.com/RobinTail/vite-plugin-material-symbols
// but adapted to work with Tanstack Start (no index.html)

interface Options {
  /* Symbols that may not be picked up by the plugin, usually because they were interpolated (<MdSymbol>{icon}</MdSymbol>) instead of hardcoded (<MdSymbol>icon</MdSymbol>). */
  knownSymbols?: Array<string>;
}

export default function materialSymbols({
  knownSymbols = [],
}: Options = {}): Array<Plugin> {
  const usedSymbols = new Set<string>();
  let addedKnown = false;
  return [
    {
      name: "used-symbols:pre",
      enforce: "pre",
      apply: "build",
      moduleParsed({ id, code, ast }) {
        if (!ast || !code?.includes(component)) return;
        if (!addedKnown) {
          for (const symbol of knownSymbols) {
            usedSymbols.add(symbol);
          }
          addedKnown = true;
        }
        const nodes = esquery.query(
          ast,
          `CallExpression[callee.name='jsx'][arguments.0.name='${component}'] > .arguments:nth-child(2) > Property[key.name='children'] > .value`,
        );
        const [stringLiteralNodes, otherNodes] = partition(
          nodes,
          (node): node is Literal & { value: string } =>
            node.type === "Literal" && typeof node.value === "string",
        );
        for (const { value } of stringLiteralNodes) {
          this.debug({ id, message: value });
          usedSymbols.add(value);
        }
        if (otherNodes.length)
          this.info(
            `Found ${otherNodes.length} dynamic symbols in ${id.split("/website")[1]} - make sure they're added to knownSymbols in vite.config.ts`,
          );
      },
    },
    {
      name: "used-symbols:post",
      enforce: "post",
      apply: "build",
      generateBundle(_opts, bundle) {
        if (!usedSymbols.size) return;
        const finalUrl = `${symbolsUrl}&icon_names=${[...usedSymbols.values()].sort().join(",")}`;
        for (const assetOrChunk of Object.values(bundle)) {
          if (
            assetOrChunk.type === "asset" ||
            !assetOrChunk.code.includes(symbolsUrl)
          )
            continue;
          assetOrChunk.code = assetOrChunk.code.replaceAll(
            symbolsUrl,
            finalUrl,
          );
        }
      },
    },
  ];
}
