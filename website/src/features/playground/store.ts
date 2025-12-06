import type { DataType } from "@schema-benchmarks/bench";
import type {
  BenchmarksConfig,
  ErrorType,
  InitializationBenchmarkConfig,
  ParsingBenchmarkConfig,
  ValidationBenchmarkConfig,
} from "@schema-benchmarks/schemas";
import { ensureArray, type Override } from "@schema-benchmarks/utils";
import { createRequiredContext } from "required-react-context";
import * as broadcast from "@/features/broadcast/channel";
import { ExternalStore, useExternalStore } from "@/hooks/store";

interface PlaygroundEntryFields {
  id: string;
  result?: { mean: number; error?: never } | { error: string; mean?: never };
}

interface PlaygroundState<Context> {
  running: boolean;
  currentTask: string | null;
  dataType: DataType;
  typesById: Record<string, "initialization" | "validation" | "parsing">;
  initialization: Record<
    string,
    Override<InitializationBenchmarkConfig<Context>, PlaygroundEntryFields>
  >;
  validation: Record<
    string,
    Override<ValidationBenchmarkConfig<Context>, PlaygroundEntryFields>
  >;
  parsing: Record<
    string,
    Override<
      ParsingBenchmarkConfig<Context>,
      PlaygroundEntryFields & { errorType: ErrorType }
    >
  >;
}

export class PlaygroundStore<Context> extends ExternalStore<
  PlaygroundState<Context>
> {
  constructor(public config: BenchmarksConfig<Context>) {
    const initialState: PlaygroundState<Context> = {
      running: false,
      currentTask: null,
      dataType: "valid",
      typesById: {},
      initialization: {},
      validation: {},
      parsing: {},
    };
    for (const entry of ensureArray(config.initialization)) {
      const id = crypto.randomUUID();
      initialState.initialization[id] = {
        ...entry,
        id,
      };
      initialState.typesById[id] = "initialization";
    }
    for (const entry of ensureArray(config.validation ?? [])) {
      const id = crypto.randomUUID();
      initialState.validation[id] = {
        ...entry,
        id,
      };
      initialState.typesById[id] = "validation";
    }
    for (const entry of ensureArray(config.parsing?.allErrors ?? [])) {
      const id = crypto.randomUUID();
      initialState.parsing[id] = {
        ...entry,
        id,
        errorType: "allErrors",
      };
      initialState.typesById[id] = "parsing";
    }
    for (const entry of ensureArray(config.parsing?.abortEarly ?? [])) {
      const id = crypto.randomUUID();
      initialState.parsing[id] = {
        ...entry,
        id,
        errorType: "abortEarly",
      };
      initialState.typesById[id] = "parsing";
    }
    super(initialState);
  }
  selectById(state: PlaygroundState<Context>, id: string) {
    const type = state.typesById[id];
    return type && state[type][id];
  }

  async run() {
    if (this.state.running) return;
    broadcast.client.postMessage("benchmark", {
      library: this.config.library.name,
      dataType: this.state.dataType,
      initialization: Object.fromEntries(
        Object.entries(this.state.initialization).map(([id, entry]) => [
          broadcast.getTaskSlug(this.config.library.name, entry),
          id,
        ]),
      ),
      validation: Object.fromEntries(
        Object.entries(this.state.validation).map(([id, entry]) => [
          broadcast.getTaskSlug(this.config.library.name, entry),
          id,
        ]),
      ),
      parsing: Object.fromEntries(
        Object.entries(this.state.parsing).map(([id, entry]) => [
          broadcast.getTaskSlug(this.config.library.name, entry),
          id,
        ]),
      ),
    });

    this.setState((state) => {
      state.running = true;
    });
    const $results = broadcast.client.when("complete").map((payload) => {
      if (payload.type === "fail") throw payload.error;
      return payload.payload;
    });
    broadcast.client
      .when("cycle")
      .takeUntil($results)
      .subscribe((event) => {
        this.setState((state) => {
          state.currentTask = event.task;
        });
      });
    await $results
      .first()
      .then((results) => {
        this.setState((state) => {
          for (const [id, result] of Object.entries(results)) {
            const entry = this.selectById(state, id);
            if (!entry) continue;
            entry.result = result;
          }
        });
      })
      .finally(() => {
        this.setState((state) => {
          state.running = false;
          state.currentTask = null;
        });
      });
  }
}

export const { usePlaygroundStore, PlaygroundStoreProvider } =
  createRequiredContext<PlaygroundStore<unknown>>().with({
    name: "playgroundStore",
  });

export const usePlaygroundSelector = <TSelected>(
  selector: (state: PlaygroundState<unknown>) => TSelected,
): TSelected => useExternalStore(usePlaygroundStore(), selector);
