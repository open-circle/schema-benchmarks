import { describe, expect, it, vi } from "vitest";

import remotes from "#constants/remotes.gen.ts";

import { getTargetCompliance, getTestCases } from "./tests.ts";
import type { ComplianceResults } from "./types.ts";
import { type ComplianceTarget, type TestCase } from "./types.ts";

describe("JSON Schema Test Suite", () => {
  it("discovers the remote reference suite", async () => {
    const testCaseFiles: Array<string> = [];

    for await (const [file] of getTestCases("draft3")) {
      testCaseFiles.push(file);
    }

    expect(testCaseFiles).toContain("refRemote");
    expect(testCaseFiles).toContain("optional/non-bmp-regex");

    const nestedTestCaseFiles: Array<string> = [];
    for await (const [file] of getTestCases("draft2020-12")) {
      nestedTestCaseFiles.push(file);
    }

    expect(nestedTestCaseFiles).toContain("optional/format/unknown");
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
        "optional/second",
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
          {
            description: "matching optional validator",
            schema: { outcome: "true" },
            tests: [{ description: "matching optional validator", data: null, valid: true }],
          },
          {
            description: "mismatching optional validator",
            schema: { outcome: "true" },
            tests: [{ description: "mismatching optional validator", data: null, valid: false }],
          },
          {
            description: "empty test group",
            schema: { outcome: "true" },
            tests: [],
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

    expect(results).toEqual<ComplianceResults>({
      count: { passed: 3, failed: 4 },
      byType: {
        spec: { passed: 2, failed: 1 },
        optional: { passed: 1, failed: 3 },
      },
      files: {
        first: { count: { passed: 2, failed: 1 } },
        "optional/second": { count: { passed: 1, failed: 3 } },
      },
    });
  });

  it("logs validator errors when logging is enabled", async () => {
    using consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const results = await getTargetCompliance(
      "draft3",
      async () => {
        throw new Error("validator failure");
      },
      true,
      async function* () {
        yield [
          "logged",
          [
            {
              description: "logged failure",
              schema: true,
              tests: [{ description: "logged failure", data: null, valid: true }],
            },
          ],
        ] as const;
      },
    );

    expect(results.count.failed).toBe(1);
    expect(consoleError).toHaveBeenCalledWith(
      "Error running compliance function for logged",
      expect.any(Error),
    );
  });
});
