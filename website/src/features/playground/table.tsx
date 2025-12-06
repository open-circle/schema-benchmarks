import {
  durationFormatter,
  getDuration,
  partialMatch,
} from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/spinner";
import { getBenchResults } from "../benchmark/query";
import { usePlaygroundSelector, usePlaygroundStore } from "./store";

export function PlaygroundTable() {
  const { data } = useSuspenseQuery(getBenchResults());
  const store = usePlaygroundStore();
  const initialization = usePlaygroundSelector((state) => state.initialization);
  const validation = usePlaygroundSelector((state) => state.validation);
  const parsing = usePlaygroundSelector((state) => state.parsing);
  const currentTask = usePlaygroundSelector((state) => state.currentTask);
  return (
    <div className="card" style={{ viewTransitionName: "playground-table" }}>
      <table className="playground-table">
        <thead>
          <tr>
            <th>Note</th>
            <th>Type</th>
            <th className="numeric">Mean (GitHub)</th>
            <th className="numeric">Mean (Local)</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(initialization).map((entry) => (
            <tr key={entry.id}>
              <td>{entry.note}</td>
              <td>Initialization</td>
              <td className="numeric">
                {durationFormatter.format(
                  getDuration(
                    data.initialization.find(
                      partialMatch({
                        snippet: entry.snippet,
                        type: "initialization",
                      }),
                    )?.mean ?? 0,
                  ),
                )}
              </td>
              <td className="numeric">
                {entry.id === currentTask ? (
                  <Spinner />
                ) : (
                  entry.result &&
                  durationFormatter.format(getDuration(entry.result?.mean ?? 0))
                )}
              </td>
            </tr>
          ))}
          {Object.values(validation).map((entry) => (
            <tr key={entry.id}>
              <td>{entry.note}</td>
              <td>Validation</td>
              <td className="numeric">
                {durationFormatter.format(
                  getDuration(
                    data.validation[store.state.dataType].find(
                      partialMatch({
                        snippet: entry.snippet,
                        type: "validation",
                      }),
                    )?.mean ?? 0,
                  ),
                )}
              </td>
              <td className="numeric">
                {entry.id === currentTask ? (
                  <Spinner />
                ) : (
                  entry.result &&
                  durationFormatter.format(getDuration(entry.result?.mean ?? 0))
                )}
              </td>
            </tr>
          ))}
          {Object.values(parsing).map((entry) => (
            <tr key={entry.id}>
              <td>
                {entry.errorType} {entry.note && `(${entry.note})`}
              </td>
              <td>Parsing</td>
              <td className="numeric">
                {durationFormatter.format(
                  getDuration(
                    data.parsing[store.state.dataType].find(
                      partialMatch({
                        snippet: entry.snippet,
                        errorType: entry.errorType,
                        type: "parsing",
                      }),
                    )?.mean ?? 0,
                  ),
                )}
              </td>
              <td className="numeric">
                {entry.id === currentTask ? (
                  <Spinner />
                ) : (
                  entry.result &&
                  durationFormatter.format(getDuration(entry.result?.mean ?? 0))
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
