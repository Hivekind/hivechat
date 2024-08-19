"use client";

import { useEffect } from "react";
import { MessageData, MessageType, Metrics } from "@/types";
import { formattedCalculatedMetrics } from "@/lib/utils";
import { RecvBubble, SendBubble } from "@/components/message-bubble";

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
  outputCost: number;
  streamedResponseRef?: React.RefObject<HTMLDivElement>;
};

export default function OpenAIChatBox({
  messages,
  setMessages,
  streamedResponse,
  setStreamedResponse,
  modelName,
  apiKey,
  outputCost,
  streamedResponseRef,
}: OpenAIChatBoxProps) {
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.type === MessageType.Recv) return;

    const streamOpenAI = async () => {
      try {
        let finalResponse = "";

        const chunkBatchSize = 50;
        let accumulatedChunks: string[] = [];

        const startTime = performance.now();
        let firstTokenTime: number | null = null;
        let tokensCount = 0;

        await chatStream({
          messagesData: messages,
          model: modelName,
          apiKey,
          onStream: (chunk) => {
            const chunkContent = chunk.choices[0]?.delta?.content || "";
            finalResponse += chunkContent;

            accumulatedChunks.push(chunkContent);
            if (accumulatedChunks.length >= chunkBatchSize) {
              setStreamedResponse((prev) => prev + accumulatedChunks.join(""));
              accumulatedChunks = [];
            }

            if (!firstTokenTime) {
              firstTokenTime = performance.now() - startTime;
            }
            if (chunk.usage && chunk.usage.completion_tokens) {
              tokensCount = chunk.usage.completion_tokens;
            }
          },
        });

        const metrics: Metrics | null = formattedCalculatedMetrics(
          startTime,
          tokensCount,
          firstTokenTime,
          outputCost
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
  }, [
    messages,
    modelName,
    setMessages,
    setStreamedResponse,
    outputCost,
    apiKey,
  ]);

  return (
    <>
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
          bubbleRef={streamedResponseRef}
          name={modelName}
          message={streamedResponse}
          streaming={true}
        />
      )}
    </>
  );
}
