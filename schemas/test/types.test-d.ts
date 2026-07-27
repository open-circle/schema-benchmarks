import type {
  JsonSchemaBenchmarkConfig,
  JsonSchemaTarget,
  StandardJsonSchemaSupport,
} from "@schema-benchmarks/schemas";
import { assertJsonSchemaTarget, defineBenchmarks } from "@schema-benchmarks/schemas";
import { describe, expectTypeOf, it } from "vitest";

describe("assertJsonSchemaTarget", () => {
  it("should narrow to the supported targets", () => {
    const target = "draft-07" as JsonSchemaTarget;
    assertJsonSchemaTarget(target, ["draft-2020-12", "draft-07"]);
    expectTypeOf(target).toEqualTypeOf<"draft-2020-12" | "draft-07">();
  });
});

describe("JsonSchemaBenchmarkConfig", () => {
  it("should type generate and snippet by target and direction", () => {
    expectTypeOf<JsonSchemaBenchmarkConfig["generate"]>().parameter(0).toEqualTypeOf<{
      target: JsonSchemaTarget;
      direction: "input" | "output";
    }>();
    expectTypeOf<JsonSchemaBenchmarkConfig["snippet"]>().returns.toBeString();
  });

  it("should not let a library claim no standard support and provide a schema", () => {
    expectTypeOf<
      NonNullable<JsonSchemaBenchmarkConfig["standardJsonSchema"]>["support"]
    >().toEqualTypeOf<Exclude<StandardJsonSchemaSupport, "none">>();
  });

  it("should require a source", () => {
    // @ts-expect-error - source says whether the case is timed, so it can't be left out
    defineBenchmarks({
      library: { name: "test", optimizeType: "none", version: "0.0.0" },
      initialization: { run: () => ({}), snippet: "" },
      jsonSchema: { generate: () => ({}), snippet: () => "" },
    });
  });
});
