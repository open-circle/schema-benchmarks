import type { JsonSchemaSupportMatrix, JsonSchemaSourceResult } from "@schema-benchmarks/bench";
import {
  jsonSchemaDirectionSchema,
  jsonSchemaConversionTargetSchema,
} from "@schema-benchmarks/schemas";
import bem from "react-bem-helper";

import { getPkgUrl } from "#src/routes/_benchmarks/-query.ts";
import {
  jsonSchemaDirectionProps,
  jsonSchemaConversionTargetProps,
  jsonSourceProps,
} from "#src/routes/json-schema/_conversion/-constants";
import { List, ListItem, ListItemContent } from "#src/shared/components/list";
import { useNpmSite } from "#src/shared/components/prefs/context.tsx";
import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import { trackedLinkProps } from "#src/shared/lib/analytics.ts";

import { MatrixCheckbox } from "./checkbox";

export interface SupportMatrixCardProps {
  library: string;
  version: string;
  source: JsonSchemaSourceResult;
  standardJsonSchema?: JsonSchemaSourceResult;
  supportMatrix: JsonSchemaSupportMatrix;
}

export const cls = bem("support-matrix-card");

export function SupportMatrixCard({
  library,
  version,
  source,
  standardJsonSchema,
  supportMatrix,
}: SupportMatrixCardProps) {
  const { npmSite } = useNpmSite();
  return (
    <article
      {...cls()}
      aria-labelledby={`${library}-support-matrix-card`}
      data-testid="support-matrix-card"
    >
      <h5 {...cls({ element: "version", extra: "typo-overline" })}>{version}</h5>
      <header
        id={`${library}-support-matrix-card`}
        {...cls({ element: "library", extra: "typo-headline5" })}
      >
        <code className="language-text">{library}</code>
      </header>
      <dl {...cls({ element: "sources", extra: "minimal" })}>
        <div>
          <dt>Source</dt>
          <dd>
            {typeof source === "string" ? (
              jsonSourceProps.labels[source].label
            ) : (
              <a
                {...trackedLinkProps(getPkgUrl(source.package, npmSite))}
                target="_blank"
                rel="noopener noreferrer"
              >
                <code className="language-text">{source.package}</code>
              </a>
            )}
          </dd>
        </div>
        {standardJsonSchema && (
          <div>
            <dt>Standard JSON Schema</dt>
            <dd>
              {typeof standardJsonSchema === "string" ? (
                jsonSourceProps.labels[standardJsonSchema].label
              ) : (
                <a
                  {...trackedLinkProps(getPkgUrl(standardJsonSchema.package, npmSite))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <code className="language-text">{standardJsonSchema.package}</code>
                </a>
              )}
            </dd>
          </div>
        )}
      </dl>
      {jsonSchemaConversionTargetSchema.options.map((target) => (
        <section
          key={`${library}-${target}`}
          {...cls("section")}
          aria-labelledby={`${library}-${target}-subheader`}
        >
          <h3
            id={`${library}-${target}-subheader`}
            {...cls({ element: "subheader", extra: "typo-body2" })}
          >
            {jsonSchemaConversionTargetProps.labels[target].label}
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
