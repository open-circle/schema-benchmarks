import type { JsonSchemaSupportResult } from "@schema-benchmarks/bench";
import { jsonSchemaDirectionSchema, jsonSchemaTargetSchema } from "@schema-benchmarks/schemas";
import { collator, getTransitionName } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { clsx } from "clsx";
import { useMemo } from "react";

import {
  jsonSchemaDirectionProps,
  jsonSchemaSourceProps,
  standardJsonSchemaProps,
  jsonSchemaTargetProps,
} from "#src/routes/_benchmarks/json-schema/conversion/-constants";
import { getJsonSchemaBenchResults } from "#src/routes/_benchmarks/json-schema/conversion/-query.ts";
import { ToggleButton } from "#src/shared/components/button/toggle";
import { MdSymbol } from "#src/shared/components/symbol";

const combinations = jsonSchemaTargetSchema.options.flatMap((target) =>
  jsonSchemaDirectionSchema.options.map((direction) => ({ target, direction })),
);
const [firstDirection] = jsonSchemaDirectionSchema.options;

const getLabel = ({ libraryName, note }: JsonSchemaSupportResult) =>
  `${libraryName}${note ? ` (${note})` : ""}`;

/**
 * Which targets and directions each library can convert. A library that refuses a combination
 * has no result to compare, so this is the only place it shows up.
 */
export function SupportMatrix() {
  const { data } = useSuspenseQuery({
    ...getJsonSchemaBenchResults(),
    select: (results) => results.support,
  });
  const sorted = useMemo(
    () => data.toSorted((a, b) => collator.compare(getLabel(a), getLabel(b))),
    [data],
  );
  return (
    <div className="support-matrix-container">
      <table
        className="support-matrix"
        aria-label="Support"
        style={{ viewTransitionName: "json-schema-matrix" }}
      >
        <thead>
          <tr>
            {/* oxlint-disable-next-line jsx-a11y/control-has-associated-label */}
            <th colSpan={3} />
            {jsonSchemaTargetSchema.options.map((target) => (
              <th
                key={target}
                colSpan={jsonSchemaDirectionSchema.options.length}
                className="fit-content border-before"
              >
                {jsonSchemaTargetProps.labels[target].label}
              </th>
            ))}
          </tr>
          <tr>
            <th>Library</th>
            <th>Source</th>
            <th>Standard JSON Schema</th>
            {combinations.map(({ target, direction }) => (
              <th
                key={`${target}-${direction}`}
                className={clsx("fit-content", direction === firstDirection && "border-before")}
              >
                {jsonSchemaDirectionProps.labels[direction].label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((result) => (
            <tr
              key={result.id}
              style={{
                viewTransitionName: getTransitionName("json-schema-matrix-row", {
                  libraryName: result.libraryName,
                  note: result.note,
                }),
              }}
            >
              <td>
                <code className="language-text">{result.libraryName}</code>
                {result.note ? ` (${result.note})` : null}
              </td>
              <td>{jsonSchemaSourceProps.labels[result.source].label}</td>
              <td>
                {result.standardJsonSchema !== "none" &&
                  standardJsonSchemaProps.labels[result.standardJsonSchema].label}
              </td>
              {combinations.map(({ target, direction }) => {
                const unsupported = result.unsupported.find(
                  (entry) => entry.target === target && entry.direction === direction,
                );
                const label = `${jsonSchemaTargetProps.labels[target].label}, ${jsonSchemaDirectionProps.labels[direction].label}`;
                return (
                  <td
                    key={`${target}-${direction}`}
                    className={clsx("fit-content", direction === firstDirection && "border-before")}
                  >
                    {unsupported ? (
                      <ToggleButton
                        tooltip={{
                          subhead: `${label} is not supported`,
                          supporting: <div style={{ maxWidth: "16rem" }}>{unsupported.reason}</div>,
                        }}
                      >
                        <MdSymbol>close</MdSymbol>
                      </ToggleButton>
                    ) : (
                      <MdSymbol aria-label={`${label} is supported`}>check</MdSymbol>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
