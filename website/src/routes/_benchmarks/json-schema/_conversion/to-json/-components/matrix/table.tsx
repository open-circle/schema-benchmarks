import type { JsonSchemaSupportMatrices } from "@schema-benchmarks/bench";
import { jsonSchemaDirectionSchema, jsonSchemaTargetSchema } from "@schema-benchmarks/schemas";
import clsx from "clsx";

import {
  jsonSchemaDirectionProps,
  jsonSchemaTargetProps,
} from "#src/routes/_benchmarks/json-schema/_conversion/-constants";
import { standardJsonSchemaProps } from "#src/routes/_benchmarks/json-schema/_conversion/-constants";

import { MatrixCheckbox } from "./checkbox";

export interface MatrixTableProps {
  matrix: JsonSchemaSupportMatrices;
}

export function MatrixTable({ matrix }: MatrixTableProps) {
  return (
    <table aria-label="Support Matrix">
      <thead>
        <tr>
          <th colSpan={3} aria-hidden></th>
          {jsonSchemaTargetSchema.options.map((target) => (
            <th
              key={target}
              colSpan={jsonSchemaDirectionSchema.options.length}
              className={clsx("action", "border-before")}
            >
              {jsonSchemaTargetProps.labels[target].label}
            </th>
          ))}
        </tr>
        <tr>
          <th>Library</th>
          <th>Version</th>
          <th>Standard JSON Schema</th>
          {jsonSchemaTargetSchema.options.flatMap((target) =>
            jsonSchemaDirectionSchema.options.map((direction, i) => (
              <th
                key={`${target}-${direction}`}
                className={clsx("action", { "border-before": i === 0 })}
              >
                {jsonSchemaDirectionProps.labels[direction].label}
              </th>
            )),
          )}
        </tr>
      </thead>
      <tbody>
        {Object.entries(matrix).map(
          ([library, { version, matrix: supportMatrix, standardJsonSchema }]) => (
            <tr key={library}>
              <td>
                <code className="language-text">{library}</code>
              </td>
              <td>
                <code className="language-text">{version}</code>
              </td>
              <td>
                {standardJsonSchema &&
                  (typeof standardJsonSchema === "string" ? (
                    standardJsonSchemaProps.labels[standardJsonSchema].label
                  ) : (
                    <code className="language-text">{standardJsonSchema.package}</code>
                  ))}
              </td>
              {jsonSchemaTargetSchema.options.flatMap((target) =>
                jsonSchemaDirectionSchema.options.map((direction, i) => (
                  <td
                    key={`${library}-${target}-${direction}`}
                    className={clsx("action", { "border-before": i === 0 })}
                  >
                    <MatrixCheckbox reason={supportMatrix?.[target]?.[direction]} />
                  </td>
                )),
              )}
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
}
