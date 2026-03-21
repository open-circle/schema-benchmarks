import { EmptyState } from "#/shared/components/empty-state";
import { MdSymbol } from "#/shared/components/symbol";

import WifiOff from "./wifi_off.svg?react";

export default function Root() {
  return (
    <div className="offline">
      <header>
        <picture>
          <source media="(prefers-color-scheme: dark)" srcSet="/logo_dark.svg" />
          <source media="(prefers-color-scheme: light)" srcSet="/logo_light.svg" />
          <img src="/logo_system.svg" alt="Logo" />
        </picture>
        <h1>Schema Benchmarks</h1>
      </header>
      <EmptyState
        icon={
          <MdSymbol>
            <WifiOff fill="currentColor" width="1em" height="1em" />
          </MdSymbol>
        }
        title="You're offline"
        subtitle="This page is not available without a network connection."
      />
    </div>
  );
}
