import { useSuspenseQuery } from "@tanstack/react-query";

import { getPackageName } from "#/routes/_benchmarks/-query";
import { getPackageMetadata } from "#/routes/_benchmarks/-query";
import { getRepoLink } from "#/routes/_benchmarks/-query";
import { ExternalLinkToggleButton } from "#/shared/components/button/toggle";
import GithubIcon from "#/shared/components/header/github.svg?react";
import { trackedLinkProps } from "#/shared/lib/analytics";

export interface RepoLinkProps {
  libraryName: string;
  version: string;
}

export function RepoLink({ libraryName, version }: RepoLinkProps) {
  const { data: metadata } = useSuspenseQuery(
    getPackageMetadata(getPackageName(libraryName), version),
  );
  if (!metadata.repository) return null;
  return (
    <ExternalLinkToggleButton
      tooltip="View on GitHub"
      {...trackedLinkProps(getRepoLink(metadata.repository))}
      target="_blank"
      rel="noopener noreferrer"
    >
      <GithubIcon height={24} width={24} />
    </ExternalLinkToggleButton>
  );
}
