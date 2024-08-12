import { MessageData, MessageType } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";

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
                {timestamp.toLocaleTimeString()}
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
