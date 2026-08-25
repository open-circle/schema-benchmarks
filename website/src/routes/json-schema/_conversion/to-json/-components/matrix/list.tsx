import type { JsonSchemaSupportMatrix, JsonSchemaSourceResult } from "@schema-benchmarks/bench";
import {
  jsonSchemaDirectionSchema,
  jsonSchemaConversionTargetSchema,
} from "@schema-benchmarks/schemas";
import { getTransitionName } from "@schema-benchmarks/utils";

import { JsonSchemaSourceText } from "#src/routes/json-schema/-components/source.tsx";
import {
  jsonSchemaDirectionProps,
  jsonSchemaConversionTargetProps,
  jsonSourceProps,
} from "#src/routes/json-schema/_conversion/-constants";
import { List, ListItem, ListItemContent } from "#src/shared/components/list";
import { MdSymbol } from "#src/shared/components/symbol/index.tsx";

import { MatrixCheckbox } from "./checkbox";

export interface SupportMatrixListProps {
  matrix: Record<
    string,
    {
      version: string;
      source: JsonSchemaSourceResult;
      standardJsonSchema?: JsonSchemaSourceResult;
      matrix: JsonSchemaSupportMatrix;
    }
  >;
}

export function SupportMatrixList({ matrix }: SupportMatrixListProps) {
  return (
    <List aria-label="Support Matrix" className="support-matrix-list">
      {Object.entries(matrix).map(([library, result]) => {
        const { matrix: supportMatrix, ...metadata } = result;
        const id = getTransitionName("support-matrix-list-item", { libraryName: library });
        return (
          <ListItem key={library} id={id} style={{ viewTransitionName: id }}>
            <details className="support-matrix-list__item">
              <summary className="support-matrix-list__summary">
                <ListItemContent
                  lines={2}
                  overline={<code className="language-text">{metadata.version}</code>}
                  primary={<code className="language-text">{library}</code>}
                  leading={
                    <MdSymbol>
                      {
                        jsonSourceProps.labels[
                          typeof metadata.source === "string"
                            ? metadata.source
                            : metadata.source.type
                        ].icon
                      }
                    </MdSymbol>
                  }
                />
              </summary>
              <div className="support-matrix-list__details">
                <dl className="support-matrix-list__sources">
                  <div>
                    <dt>Source</dt>
                    <dd>
                      <JsonSchemaSourceText source={metadata.source} />
                    </dd>
                  </div>
                  {metadata.standardJsonSchema && (
                    <div>
                      <dt>Standard JSON Schema</dt>
                      <dd>
                        <JsonSchemaSourceText source={metadata.standardJsonSchema} />
                      </dd>
                    </div>
                  )}
                </dl>
                {jsonSchemaConversionTargetSchema.options.map((target) => (
                  <section
                    key={`${library}-${target}`}
                    className="support-matrix-list__section"
                    aria-labelledby={`${id}-${target}`}
                  >
                    <h3 id={`${id}-${target}`} className="typo-body2">
                      {jsonSchemaConversionTargetProps.labels[target].label}
                    </h3>
                    <List aria-label={`${library} ${target} support matrix`}>
                      {jsonSchemaDirectionSchema.options.map((direction) => (
                        <ListItem key={`${library}-${target}-${direction}`}>
                          <ListItemContent
                            leading={
                              <MdSymbol>{jsonSchemaDirectionProps.labels[direction].icon}</MdSymbol>
                            }
                            trailing={
                              <MatrixCheckbox reason={supportMatrix?.[target]?.[direction]} />
                            }
                          >
                            {jsonSchemaDirectionProps.labels[direction].label}
                          </ListItemContent>
                        </ListItem>
                      ))}
                    </List>
                  </section>
                ))}
              </div>
            </details>
          </ListItem>
        );
      })}
    </List>
  );
}
