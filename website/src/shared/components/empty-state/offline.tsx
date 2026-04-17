import { EmptyState } from ".";
import { MdSymbol } from "../symbol";

export function isOfflineError(err: Error) {
  return !navigator.onLine || err.message.includes("Failed to fetch") || err.name === "AbortError";
}

export function Offline() {
  return (
    <EmptyState
      icon={<MdSymbol>signal_wifi_off</MdSymbol>}
      title="You are offline"
      subtitle="You can still view cached pages, but won't be able to fetch new data."
    />
  );
}
