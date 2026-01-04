import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          include: ["**/*.node.test.ts"], // not tsx - if you're using React, test in the browser
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          include: ["**/*.browser.test.ts", "**/*.browser.test.tsx"],
          browser: {
            enabled: true,
            provider: playwright(),
            // https://vitest.dev/guide/browser/playwright
            instances: [{ browser: "chromium" }],
            headless: !!process.env.CI,
          },
        },
      },
      {
        test: {
          typecheck: {
            enabled: true,
            only: true,
            include: ["**/*.test-d.ts"],
          },
        },
      },
    ],
  },
});
