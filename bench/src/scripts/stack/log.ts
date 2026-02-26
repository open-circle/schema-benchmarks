import { parseArgs } from "node:util";

import { assertNotReached, errorData } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";

const {
  values: { lib },
} = parseArgs({
  options: {
    lib: {
      type: "string",
      short: "l",
    },
  },
});

if (!lib || !libraries[lib]) {
  throw new Error(`Library not found: ${lib}`);
}

const config = await libraries[lib]();

try {
  await config.stack?.throw(await config.createContext(), errorData);
  assertNotReached();
} catch (e) {
  if (Error.isError(e) && e.name === "ShouldHaveThrownError") {
    throw e;
  }
  // log the coloured output
  console.error(e);
}
