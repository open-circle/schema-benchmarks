import remotes from "@schema-benchmarks/json-schema-tests/remotes";
import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import { Validator } from "jsonschema";

import { defineBenchmarks } from "#src";

export default defineBenchmarks({
  library: {
    name: "jsonschema",
    optimizeType: "none",
    version: await getVersion("jsonschema"),
  },
  jsonSchema: {
    compliance: {
      validation: {
        run(schema, data) {
          if (typeof schema === "boolean")
            throw new Error("jsonschema does not support boolean schemas");
          const validator = new Validator();
          for (const [uri, remoteSchema] of Object.entries(remotes)) {
            validator.addSchema(remoteSchema as {}, uri);
          }
          return validator.validate(data, schema).valid;
        },
        source: { type: "native" },
        snippet: () => ts`
          const validator = new Validator();
          for (const [uri, remoteSchema] of Object.entries(remotes)) {
            validator.addSchema(remoteSchema, uri);
          }
          return validator.validate(data, schema).valid;
        `,
      },
    },
  },
});
