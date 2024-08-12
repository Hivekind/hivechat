"use client";

import { useRecoilValue } from "recoil";
import { MessageData, MessageType, AIModel } from "@/types";
import { streamedResponseState } from "@/atoms/streamed-response";
import { uuid } from "@/lib/utils";
import { RecvBubble, SendBubble } from "@/components/message-bubble";

export default function ChatBox({ messages }: { messages: MessageData[] }) {
  const streamedResponse = useRecoilValue(streamedResponseState);

  return (
    <main
      style={{
        flex: 1,
        overflowY: "scroll",
        padding: "10px",
        maxHeight: "80vh",
      }}
    >
      {messages.map((message) => {
        if (message.type === MessageType.Send) {
          return (
            <SendBubble
              id={message.id}
              key={message.id}
              name={message.name}
              timestamp={message.timestamp}
              message={message.message}
            />
          );
        } else if (message.type === MessageType.Recv) {
          return (
            <RecvBubble
              id={message.id}
              key={message.id}
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
