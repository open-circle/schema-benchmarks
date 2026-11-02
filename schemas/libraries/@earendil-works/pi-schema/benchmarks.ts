import { compile } from "@earendil-works/pi-schema";
import remotes from "@schema-benchmarks/json-schema-tests/remotes";
import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import { defineBenchmarks } from "#src";

export default defineBenchmarks({
  library: {
    name: "@earendil-works/pi-schema",
    optimizeType: "none",
    version: await getVersion("@earendil-works/pi-schema"),
  },
  jsonSchema: {
    compliance: {
      validation: {
        run(schema, data, { target }) {
          const draft =
            target === "draft7"
              ? ("7" as const)
              : target === "draft2020-12"
                ? ("2020-12" as const)
                : undefined;
          const compiled = compile(schema, { schemas: remotes, draft });
          return compiled.check(data);
        },
        source: { type: "native" },
        snippet: () => ts`
          const compiled = compile(schema, { schemas: remotes, draft });
          return compiled.check(data);
        `,
      },
    },
  },
});
