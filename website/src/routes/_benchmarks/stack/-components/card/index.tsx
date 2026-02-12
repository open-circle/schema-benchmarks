import type { StackResult } from "@schema-benchmarks/bench";
import { getTransitionName } from "@schema-benchmarks/utils";
import bem from "react-bem-helper";

interface StackCardProps {
  result: StackResult;
}

const cls = bem("stack-card");

export function StackCard({ result }: StackCardProps) {
  if (!("error" in result)) {
    return null;
  }
  return (
    <div
      {...cls()}
      style={{
        viewTransitionName: getTransitionName("stack-card", {
          libraryName: result.libraryName,
        }),
      }}
    >
      <pre dir="ltr" {...cls({ element: "error", extra: "language-text" })}>
        <code className="language-text">
          {`${result.error.name}: ${result.error.message}\n${result.error.stack.replaceAll("/home/runner/work/schema-benchmarks/", "")}`}
        </code>
      </pre>
    </div>
  );
}
