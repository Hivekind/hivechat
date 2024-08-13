import { MessageData, MessageType } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import UserImage from "../../public/images/user.svg";
import BotImage from "../../public/images/bot.svg";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";

export function MessageBubble({
  name,
  timestamp = new Date(),
  message,
  type,
  streaming = false,
}: MessageData) {
  const className =
    type === MessageType.Send
      ? "bg-slate-600 text-white"
      : "bg-slate-200 text-black";
  return (
    <div className="mt-4">
      <div
        className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm`}
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
          <div className={`max-w-4xl rounded-lg px-3 py-2 ${className}`}>
            <ReactMarkdown>{message}</ReactMarkdown>
            {!streaming && type === MessageType.Recv && (
              <div>
                <Separator
                  orientation="horizontal"
                  className="border-t border-slate-300 my-2"
                />
                <div className="text-xs flex gap-4">
                  <p>
                    <b>43</b> tokens
                  </p>
                  <Separator
                    orientation="vertical"
                    className="border-r border-slate-300"
                  />
                  <p>
                    <b>10</b> s
                  </p>
                  <Separator
                    orientation="vertical"
                    className="border-r border-slate-300"
                  />
                  <p>
                    <b>4.5</b> tokens/s
                  </p>
                  <Separator
                    orientation="vertical"
                    className="border-r border-slate-300"
                  />
                  <p>
                    <b>$</b> 0.005
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
