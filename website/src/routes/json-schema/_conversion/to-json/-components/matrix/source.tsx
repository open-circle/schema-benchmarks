import { getPkgUrl } from "#src/routes/_benchmarks/-query.ts";
import { ExternalLinkToggleButton } from "#src/shared/components/button/toggle.tsx";
import { useNpmSite } from "#src/shared/components/prefs/context.tsx";
import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import { trackedLinkProps } from "#src/shared/lib/analytics.ts";

export function PackageSource({ package: packageName }: { package: string }) {
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
