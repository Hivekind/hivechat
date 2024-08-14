"use client";

import { useState, useEffect } from "react";
import { MessageData, MessageType } from "@/types";
import { uuid } from "@/lib/utils";
import { RecvBubble, SendBubble } from "@/components/message-bubble";
import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
import { safetySettings, generationConfig } from "@/data/gemini-settings";
import { aiMessage } from "@/lib/utils";

type GeminiChatBoxProps = {
  messages: MessageData[];
  setMessages: (
    messages: MessageData[] | ((prevMessages: MessageData[]) => MessageData[])
  ) => void;
  modelName: string;
  streamedResponse: string;
  setStreamedResponse: (response: string | ((prev: string) => string)) => void;
  apiKey: string;
};

export default function GeminiChatBox({
  messages,
  setMessages,
  modelName,
  streamedResponse,
  setStreamedResponse,
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
          let result = await chat.sendMessageStream(lastMsg.message);

          for await (const chunk of result.stream) {
            const chunkContent = chunk.text();
            finalResponse += chunkContent;

            setStreamedResponse((prev) => prev + chunkContent);
          }

          setMessages((prevMessages) => [
            ...prevMessages,
            aiMessage(finalResponse, modelName),
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
