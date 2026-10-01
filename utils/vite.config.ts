import { defineConfig } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["**/*.test.ts", "**/*.test.tsx", "**/*.test-d.ts", "**/*.test-d.tsx"],
    },
    projects: [
      {
        test: {
          name: "node",
          include: ["**/*.node.test.ts"],
          setupFiles: ["./test/common/setup.ts"],
        },
      },
      {
        test: {
          name: "browser",
          include: ["**/*.browser.test.ts", "**/*.browser.test.tsx"],
          browser: {
            enabled: true,
            traceView: true,
            provider: playwright({
              launchOptions: {
                channel: "chromium",
              },
            }),
            // https://vitest.dev/guide/browser/playwright
            instances: [{ browser: "chromium" }],
            headless: !!process.env.CI,
          },
          setupFiles: ["./test/common/setup.ts"],
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
