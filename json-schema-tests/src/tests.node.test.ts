import { describe, expect, it } from "vitest";

import remotes from "#constants/remotes.gen.ts";

import { getTargetCompliance, getTestCases } from "./tests.ts";
import type { ComplianceTarget, TestCase } from "./types.ts";

describe("JSON Schema Test Suite", () => {
  it("discovers the remote reference suite", async () => {
    const testCaseFiles: Array<string> = [];

    for await (const [file] of getTestCases("draft3")) {
      testCaseFiles.push(file);
    }

    expect(testCaseFiles).toContain("refRemote");
  });

  it("provides remote fixtures", () => {
    expect(remotes["http://localhost:1234/integer.json"]).toEqual({ type: "integer" });
  });

  it("accounts for validator outcomes at file and suite level", async () => {
    const fixtures: ReadonlyArray<readonly [string, Array<TestCase>]> = [
      [
        "first",
        [
          {
            description: "matching true",
            schema: { outcome: "true" },
            tests: [{ description: "matching true", data: null, valid: true }],
          },
          {
            description: "matching false",
            schema: { outcome: "false" },
            tests: [{ description: "matching false", data: null, valid: false }],
          },
          {
            description: "mismatching boolean",
            schema: { outcome: "true" },
            tests: [{ description: "mismatching boolean", data: null, valid: false }],
          },
        ],
      ],
      [
        "second",
        [
          {
            description: "validator errors",
            schema: { outcome: "throw" },
            tests: [{ description: "thrown validator", data: null, valid: true }],
          },
          {
            description: "rejected validator",
            schema: { outcome: "reject" },
            tests: [{ description: "rejected validator", data: null, valid: true }],
          },
        ],
      ],
    ];
    const getFixtureCases = async function* (_target: ComplianceTarget) {
      yield* fixtures;
    };

    const results = await getTargetCompliance(
      "draft3",
      async (schema) => {
        if (schema === true || typeof schema !== "object") {
          return false;
        }
        const fixture = schema as { outcome?: string };
        if (fixture.outcome === "throw") {
          throw new Error("validator failed");
        }
        if (fixture.outcome === "reject") {
          return Promise.reject(new Error("validator rejected"));
        }
        return fixture.outcome === "true";
      },
      false,
      getFixtureCases,
    );

    expect(results).toEqual({
      count: { passed: 2, failed: 3 },
      files: {
        first: { count: { passed: 2, failed: 1 } },
        second: { count: { passed: 0, failed: 2 } },
      },
    });
  });
});
