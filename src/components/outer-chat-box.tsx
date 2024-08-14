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
        display: "flex",
        flexDirection: "column",
        maxHeight: "80vh",
        width: "calc((100% - 16px) / 2)", // 16px is the gap between the chat boxes: `gap-4` in the parent class
        boxSizing: "border-box",
        padding: "10px",
        paddingRight: "0px",
      }}
      className="border border-slate-200 rounded-lg p-4 h-[80vh]"
    >
      <div
        style={{ position: "sticky", top: 0, zIndex: 10, background: "white" }}
      >
        <ModelSelector
          selectedModel={selectedModel}
          setSelectedModel={handleModelChange}
        />
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "scroll",
        }}
      >
        {children}
      </div>

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
