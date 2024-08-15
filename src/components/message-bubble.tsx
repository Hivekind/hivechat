import { MessageData, MessageType } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import ReactMarkdown, { ExtraProps } from "react-markdown";
import UserImage from "../../public/images/user.svg";
import BotImage from "../../public/images/bot.svg";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";
import hljs from "highlight.js";
import { ClassAttributes, HTMLAttributes } from "react";

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
  name,
  timestamp = new Date(),
  message,
  type,
  streaming = false,
  metrics,
}: MessageData) {
  const className =
    type === MessageType.Send
      ? "bg-slate-600 text-white"
      : "bg-slate-200 text-black";
  return (
    <div className="mt-4">
      <div
        className={`flex w-full flex-col gap-2 rounded-lg px-3 py-2 text-sm`}
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
              />
            </Avatar>
          </div>
          <div className={`w-5/6 rounded-lg px-3 py-2 ${className}`}>
            {streaming ? (
              message
            ) : (
              <ReactMarkdown
                components={{
                  p(props) {
                    const { className, node, ...rest } = props;
                    return (
                      <p {...rest} className={`my-4 ${className ?? ""}`} />
                    );
                  },

                  code(props) {
                    return highlightedCode(props);
                  },
                }}
              >
                {message}
              </ReactMarkdown>
            )}

            {!streaming && type === MessageType.Recv && (
              <div>
                <Separator
                  orientation="horizontal"
                  className="border-t border-slate-300 my-2"
                />
                <div className="text-xs flex gap-4">
                  <p>
                    <b>{metrics?.tokensUsed}</b> tokens
                  </p>
                  <Separator
                    orientation="vertical"
                    className="border-r border-slate-300"
                  />
                  <p>
                    <b>{metrics?.timeTaken.toFixed(2)}</b> s
                  </p>
                  <Separator
                    orientation="vertical"
                    className="border-r border-slate-300"
                  />
                  <p>
                    <b>{metrics?.tokensPerSec.toFixed(2)}</b> tokens/s
                  </p>
                  <Separator
                    orientation="vertical"
                    className="border-r border-slate-300"
                  />
                  <p>
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
}: Omit<MessageData, "type">) {
  return MessageBubble({
    id,
    name,
    timestamp,
    message,
    type: MessageType.Recv,
    streaming,
    metrics,
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
