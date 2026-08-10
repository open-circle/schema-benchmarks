import type { JsonSchemaSupportMatrices } from "@schema-benchmarks/bench";
import {
  jsonSchemaDirectionSchema,
  jsonSchemaConversionTargetSchema,
} from "@schema-benchmarks/schemas";
import clsx from "clsx";

import { JsonSchemaPackageButton } from "#src/routes/json-schema/-components/source.tsx";
import {
  jsonSchemaDirectionProps,
  jsonSchemaConversionTargetProps,
} from "#src/routes/json-schema/_conversion/-constants";
import { jsonSourceProps } from "#src/routes/json-schema/_conversion/-constants";

import { MatrixCheckbox } from "./checkbox";

export interface MatrixTableProps {
  matrix: JsonSchemaSupportMatrices;
}

export function MatrixTable({ matrix }: MatrixTableProps) {
  return (
    <table aria-label="Support Matrix">
      <thead>
        <tr>
          <th colSpan={6} aria-hidden></th>
          {jsonSchemaConversionTargetSchema.options.map((target) => (
            <th
              key={target}
              colSpan={jsonSchemaDirectionSchema.options.length}
              className={clsx("action", "border-before")}
            >
              {jsonSchemaConversionTargetProps.labels[target].label}
            </th>
          ))}
        </tr>
        <tr>
          <th>Library</th>
          <th>Version</th>
          <th>Source</th>
          <th className="action" aria-label="Source packages"></th>
          <th>Standard JSON Schema</th>
          <th className="action" aria-label="Standard JSON Schema packages"></th>
          {jsonSchemaConversionTargetSchema.options.flatMap((target) =>
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
          ([library, { version, matrix, standardJsonSchema, source }]) => {
            const sourceType = typeof source === "string" ? source : source.type;
            const standardJsonSchemaType =
              typeof standardJsonSchema === "string"
                ? standardJsonSchema
                : standardJsonSchema?.type;
            return (
              <tr key={library}>
                <td>
                  <code className="language-text">{library}</code>
                </td>
                <td>
                  <code className="language-text">{version}</code>
                </td>
                <td>{jsonSourceProps.labels[sourceType].label}</td>
                <td className="action">
                  {typeof source === "object" && <JsonSchemaPackageButton {...source} />}
                </td>
                <td>
                  {!!standardJsonSchemaType && jsonSourceProps.labels[standardJsonSchemaType].label}
                </td>
                <td className="action">
                  {typeof standardJsonSchema === "object" && (
                    <JsonSchemaPackageButton {...standardJsonSchema} />
                  )}
                </td>
                {jsonSchemaConversionTargetSchema.options.flatMap((target) =>
                  jsonSchemaDirectionSchema.options.map((direction, i) => (
                    <td
                      key={`${library}-${target}-${direction}`}
                      className={clsx("action", { "border-before": i === 0 })}
                    >
                      <MatrixCheckbox reason={matrix?.[target]?.[direction]} />
                    </td>
                  )),
                )}
              </tr>
            );
          },
        )}
      </tbody>
    </table>
  );
}
