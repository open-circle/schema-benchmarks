import { describe, expect, it } from "vitest";

import remotes from "#constants/remotes.gen.ts";

import { getTestCases } from "./tests.ts";

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
});
