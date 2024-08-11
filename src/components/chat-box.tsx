"use client";

import { messageState } from "@/atoms/messages";
import { useRecoilValue } from "recoil";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageData, MessageType } from "@/types";
import ReactMarkdown from "react-markdown";

export default function ChatBox() {
  const messages: MessageData[] = useRecoilValue(messageState);

  return (
    <main
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
              key={index}
              name={message.name}
              timestamp={message.timestamp}
              message={message.message}
            />
          );
        } else if (message.type === MessageType.Recv) {
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

          <div className="max-w-4xl">
            <div>
              <ReactMarkdown>{message}</ReactMarkdown>
            </div>
            <p
              suppressHydrationWarning
              className="text-xs text-slate-500 text-end"
            >
              {timestamp.toString()}
            </p>
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
  return MessageBubble({ name, timestamp, message, type: MessageType.Recv });
}

export function SendBubble({
  name,
  timestamp,
  message,
}: Omit<MessageData, "type">) {
  return MessageBubble({ name, timestamp, message, type: MessageType.Send });
}
