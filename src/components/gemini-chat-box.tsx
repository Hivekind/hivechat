"use client";

import { useState, useEffect } from "react";
import { MessageData, MessageType } from "@/types";
import { RecvBubble, SendBubble } from "@/components/message-bubble";
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
  modelName: string;
  apiKey: string;
};

export default function GeminiChatBox({
  messages,
  setMessages,
  modelName,
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
        if (chat) {
          const response = await chat.sendMessage(lastMsg.message);
          const botMessage = aiMessage(
            response.response.text(),
            modelName
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

      {error && <div>{error}</div>}
    </div>
  );
}
