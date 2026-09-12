import * as path from "node:path";

import type { TypeInferenceBenchmarkConfig } from "@schema-benchmarks/schemas";
import { describe, expect, it } from "vitest";

import { probeTypes, SCHEMAS_DIR } from "#src/scripts/types/probe.ts";

const probe = (library: string, fromType: TypeInferenceBenchmarkConfig["fromType"]) =>
  probeTypes(path.join(SCHEMAS_DIR, "libraries", library), {
    imports: "",
    schema: "",
    noInference: "measuring the from-type cases only",
    fromType,
  }).fromType;

describe("building a schema from an existing type", () => {
  it("rejects every disagreement when the type is checked for equality", () => {
    expect(
      probe("sury", {
        style: "builder",
        schema: `import * as S from "sury";
const probeSchema = S.schemaOf<Product>()({ id: S.number, name: S.string, price: S.number });`,
      })?.cases,
    ).toEqual({
      wrongType: true,
      missingField: true,
      optionalField: true,
      extraField: true,
    });
  });

  it("takes a schema the type never described when the check is assignability", () => {
    expect(
      probe("valibot", {
        style: "annotation",
        schema: `import * as v from "valibot";
const probeSchema: v.GenericSchema<Product> = v.object({ id: v.number(), name: v.string(), price: v.number() });`,
      })?.cases,
    ).toEqual({
      wrongType: true,
      missingField: true,
      // a schema requiring a field the type makes optional, or declaring one it never had, is
      // assignable to the annotation and builds a schema that disagrees with the type
      optionalField: false,
      extraField: false,
    });
  });

  it("counts a schema generated from the type as rejecting all of them", () => {
    expect(
      probe("typia", {
        style: "builder",
        schema: `import typia from "typia";
const probeSchema = typia.createAssert<Product>();`,
        derived: true,
      })?.cases,
    ).toEqual({
      wrongType: true,
      missingField: true,
      optionalField: true,
      extraField: true,
    });
  });

  it("fails loudly when the schema itself doesn't compile", () => {
    expect(() =>
      probe("sury", {
        style: "builder",
        schema: `import * as S from "sury";
const probeSchema = S.schemaOf<Product>()({ id: S.number, name: S.string });`,
      }),
    ).toThrow(/from-type probe does not type check/);
  });
});
