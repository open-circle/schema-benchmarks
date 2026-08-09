import type { JsonSchemaSupportMatrices } from "@schema-benchmarks/bench";

import { EmptyState } from "#src/shared/components/empty-state/index.tsx";
import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import { useBreakpoints } from "#src/shared/hooks/use-breakpoints";

import { SupportMatrixCard } from "./matrix/card";
import { MatrixTable } from "./matrix/table";

export function SupportMatrix({ matrix }: { matrix: JsonSchemaSupportMatrices }) {
  const shouldUseTable = useBreakpoints(["laptop", "desktop"], true);
  if (!matrix || Object.keys(matrix).length === 0) {
    return <EmptyState icon={<MdSymbol>database_off</MdSymbol>} title="No results found" />;
  }
  return (
    <div suppressHydrationWarning>
      {shouldUseTable ? (
        <MatrixTable matrix={matrix} />
      ) : (
        <ul className="json-schema-cards" aria-label="Support Matrix">
          {Object.entries(matrix).map(([library, { matrix: supportMatrix, ...result }]) => (
            <li key={library}>
              <SupportMatrixCard {...{ library, supportMatrix, ...result }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
