import type { DataType } from "@schema-benchmarks/bench";
import type {
  BenchmarksConfig,
  ErrorType,
  InitializationBenchmarkConfig,
  ParsingBenchmarkConfig,
  ValidationBenchmarkConfig,
} from "@schema-benchmarks/schemas";
import { errorData, successData } from "@schema-benchmarks/schemas";
import { ensureArray, type Override } from "@schema-benchmarks/utils";
import { createRequiredContext } from "required-react-context";
import { Bench, type TaskResult } from "tinybench";
import { ExternalStore, useExternalStore } from "@/hooks/store";

interface PlaygroundEntryFields {
  id: string;
  enabled?: boolean;
  result?: TaskResult;
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

export const selectById = <Context>(
  state: PlaygroundState<Context>,
  id: string,
) => {
  const type = state.typesById[id];
  if (!type) return undefined;
  return state[type][id];
};

export class PlaygroundStore<Context> extends ExternalStore<
  PlaygroundState<Context>
> {
  createBench() {
    const bench = new Bench();
    bench.addEventListener("cycle", (event) => {
      this.setState((state) => {
        state.currentTask = event.task?.name ?? null;
      });
    });
    bench.addEventListener("complete", () => {
      this.setState((state) => {
        state.running = false;
        state.currentTask = null;
        for (const task of bench.tasks) {
          const entry = selectById(this.state, task.name);
          if (!entry) continue;
          entry.result = task.result;
        }
      });
    });

    return bench;
  }

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
        enabled: true,
      };
      initialState.typesById[id] = "initialization";
    }
    for (const entry of ensureArray(config.validation ?? [])) {
      const id = crypto.randomUUID();
      initialState.validation[id] = {
        ...entry,
        id,
        enabled: true,
      };
      initialState.typesById[id] = "validation";
    }
    for (const entry of ensureArray(config.parsing?.allErrors ?? [])) {
      const id = crypto.randomUUID();
      initialState.parsing[id] = {
        ...entry,
        id,
        enabled: true,
        errorType: "allErrors",
      };
      initialState.typesById[id] = "parsing";
    }
    for (const entry of ensureArray(config.parsing?.abortEarly ?? [])) {
      const id = crypto.randomUUID();
      initialState.parsing[id] = {
        ...entry,
        id,
        enabled: true,
        errorType: "abortEarly",
      };
      initialState.typesById[id] = "parsing";
    }
    super(initialState);
  }
  setEnabled(id: string, enabled: boolean) {
    this.setState((state) => {
      const entry = selectById(state, id);
      if (!entry) return;
      entry.enabled = enabled;
    });
  }
  async run() {
    if (this.state.running) return;
    const data = this.state.dataType === "valid" ? successData : errorData;
    const bench = this.createBench();
    this.setState((state) => {
      state.running = true;
    });
    const context = this.config.createContext();
    for (const entry of Object.values(this.state.initialization)) {
      if (!entry.enabled) continue;
      bench.add(entry.id, () => entry.run(context));
    }
    for (const entry of Object.values(this.state.validation)) {
      if (!entry.enabled) continue;
      bench.add(entry.id, () => entry.run(data, context));
    }
    for (const entry of Object.values(this.state.parsing)) {
      if (!entry.enabled) continue;
      bench.add(entry.id, () => entry.run(data, context));
    }
    return bench.run();
  }
}

export const { usePlaygroundStore, PlaygroundStoreProvider } =
  createRequiredContext<PlaygroundStore<unknown>>().with({
    name: "playgroundStore",
  });

export const usePlaygroundSelector = <TSelected>(
  selector: (state: PlaygroundState<unknown>) => TSelected,
): TSelected => useExternalStore(usePlaygroundStore(), selector);
