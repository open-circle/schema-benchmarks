import { unsafeFromEntries } from "@schema-benchmarks/utils";
import type { ReactNode } from "react";
import bem from "react-bem-helper";

import { Button, ButtonGroup } from "#/shared/components/button";
import { useNpmSite, useStyle, useTheme } from "#/shared/components/prefs/context";
import { MdSymbol } from "#/shared/components/symbol";
import { useIdDefault } from "#/shared/hooks/use-id-default";
import {
  npmSiteSchema,
  styleLabels,
  styleSchema,
  themeLabels,
  themeSchema,
} from "#/shared/lib/prefs/constants";

import { Dialog, DialogContent, DialogTitle } from ".";

export interface PreferencesDialogProps {
  open: boolean;
  onClose?: () => void;
}

const cls = bem("pref-dialog");

export function PreferencesDialog({ open, onClose }: PreferencesDialogProps) {
  const { style, setStyle } = useStyle();
  const { theme, setTheme } = useTheme();
  const { npmSite, setNpmSite } = useNpmSite();
  return (
    <Dialog {...{ open, onClose }} aria-labelledby="pref-dialog-title" closedby="any" {...cls()}>
      <DialogContent>
        <DialogTitle id="pref-dialog-title">Preferences</DialogTitle>
        <div {...cls("prefs")}>
          <PrefGroup
            options={styleSchema.options}
            labels={styleLabels}
            title="Style"
            selected={style}
            onChange={setStyle}
          />
          <PrefGroup
            options={themeSchema.options}
            labels={themeLabels}
            title="Theme"
            selected={theme}
            onChange={setTheme}
          />
          <PrefGroup
            options={npmSiteSchema.options}
            labels={unsafeFromEntries(
              npmSiteSchema.options.map((opt) => [opt, { label: opt, icon: "deployed_code" }]),
            )}
            title="NPM browser"
            selected={npmSite}
            onChange={setNpmSite}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface PrefGroupProps<TOpt extends string> {
  title: ReactNode;
  titleId?: string;
  options: ReadonlyArray<TOpt>;
  labels: Record<TOpt, { icon: string; label: ReactNode }>;
  selected: TOpt;
  onChange: (opt: TOpt) => void;
}

function PrefGroup<TOpt extends string>({
  title,
  titleId: titleIdProp,
  options,
  labels,
  selected,
  onChange,
}: PrefGroupProps<TOpt>) {
  const titleId = useIdDefault(titleIdProp);
  return (
    <div {...cls("group")}>
      <h5 id={titleId}>{title}</h5>
      <ButtonGroup ariaLabelledBy={titleId} variant="outlined">
        {options.map((opt) => (
          <Button
            key={opt}
            icon={<MdSymbol>{labels[opt].icon}</MdSymbol>}
            aria-pressed={opt === selected}
            onClick={() => onChange(opt)}
          >
            {labels[opt].label}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
}
