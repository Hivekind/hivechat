"use client";

import { useState, useEffect } from "react";
import { MessageData, MessageType, Metrics } from "@/types";
import { uuid } from "@/lib/utils";
import { RecvBubble, SendBubble } from "@/components/message-bubble";
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
  modelName: string;
  apiKey: string;
  cost: number;
};

export default function OpenAIChatBox({
  messages,
  setMessages,
  streamedResponse,
  setStreamedResponse,
  modelName,
  apiKey,
  cost,
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
        const startTime = performance.now();
        let firstTokenTime: number | null = null;
        let tokensCount = 0;

        await chatStream({
          messagesData: messages,
          client: openAIClient,
          model: modelName,
          onStream: (chunk) => {
            const chunkContent = chunk.choices[0]?.delta?.content || "";
            finalResponse += chunkContent;
            if (!firstTokenTime) {
              firstTokenTime = performance.now() - startTime;
            }
            if (chunk.usage && chunk.usage.completion_tokens) {
              tokensCount = chunk.usage.completion_tokens;
            }
            setStreamedResponse((prev) => prev + chunkContent);
          },
        });
        const metrics: Metrics | null = formattedCalculatedMetrics(
          startTime,
          tokensCount,
          firstTokenTime
        );

        setMessages((prevMessages) => [
          ...prevMessages,
          aiMessage(finalResponse, modelName, metrics),
        ]);

        setStreamedResponse("");
      } catch (error) {
        console.error("Error stream from OpenAI:", error);
      }
    };

    streamOpenAI();
  }, [messages, openAIClient, setMessages, setStreamedResponse]);

  const formattedCalculatedMetrics = (
    startTime: number,
    tokensCount: number,
    firstTokenTime: number | null
  ) => {
    const endTime = performance.now();
    const totalTimeTaken = endTime - startTime;
    return {
      timeTaken: totalTimeTaken / 1000,
      tokensUsed: tokensCount,
      tokensPerSec: tokensCount / (totalTimeTaken / 1000),
      apiCreditsUsed: tokensCount * cost,
      firstTokenTime: firstTokenTime,
    };
  };

  return (
    <div>
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
              metrics={message.metrics}
            />
          );
        }
      })}

      {/* Render the ongoing streaming response */}
      {streamedResponse && (
        <RecvBubble
          id={uuid()}
          name={modelName}
          message={streamedResponse}
          streaming={true}
        />
      )}
    </div>
  );
}
