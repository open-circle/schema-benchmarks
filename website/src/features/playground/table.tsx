import { durationFormatter, getDuration } from "@schema-benchmarks/utils";
import { Spinner } from "@/components/spinner";
import { usePlaygroundSelector, usePlaygroundStore } from "./store";

export function PlaygroundTable() {
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
            <th className="action fit-content"></th>
            <th>Note</th>
            <th>Type</th>
            <th className="numeric">Result</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(initialization).map((entry) => (
            <tr key={entry.id}>
              <td className="action fit-content">
                <input
                  type="checkbox"
                  checked={entry.enabled}
                  onChange={(e) => store.setEnabled(entry.id, e.target.checked)}
                />
              </td>
              <td>{entry.note}</td>
              <td>Initialization</td>
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
              <td className="action fit-content">
                <input
                  type="checkbox"
                  checked={entry.enabled}
                  onChange={(e) => store.setEnabled(entry.id, e.target.checked)}
                />
              </td>
              <td>{entry.note}</td>
              <td>Validation</td>
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
              <td className="action fit-content">
                <input
                  type="checkbox"
                  checked={entry.enabled}
                  onChange={(e) => store.setEnabled(entry.id, e.target.checked)}
                />
              </td>
              <td>
                {entry.errorType} {entry.note && `(${entry.note})`}
              </td>
              <td>Parsing</td>
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
