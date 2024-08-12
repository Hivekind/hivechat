"use client";

import { useState, useEffect } from "react";
import { MessageData, MessageType, AIModel } from "@/types";
import { RecvBubble, SendBubble } from "@/components/message-bubble";
import { Model } from "@/data/models";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { safetySettings, generationConfig } from "@/data/gemini-settings";
import { aiMessage } from "@/lib/utils";

interface ChatSession {
  sendMessage: (
    message: string
  ) => Promise<{ response: { text: () => string } }>;
}

type GeminiChatBoxProps = {
  messages: MessageData[];
  setMessages: (
    messages: MessageData[] | ((prevMessages: MessageData[]) => MessageData[])
  ) => void;
  streamedResponse: string;
  setStreamedResponse: (response: string | ((prev: string) => string)) => void;
  model: Model;
  apiKey: string;
};

export default function GeminiChatBox({
  messages,
  setMessages,
  streamedResponse,
  setStreamedResponse,
  model,
  apiKey,
}: GeminiChatBoxProps) {
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // reset any previous error
    setError(null);

    const genAI = new GoogleGenerativeAI(apiKey);
    const aiModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
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
        if (chat) {
          const response = await chat.sendMessage(lastMsg.message);
          const botMessage = aiMessage(
            response.response.text(),
            AIModel.Gemini
          );
          setMessages((prevMessages) => [...prevMessages, { ...botMessage }]);
        }
      } catch (error) {
        setError("There is an error sending the message");
      }
    };

    handleGeminiSubmission();
  }, [messages, chat, setMessages, setError]);

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

      {error && <div>{error}</div>}
    </main>
  );
}