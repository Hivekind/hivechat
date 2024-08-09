"use client";

import { messageState } from "@/atoms/messages";
import { useRecoilValue } from "recoil";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageData } from "@/types";

export default function ChatBox() {
  const messages: MessageData[] = useRecoilValue(messageState);

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
      {messages.map((message, index) => {
        if (message.type === "send") {
          return (
            <SendBubble
              key={index}
              name={message.name}
              timestamp={message.timestamp}
              message={message.message}
            />
          );
        } else if (message.type === "recv") {
          return (
            <RecvBubble
              key={index}
              name={message.name}
              timestamp={message.timestamp}
              message={message.message}
            />
          );
        }
      })}
    </main>
  );
}

export function MessageBubble({
  name,
  timestamp = new Date(),
  message,
  type,
}: MessageData) {
  const className =
    type === "send" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted";
  return (
    <div className="mt-4">
      <div
        className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${className}`}
      >
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>

          <div>
            <p>{message}</p>
            <p suppressHydrationWarning>{timestamp.toString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecvBubble({
  name,
  timestamp,
  message,
}: Omit<MessageData, "type">) {
  return MessageBubble({ name, timestamp, message, type: "recv" });
}

export function SendBubble({
  name,
  timestamp,
  message,
}: Omit<MessageData, "type">) {
  return MessageBubble({ name, timestamp, message, type: "send" });
}
