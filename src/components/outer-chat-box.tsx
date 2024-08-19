"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ModelSelector } from "./model-selector";
import ModelChangeConfirmationDialog from "@/components/model-change-confirmation-dialog";
import { MessageData } from "@/types";
import { getModel } from "@/data/models";
import GeminiChatBox from "@/components/gemini-chat-box";
import OpenAIChatBox from "@/components/openAI-chat-box";
import throttle from "lodash/throttle";

type Props = {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  messages: MessageData[];
  streamedResponse: string;

  setMessages: (
    messages: MessageData[] | ((prevMessages: MessageData[]) => MessageData[])
  ) => void;
  setStreamedResponse: (response: string | ((prev: string) => string)) => void;

  openAIApiKey: string;
  geminiApiKey: string;
};

const OuterChatBox = ({
  selectedModel,
  setSelectedModel,
  messages,
  streamedResponse,
  setMessages,
  setStreamedResponse,
  openAIApiKey,
  geminiApiKey,
}: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingModel, setPendingModel] = useState<string | null>(null);

  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const prevScrollTop = useRef(0); // Previous scroll position

  const modelObj = getModel(selectedModel);

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

  const handleAutoScroll = useCallback(
    throttle(() => {
      if (!isAutoScrollEnabled) {
        return;
      }

      const outer = outerRef.current;
      const streamed = streamedResponseRef.current;

      if (outer && streamed) {
        // nothing to scroll if the content fits in the viewport
        if (outer.scrollHeight === outer.clientHeight) {
          return;
        }

        // auto-scroll is already at the top of the streamed response bubble, disable auto-scroll
        if (outer.scrollTop === streamed.offsetTop) {
          setIsAutoScrollEnabled(false);
          return;
        }

        // Scroll to the top of the streaming response bubble
        outer.scrollTop = streamed.offsetTop;
      }
    }, 100),
    [isAutoScrollEnabled]
  );

  // Scroll to the top of the streaming response bubble to keep it in view
  useEffect(() => {
    handleAutoScroll();
  }, [streamedResponse, handleAutoScroll]);

  // Detect user scroll and disable auto-scroll
  const handleScroll = useCallback(
    throttle(() => {
      if (!isAutoScrollEnabled) {
        return;
      }

      const outer = outerRef.current;
      const streamed = streamedResponseRef.current;

      if (outer && streamed) {
        // user has scrolled up, disable auto-scroll
        if (outer.scrollTop < prevScrollTop.current) {
          setIsAutoScrollEnabled(false);
        }

        prevScrollTop.current = outer.scrollTop;
      }
    }, 200),
    [isAutoScrollEnabled]
  );

  const inViewport = (el: HTMLElement, outer: HTMLElement) => {
    // top and bottom within viewport
    if (
      el.offsetTop > outer.scrollTop &&
      el.offsetTop + el.clientHeight <= outer.scrollTop + outer.clientHeight
    ) {
      return true;
    }

    return false;
  };

  const canFitInViewport = (el: HTMLElement, outer: HTMLElement) => {
    // height smaller than viewport
    if (el.clientHeight <= outer.clientHeight) {
      return true;
    }
    return false;
  };

  const validMessagesPair = (messages: MessageData[]) => {
    const msgLength = messages.length;

    if (msgLength < 2) {
      return false;
    }

    const lastSent = messages[msgLength - 2];
    const lastRecv = messages[msgLength - 1];

    if (lastSent.type === "send" && lastRecv.type === "recv") {
      return true;
    }

    return false;
  };

  // scroll to the bottom when both conditions are met:
  //    1. the last sent message is within the viewport
  //    2. the last received message is shorter than the viewport
  useEffect(() => {
    const outer = outerRef.current;

    if (outer && validMessagesPair(messages)) {
      const recv = outer.lastElementChild as HTMLElement;
      const sent = outer.children[outer.children.length - 2] as HTMLElement;

      if (
        recv &&
        sent &&
        // the last sent message is within the viewport
        inViewport(sent, outer) &&
        // the last received message is shorter than the viewport
        canFitInViewport(recv, outer)
      ) {
        outer.scrollTop = outer.scrollHeight;
      }
    }
  }, [messages]);

  // Re-enable auto-scroll when a new message is sent
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].type === "send") {
      setIsAutoScrollEnabled(true);

      // Scroll to the bottom of the chat box
      const outer = outerRef.current;
      if (outer) {
        outer.scrollTop = outer.scrollHeight;
      }
    }
  }, [messages]);

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
        onScroll={handleScroll}
        ref={outerRef} // Auto scrolling: Attach the ref to this scrollable div
        style={{
          flex: 1,
          overflowY: "scroll",
          position: "relative", // Auto scrolling: the streamed response bubble is positioned relative to this div
        }}
      >
        {modelObj && modelObj.type === "OpenAI" ? (
          <OpenAIChatBox
            messages={messages}
            setMessages={setMessages}
            streamedResponse={streamedResponse}
            setStreamedResponse={setStreamedResponse}
            modelName={selectedModel}
            outputCost={modelObj.outputCost}
            apiKey={openAIApiKey}
            streamedResponseRef={streamedResponseRef}
          />
        ) : modelObj && modelObj.type === "Gemini" ? (
          <GeminiChatBox
            messages={messages}
            setMessages={setMessages}
            streamedResponse={streamedResponse}
            setStreamedResponse={setStreamedResponse}
            modelName={selectedModel}
            outputCost={modelObj.outputCost}
            apiKey={geminiApiKey}
            streamedResponseRef={streamedResponseRef}
          />
        ) : null}
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
