import { MessageData, MessageType } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import ReactMarkdown, { ExtraProps } from "react-markdown";
import UserImage from "../../public/images/user.svg";
import BotImage from "../../public/images/bot.svg";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";
import hljs from "highlight.js";
import { ClassAttributes, HTMLAttributes } from "react";
import { useMemo } from "react";
import "./message-bubble.scss";

type ReactMarkdownComponentProps = ClassAttributes<HTMLElement> &
  HTMLAttributes<HTMLElement> &
  ExtraProps;

function highlightedCode(props: ReactMarkdownComponentProps) {
  const { children, className, node, ...rest } = props;
  const match = /language-(\w+)/.exec(className || "");
  const chosenLanguage = match ? match[1] : "plaintext";
  const detectedLanguage = hljs.getLanguage(chosenLanguage);
  const language = detectedLanguage?.scope?.toString() ?? "plaintext";
  const highlighted = hljs.highlight(String(children), {
    language,
    ignoreIllegals: true,
  });

  return (
    <code
      {...rest}
      className={`${className ?? "language-plaintext font-bold"} hljs my-4`}
      dangerouslySetInnerHTML={{ __html: highlighted.value }}
    ></code>
  );
}

export function MessageBubble({
  message,
  type,
  streaming = false,
  metrics,
  bubbleRef = null,
}: MessageData & { bubbleRef?: React.Ref<HTMLDivElement> }) {
  const className =
    type === MessageType.Send
      ? "bg-slate-600 text-white message-send"
      : "bg-slate-200 text-black message-recv";

  const highlightedMarkdownText = useMemo(() => {
    return (
      <ReactMarkdown
        components={{
          code(props) {
            return highlightedCode(props);
          },
        }}
      >
        {message}
      </ReactMarkdown>
    );
  }, [message]);

  return (
    <div className="mt-4 message-bubble" ref={bubbleRef ? bubbleRef : null}>
      <div
        className={`flex w-full flex-col gap-2 rounded-lg px-3 py-2 text-sm prose`}
      >
        <div className="flex gap-4">
          <div>
            <Avatar
              className={`${
                type === MessageType.Send ? "bg-slate-600" : "bg-slate-200"
              } justify-center`}
            >
              <Image
                src={type === MessageType.Send ? UserImage : BotImage}
                width={16}
                height={16}
                alt="avatar"
                className="not-prose"
              />
            </Avatar>
          </div>
          <div className={`w-5/6 rounded-lg px-3 py-2 ${className}`}>
            {highlightedMarkdownText}

            {type === MessageType.Recv && (
              // Auto scrolling:
              //    always render this even if streaming, so the message height is the same for both streaming and final message.
              //    this is important for the auto scrolling to work correctly.
              // if streaming, this will be hidden
              <div className={streaming ? "invisible" : ""}>
                <Separator
                  orientation="horizontal"
                  className="border-t border-slate-300 my-2"
                />
                <div className="text-xs flex gap-4">
                  <p className="not-prose">
                    <b>{metrics?.tokensUsed}</b> tokens
                  </p>
                  <Separator
                    orientation="vertical"
                    className="border-r border-slate-300"
                  />
                  <p className="not-prose">
                    <b>{metrics?.timeTaken.toFixed(2)}</b> s
                  </p>
                  <Separator
                    orientation="vertical"
                    className="border-r border-slate-300"
                  />
                  <p className="not-prose">
                    <b>{metrics?.tokensPerSec.toFixed(2)}</b> tokens/s
                  </p>
                  <Separator
                    orientation="vertical"
                    className="border-r border-slate-300"
                  />
                  <p className="not-prose">
                    <b>$</b> {metrics?.apiCreditsUsed.toFixed(4)}
                  </p>
                </div>
              </div>
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
  metrics,
  bubbleRef = null, // Auto scrolling: this is the ref for the streaming message
}: Omit<MessageData, "type"> & { bubbleRef?: React.Ref<HTMLDivElement> }) {
  return MessageBubble({
    id,
    name,
    timestamp,
    message,
    type: MessageType.Recv,
    streaming,
    metrics,
    bubbleRef,
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
