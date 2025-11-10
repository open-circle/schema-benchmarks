# Schema Benchmarks - Benchmarking suite

This package contains the benchmarking suite for the schema benchmarks.

## Adding a new schema library

To add a new schema library, you need to do the following:

_The following examples will use "valizod" as an example name, replace it with the name of your library._

### Install the library

```bash
pnpm --filter "*/bench" add valizod
```

### Create a `getSchema` function

Create a new file in `schemas` named `<library>.ts` with the following content:

```ts
// valizod.ts
import type { ProductData } from "@schema-benchmarks/data";
import * as vz from "valizod";

export function getValizodSchema() {
  return vz.object({
    // ...
  }) satisfies vz.Schema<ProductData>;
}
```

Take a look at the other `getSchema` functions for a guide on what validation should be included.

### Add the library to the initialization benchmark

Import the `getSchema` function in `initialization.bench.ts` and add the following code:

```ts
import { getValizodSchema } from "./schemas/valizod";

// ...

bench("valizod", () => {
  getValizodSchema();
});
```

If the schema library involves precompilation (i.e. during build time), add this benchmark to the `precompiled` describe block instead of the `runtime` block.

### Add the library to the validation and parsing benchmarks

Import the `getSchema` function in `validation.bench.ts` and `parsing.bench.ts` and add it, depending on the type of library. Make sure that the initialization of the schema is done outside the benchmark, but the validation is done inside the benchmark.

`validation.bench.ts` benchmarks methods that only return a boolean, while `parsing.bench.ts` benchmarks methods that return a new value. If the library doesn't have a dedicated validation method, only add it to the `parsing.bench.ts` file (and vice versa).

```ts
// parsing.bench.ts
import { getValizodSchema } from "./schemas/valizod";

// ...

const valizodSchema = getValizodSchema();
bench("valizod", () => {
  valizodSchema.safeParse(data);
});
```

```ts
// validation.bench.ts
import { getValizodSchema } from "./schemas/valizod";

// ...

const valizodSchema = getValizodSchema();
bench("valizod", () => {
  valizodSchema.is(data);
});
```

#### Abort early

Some libraries support aborting early, which means that the validation/parsing will stop as soon as an error is found. If the library supports configuration of this behaviour, add a benchmark to both the regular and the `abort early` describe block.

```ts
import { getValizodSchema } from "./schemas/valizod";

// ...

const valizodSchema = getValizodSchema();
bench("valizod", () => {
  valizodSchema.safeParse(data, { abortEarly: false });
});

describe("abort early", () => {
  bench("valizod", () => {
    valizodSchema.safeParse(data, { abortEarly: true });
  });
});
```

If the library **only** supports aborting early, only add the benchmark to the `abort early` describe block.

```ts
import { getValizodSchema } from "./schemas/valizod";

// ...

describe("abort early", () => {
  const valizodSchema = getValizodSchema();
  bench("valizod", () => {
    valizodSchema.safeParse(data);
  });
});
```

`validation.bench.ts` does not make this distinction, as it is assumed that validation methods will always abort early (if this is not the case by default, feel free to configure the library so that it does).
