import { describe, expect, it } from "vitest";

import { getTargetCompliance, getTestCases } from "./tests.ts";

describe("JSON Schema Test Suite", () => {
  it("discovers the remote reference suite", async () => {
    const testCaseFiles: Array<string> = [];

    for await (const [file] of getTestCases("draft3")) {
      testCaseFiles.push(file);
    }

    expect(testCaseFiles).toContain("refRemote");
  });

  it("provides remote fixtures to compliance callbacks", async () => {
    const contexts = new Set<object>();
    let remoteSchema: {} | boolean | undefined;

    const results = await getTargetCompliance("draft3", (_schema, _data, context) => {
      contexts.add(context);
      remoteSchema = context.remotes["http://localhost:1234/integer.json"];
      return false;
    });

    expect(results.count.passed + results.count.failed).toBeGreaterThan(0);
    expect(contexts.size).toBe(1);
    expect(remoteSchema).toEqual({ type: "integer" });
  });
});
