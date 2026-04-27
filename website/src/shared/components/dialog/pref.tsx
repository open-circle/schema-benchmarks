import { Dialog, DialogContent, DialogTitle } from ".";

export interface PreferencesDialogProps {
  open: boolean;
  onClose?: () => void;
}

export function PreferencesDialog({ open, onClose }: PreferencesDialogProps) {
  return (
    <Dialog {...{ open, onClose }} aria-labelledby="pref-dialog-title" closedby="any">
      <DialogContent>
        <DialogTitle id="pref-dialog-title">Preferences</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}
