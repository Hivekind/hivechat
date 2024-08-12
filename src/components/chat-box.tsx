"use client";

import React, { useRef, useEffect } from "react";
import { messageState } from "@/atoms/messages";
import { useRecoilValue } from "recoil";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageData, MessageType, AIModel } from "@/types";
import ReactMarkdown from "react-markdown";
import { streamedResponseState } from "@/atoms/streamed-response";
import { uuid } from "@/lib/utils";

export default function ChatBox() {
  const messages: MessageData[] = useRecoilValue(messageState);
  const streamedResponse = useRecoilValue(streamedResponseState);

  const outerRef = useRef<any>(undefined);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, streamedResponse]);

  return (
    <main
      ref={outerRef}
      style={{
        flex: 1,
        overflowY: "scroll",
        padding: "10px",
        maxHeight: "80vh",
      }}
    >
      {messages.map((message, index) => {
        if (message.type === MessageType.Send) {
          return (
            <SendBubble
              id={message.id}
              key={index}
              name={message.name}
              timestamp={message.timestamp}
              message={message.message}
            />
          );
        } else if (message.type === MessageType.Recv) {
          return (
            <RecvBubble
              id={message.id}
              key={index}
              name={message.name}
              timestamp={message.timestamp}
              message={message.message}
            />
          );
        }
      })}

      {/* Render the ongoing streaming response for OpenAI */}
      {streamedResponse && (
        <RecvBubble
          id={uuid()}
          name={AIModel.OpenAI}
          message={streamedResponse}
          streaming={true}
        />
      )}
    </main>
  );
}

export function MessageBubble({
  name,
  timestamp = new Date(),
  message,
  type,
  streaming = false,
}: MessageData) {
  const className =
    type === MessageType.Send
      ? "ml-auto bg-primary text-primary-foreground"
      : "bg-muted";
  return (
    <div className="mt-4">
      <div
        className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${className}`}
      >
        <div className="flex items-center space-x-4">
          {type === MessageType.Recv && <p className="font-semibold">{name}</p>}

          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>

          <div
            className={`max-w-4xl prose ${
              type === MessageType.Send ? "text-primary-foreground" : ""
            }`}
          >
            <ReactMarkdown>{message}</ReactMarkdown>

            {!streaming && (
              <p
                suppressHydrationWarning
                className={`text-xs text-end ${
                  type === MessageType.Recv
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                {timestamp.toString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecvBubble({
  id,
  name,
  timestamp,
  message,
  streaming = false,
}: Omit<MessageData, "type">) {
  return MessageBubble({
    id,
    name,
    timestamp,
    message,
    type: MessageType.Recv,
    streaming,
  });
}

export function SendBubble({
  id,
  name,
  timestamp,
  message,
}: Omit<MessageData, "type">) {
  return MessageBubble({
    id,
    name,
    timestamp,
    message,
    type: MessageType.Send,
  });
}
