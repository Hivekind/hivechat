"use client";

import React, { useState, useRef, useEffect } from "react";
import { ModelSelector } from "./model-selector";
import ModelChangeConfirmationDialog from "@/components/model-change-confirmation-dialog";

type Props = {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  children: React.ReactNode;
};

type WithStreamedResponseRef = {
  streamedResponseRef?: React.RefObject<HTMLDivElement>;
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

  const outerRef = useRef<HTMLDivElement | null>(null);
  const streamedResponseRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the top of the streaming response bubble to keep it in view
  // The same position is replaced by the last message when streaming is done.
  useEffect(() => {
    const el = outerRef.current;
    const streamedResponseEl = streamedResponseRef.current;

    if (el && streamedResponseEl) {
      el.scrollTop = streamedResponseEl.offsetTop;
    }
  }, [children, selectedModel]);

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
        ref={outerRef}           // Auto scrolling: Attach the ref to this scrollable div
        style={{
          flex: 1,
          overflowY: "scroll",
          position: "relative", // Auto scrolling: the streamed response bubble is positioned relative to this div
        }}
      >
        {/* Pass the streamedResponseRef to children */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<WithStreamedResponseRef>, {
              streamedResponseRef,
            });
          }
          return child;
        })}
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
