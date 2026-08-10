import type { JsonSchemaSourceResult } from "@schema-benchmarks/bench";

import { getPkgUrl } from "#src/routes/_benchmarks/-query.ts";
import { jsonSourceProps } from "#src/routes/json-schema/_conversion/-constants";
import { ExternalLinkToggleButton } from "#src/shared/components/button/toggle.tsx";
import { useNpmSite } from "#src/shared/components/prefs/context.tsx";
import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import { trackedLinkProps } from "#src/shared/lib/analytics.ts";

export interface JsonSchemaSourceProps {
  source: JsonSchemaSourceResult;
}

export function JsonSchemaSourceText({ source }: JsonSchemaSourceProps) {
  const { npmSite } = useNpmSite();
  if (source === "native" || source === "opt-in") {
    return jsonSourceProps.labels[source].label;
  }
  return (
    <a
      {...trackedLinkProps(getPkgUrl(source.package, npmSite))}
      target="_blank"
      rel="noopener noreferrer"
    >
      <code className="language-text">{source.package}</code>
    </a>
  );
}
export function JsonSchemaPackageButton({ package: packageName }: { package: string }) {
  const { npmSite } = useNpmSite();
  return (
    <ExternalLinkToggleButton
      {...trackedLinkProps(getPkgUrl(packageName, npmSite))}
      target="_blank"
      rel="noopener noreferrer"
      tooltip={{
        subhead: "Package required",
        supporting: <code className="language-text">{packageName}</code>,
      }}
    >
      <MdSymbol>deployed_code</MdSymbol>
    </ExternalLinkToggleButton>
  );
}
