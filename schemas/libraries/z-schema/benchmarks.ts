import remotes from "@schema-benchmarks/json-schema-tests/remotes";
import type { ComplianceTarget } from "@schema-benchmarks/json-schema-tests/types";
import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import ZSchema, { type JsonSchemaVersion } from "z-schema";

import { defineBenchmarks } from "#src";

const targets: Partial<Record<ComplianceTarget, JsonSchemaVersion>> = {
  "draft2019-09": "draft2019-09",
  "draft2020-12": "draft2020-12",
  draft4: "draft-04",
  draft6: "draft-06",
  draft7: "draft-07",
};

export default defineBenchmarks({
  library: {
    name: "z-schema",
    optimizeType: "none",
    version: await getVersion("z-schema"),
  },
  jsonSchema: {
    compliance: {
      validation: {
        run(schema, data, { target }) {
          if (typeof schema === "boolean")
            throw new Error("z-schema does not support boolean schemas");
          const validator = ZSchema.create({ safe: true, version: targets[target] });
          for (const [uri, remoteSchema] of Object.entries(remotes)) {
            validator.setRemoteReference(uri, remoteSchema);
          }
          return validator.validate(data, schema).valid;
        },
        source: { type: "native" },
        snippet: (target) => ts`
          const validator = ZSchema.create({ safe: true${targets[target] ? `, version: "${targets[target]}"` : ""} });
          for (const [uri, remoteSchema] of Object.entries(remotes)) {
            validator.setRemoteReference(uri, remoteSchema);
          }
          return validator.validate(data, schema).valid;
        `,
      },
    },
  },
});
