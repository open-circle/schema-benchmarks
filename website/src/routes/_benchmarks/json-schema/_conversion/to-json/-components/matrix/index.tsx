import type { JsonSchemaSupportMatrices } from "@schema-benchmarks/bench";
import { jsonSchemaDirectionSchema, jsonSchemaTargetSchema } from "@schema-benchmarks/schemas";
import clsx from "clsx";

import {
  jsonSchemaDirectionProps,
  jsonSchemaTargetProps,
} from "#src/routes/_benchmarks/json-schema/_conversion/-constants";
import { Checkbox } from "#src/shared/components/checkbox/index.tsx";

export function SupportMatrix({ matrix }: { matrix: JsonSchemaSupportMatrices }) {
  return (
    <table aria-label="Support Matrix">
      <thead>
        <tr>
          <th colSpan={2} aria-hidden></th>
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
        {Object.entries(matrix).map(([library, { version, matrix: supportMatrix }]) => (
          <tr key={library}>
            <td>
              <code className="language-text">{library}</code>
            </td>
            <td>
              <code className="language-text">{version}</code>
            </td>
            {jsonSchemaTargetSchema.options.flatMap((target) =>
              jsonSchemaDirectionSchema.options.map((direction, i) => (
                <td
                  key={`${library}-${target}-${direction}`}
                  className={clsx("action", { "border-before": i === 0 })}
                >
                  <Checkbox checked={!!supportMatrix?.[target]?.[direction]} readOnly />
                </td>
              )),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
