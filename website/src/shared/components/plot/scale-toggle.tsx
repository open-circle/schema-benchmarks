import { Checkbox, ControlLabel } from "#src/shared/components/checkbox";

export type PlotScale = "linear" | "log";

export interface PlotScaleToggleProps {
  value: PlotScale;
  onChange: (value: PlotScale) => void;
  logDisabled?: boolean;
}

export function PlotScaleToggle({ value, onChange, logDisabled = false }: PlotScaleToggleProps) {
  return (
    <ControlLabel>
      <Checkbox
        asLabel={false}
        checked={value === "log"}
        disabled={logDisabled}
        onChange={(event) => onChange(event.currentTarget.checked ? "log" : "linear")}
        tooltip={logDisabled ? "A logarithmic scale requires positive values" : undefined}
      />
      Use logarithmic scale
    </ControlLabel>
  );
}
