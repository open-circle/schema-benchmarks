import type { AllowWarnDeny } from "vite-plus/lint";

export interface NavigationAssertionTimeout {
  name: string;
  /** Zero-based index of the options argument. */
  index: number;
  timeout?: number;
}

export type NavigationAssertionTimeoutConfig = Array<NavigationAssertionTimeout>;

declare module "vite-plus/lint" {
  interface DummyRuleMap {
    "website-lint/require-navigation-assertion-timeout"?: [
      AllowWarnDeny,
      NavigationAssertionTimeoutConfig,
    ];
  }
}
