"use client";

import { useState, useEffect } from "react";
import { MessageData, MessageType, AIModel } from "@/types";
import { uuid } from "@/lib/utils";
import { RecvBubble, SendBubble } from "@/components/message-bubble";
import { Model } from "@/data/models";
import OpenAI from "openai";

import { chatStream } from "@/lib/openai";
import { aiMessage } from "@/lib/utils";

type OpenAIChatBoxProps = {
  messages: MessageData[];
  setMessages: (
    messages: MessageData[] | ((prevMessages: MessageData[]) => MessageData[])
  ) => void;
  streamedResponse: string;
  setStreamedResponse: (response: string | ((prev: string) => string)) => void;
  model: Model;
  apiKey: string;
};

export default function OpenAIChatBox({
  messages,
  setMessages,
  streamedResponse,
  setStreamedResponse,
  model,
  apiKey,
}: OpenAIChatBoxProps) {
  const [openAIClient, setOpenAIClient] = useState<OpenAI | null>(null);

  useEffect(() => {
    const client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    setOpenAIClient(client);
  }, [apiKey]);

  useEffect(() => {
    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.type === MessageType.Recv) return;

    const streamOpenAI = async () => {
      try {
        let finalResponse = "";

        await chatStream({
          messagesData: messages,
          client: openAIClient,
          onStream: (chunk) => {
            const chunkContent = chunk.choices[0]?.delta?.content || "";
            finalResponse += chunkContent;

            setStreamedResponse((prev) => prev + chunkContent);
          },
        });

        setMessages((prevMessages) => [
          ...prevMessages,
          aiMessage(finalResponse, AIModel.OpenAI),
        ]);

        setStreamedResponse("");
      } catch (error) {
        console.error("Error stream from OpenAI:", error);
      }
    };

    streamOpenAI();
  }, [messages, openAIClient, setMessages, setStreamedResponse]);

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
          name={model.name}
          message={streamedResponse}
          streaming={true}
        />
      )}
    </main>
  );
}
