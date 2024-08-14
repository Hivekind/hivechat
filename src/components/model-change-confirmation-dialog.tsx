import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

type ModelChangeConfirmationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ModelChangeConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
}: ModelChangeConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Do you want to proceed?</DialogTitle>
          <DialogDescription>
            Switching to a new model will clear your current chat session. This
            will clear your current chat history.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 justify-end mt-4">
          <Button
            onClick={() => {
              onCancel();
              onClose();
            }}
            variant={"outline"}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
