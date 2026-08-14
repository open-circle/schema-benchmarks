import type { SchemaDraft } from "@cfworker/json-schema";
import { Validator } from "@cfworker/json-schema";
import remotes from "@schema-benchmarks/json-schema-tests/remotes";
import type { ComplianceTarget } from "@schema-benchmarks/json-schema-tests/types";
import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import { defineBenchmarks } from "#src";

const targets: Partial<Record<ComplianceTarget, SchemaDraft>> = {
  "draft2019-09": "2019-09",
  "draft2020-12": "2020-12",
  draft4: "4",
  draft7: "7",
};

export default defineBenchmarks({
  library: {
    name: "@cfworker/json-schema",
    optimizeType: "none",
    version: await getVersion("@cfworker/json-schema"),
  },
  jsonSchema: {
    compliance: {
      validation: {
        run(schema, data, { target }) {
          const validator = new Validator(schema, targets[target]);
          for (const [uri, remoteSchema] of Object.entries(remotes)) {
            validator.addSchema(remoteSchema as {}, uri);
          }
          return validator.validate(data).valid;
        },
        source: { type: "native" },
        snippet: (target) => ts`
          const validator = new Validator(schema${targets[target] ? `, "${targets[target]}"` : ""});
          for (const [uri, remoteSchema] of Object.entries(remotes)) {
            validator.addSchema(remoteSchema, uri);
          }
          return validator.validate(data).valid;
        `,
      },
    },
  },
});
