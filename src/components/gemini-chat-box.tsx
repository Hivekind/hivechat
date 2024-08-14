"use client";

import { useState, useEffect } from "react";
import { MessageData, MessageType, Metrics } from "@/types";
import { formattedCalculatedMetrics, uuid } from "@/lib/utils";
import { RecvBubble, SendBubble } from "@/components/message-bubble";
import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
import { safetySettings, generationConfig } from "@/data/gemini-settings";
import { aiMessage } from "@/lib/utils";

type GeminiChunkResponse = {
  text: () => string;
  usageMetadata: { candidatesTokenCount: number };
};

type GeminiChatBoxProps = {
  messages: MessageData[];
  setMessages: (
    messages: MessageData[] | ((prevMessages: MessageData[]) => MessageData[])
  ) => void;
  modelName: string;
  streamedResponse: string;
  setStreamedResponse: (response: string | ((prev: string) => string)) => void;
  apiKey: string;
  cost: number;
};

export default function GeminiChatBox({
  messages,
  setMessages,
  modelName,
  streamedResponse,
  setStreamedResponse,
  cost,
  apiKey,
}: GeminiChatBoxProps) {
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // reset any previous error
    setError(null);

    const genAI = new GoogleGenerativeAI(apiKey);
    const aiModel = genAI.getGenerativeModel({
      model: modelName,
    });

    const initGeminiChat = () => {
      try {
        const chatSession = aiModel.startChat({
          generationConfig,
          safetySettings,
          history: [],
        });
        setChat(chatSession);
      } catch (error) {
        console.log(error);
        setError("There is an error initializing the chat");
      }
    };

    initGeminiChat();
  }, [apiKey]);

  useEffect(() => {
    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.type === MessageType.Recv) return;

    // reset any previous error
    setError(null);

    const handleGeminiSubmission = async () => {
      try {
        let finalResponse = "";

        if (chat) {
          const startTime = performance.now();
          let firstTokenTime: number | null = null;
          let tokensCount = 0;
          let result = await chat.sendMessageStream(lastMsg.message);

          for await (const chunk of result.stream as AsyncIterable<GeminiChunkResponse>) {
            const chunkContent = chunk.text();
            finalResponse += chunkContent;
            if (!firstTokenTime) {
              firstTokenTime = performance.now() - startTime;
            }
            tokensCount = chunk.usageMetadata.candidatesTokenCount;
            setStreamedResponse((prev) => prev + chunkContent);
          }

          const metrics: Metrics | null = formattedCalculatedMetrics(
            startTime,
            tokensCount,
            firstTokenTime,
            cost
          );

          setMessages((prevMessages) => [
            ...prevMessages,
            aiMessage(finalResponse, modelName, metrics),
          ]);

          setStreamedResponse("");
        }
      } catch (error) {
        setError("There is an error sending the message");
      }
    };

    handleGeminiSubmission();
  }, [messages, chat, setMessages, setError]);

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

      {error && <div>{error}</div>}
    </div>
  );
}
