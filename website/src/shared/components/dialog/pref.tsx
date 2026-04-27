import { Dialog } from ".";

export interface PreferencesDialogProps {
  open: boolean;
  onClose?: () => void;
}

export function PreferencesDialog({ open, onClose }: PreferencesDialogProps) {
  return (
    <Dialog {...{ open, onClose }} aria-labelledby="pref-dialog-title" closedby="any">
      <div className="dialog__content">
        <h2 id="pref-dialog-title" className="dialog__title">
          Preferences
        </h2>
      </div>
    </Dialog>
  );
}
