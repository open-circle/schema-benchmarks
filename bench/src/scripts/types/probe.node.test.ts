import * as path from "node:path";

import { describe, expect, it } from "vitest";

import { probeFromTypeText, probeInferenceText, SCHEMAS_DIR } from "#src/scripts/types/probe.ts";

const probeFile = (library: string) =>
  path.join(SCHEMAS_DIR, "libraries", library, "types", ".probe-test.ts");

const probeMatches = (shape: string) => {
  const inference = probeInferenceText(
    probeFile("sury"),
    `export const schema = 0 as unknown as ${shape};
export type Input = typeof schema;
export type Output = typeof schema;
`,
  );
  return { input: inference.input.match, output: inference.output.match };
};

const probeFromType = (library: string, text: string) =>
  probeFromTypeText(probeFile(library), text);

describe("building a schema from an existing type", () => {
  it("rejects every disagreement when the type is checked for equality", () => {
    expect(
      probeFromType(
        "sury",
        `import type { FromTypeStyle, JsonSchemaOutputData } from "#src";
import * as S from "sury";

export const style: FromTypeStyle = "builder";

export const schema = S.schemaOf<JsonSchemaOutputData>()({ id: S.number, name: S.string, price: S.number });
`,
      ).cases,
    ).toEqual({
      wrongType: true,
      missingField: true,
      optionalField: true,
      extraField: true,
    });
  });

  it("takes a schema the type never described when the check is assignability", () => {
    expect(
      probeFromType(
        "valibot",
        `import type { JsonSchemaOutputData } from "#src";
import * as v from "valibot";

export const style = "annotation";

export const schema: v.GenericSchema<JsonSchemaOutputData> = v.object({ id: v.number(), name: v.string(), price: v.number() });
`,
      ).cases,
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
      probeFromType(
        "typia",
        `import type { JsonSchemaOutputData } from "#src";
import typia from "typia";

export const style = "builder";

export const derived = true;

export const schema = typia.createAssert<JsonSchemaOutputData>();
`,
      ).cases,
    ).toEqual({
      wrongType: true,
      missingField: true,
      optionalField: true,
      extraField: true,
    });
  });

  it("fails loudly when the schema itself doesn't compile", () => {
    expect(() =>
      probeFromType(
        "sury",
        `import type { JsonSchemaOutputData } from "#src";
import * as S from "sury";

export const style = "builder";

export const schema = S.schemaOf<JsonSchemaOutputData>()({ id: S.number, name: S.string });
`,
      ),
    ).toThrow(/from-type probe does not type check/);
  });
});

describe("judging an inferred type", () => {
  it("calls the data type itself exact", () => {
    expect(probeMatches("ProductData")).toEqual({ input: "exact", output: "exact" });
  });

  it("catches an `any` nested in an otherwise matching type", () => {
    // assignable to and from `ProductData` in both directions, so only a walk of the type finds it
    expect(probeMatches(`Omit<ProductData, "title"> & { title: any }`)).toEqual({
      input: "any",
      output: "any",
    });
  });
});
