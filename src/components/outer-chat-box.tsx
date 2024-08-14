"use client";

import { useState } from "react";
import { ModelSelector } from "./model-selector";
import ModelChangeConfirmationDialog from "@/components/model-change-confirmation-dialog";

type Props = {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  children: React.ReactNode;
};

const OuterChatBox = ({ selectedModel, setSelectedModel, children }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingModel, setPendingModel] = useState<string | null>(null);

  const handleModelChange = (newModel: string) => {
    setPendingModel(newModel);
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    if (pendingModel) {
      setSelectedModel(pendingModel);
    }
  };

  const handleCancel = () => {
    setPendingModel(null);
  };

  return (
    <main
      style={{
        flex: 1,
        overflowY: "scroll",
        padding: "10px",
        maxHeight: "80vh",
      }}
      className="border border-slate-200 rounded-lg p-4 h-[80vh]"
    >
      <ModelSelector
        selectedModel={selectedModel}
        setSelectedModel={handleModelChange}
      />
      {children}

      <ModelChangeConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </main>
  );
};

export { OuterChatBox };
