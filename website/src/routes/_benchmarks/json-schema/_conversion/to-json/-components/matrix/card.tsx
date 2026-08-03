import type { JsonSchemaSupportMatrix } from "@schema-benchmarks/bench";
import { jsonSchemaDirectionSchema, jsonSchemaTargetSchema } from "@schema-benchmarks/schemas";
import bem from "react-bem-helper";

import {
  jsonSchemaDirectionProps,
  jsonSchemaTargetProps,
} from "#src/routes/_benchmarks/json-schema/_conversion/-constants";
import { List, ListItem, ListItemContent } from "#src/shared/components/list";
import { MdSymbol } from "#src/shared/components/symbol/index.tsx";

import { MatrixCheckbox } from "./checkbox";

export interface SupportMatrixCardProps {
  library: string;
  version: string;
  supportMatrix: JsonSchemaSupportMatrix;
}

export const cls = bem("support-matrix-card");

export function SupportMatrixCard({ library, version, supportMatrix }: SupportMatrixCardProps) {
  return (
    <article {...cls()} aria-labelledby={`${library}-support-matrix-card`}>
      <h5 {...cls({ element: "version", extra: "typo-overline" })}>{version}</h5>
      <header
        id={`${library}-support-matrix-card`}
        {...cls({ element: "library", extra: "typo-headline5" })}
      >
        <code className="language-text">{library}</code>
      </header>
      {jsonSchemaTargetSchema.options.map((target) => (
        <section
          key={`${library}-${target}`}
          {...cls("section")}
          aria-labelledby={`${library}-${target}-subheader`}
        >
          <h3
            id={`${library}-${target}-subheader`}
            {...cls({ element: "subheader", extra: "typo-body2" })}
          >
            {jsonSchemaTargetProps.labels[target].label}
          </h3>
          <List {...cls("list")} aria-label={`${library} ${target} support matrix`}>
            {jsonSchemaDirectionSchema.options.map((direction) => (
              <ListItem key={`${library}-${target}-${direction}`}>
                <ListItemContent
                  leading={<MdSymbol>{jsonSchemaDirectionProps.labels[direction].icon}</MdSymbol>}
                  trailing={<MatrixCheckbox reason={supportMatrix?.[target]?.[direction]} />}
                >
                  {jsonSchemaDirectionProps.labels[direction].label}
                </ListItemContent>
              </ListItem>
            ))}
          </List>
        </section>
      ))}
    </article>
  );
}
