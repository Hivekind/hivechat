"use client";

import { useRecoilState, useRecoilValue } from "recoil";
import { messageState } from "@/atoms/messages";
import { apiKeysState } from "@/atoms/api-keys";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { safetySettings, generationConfig } from "@/data/gemini-settings";
import OpenAI from "openai";

interface ChatSession {
  sendMessage: (
    message: string
  ) => Promise<{ response: { text: () => string } }>;
}

import { chatCompletion } from "@/lib/openai";
import { AIModel } from "@/types";
import { userMessage, aiMessage } from "@/lib/utils";

export default function MessageForm() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useRecoilState(messageState);
  const apiKeys = useRecoilValue(apiKeysState);
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openAIPending, setOpenAIPending] = useState<boolean>(false);
  const [openAIClient, setOpenAIClient] = useState<OpenAI | null>(null);

  useEffect(() => {
    const client = new OpenAI({
      apiKey: apiKeys.openai,
      dangerouslyAllowBrowser: true,
    });

    setOpenAIClient(client);
  }, [apiKeys]);

  useEffect(() => {
    if (!openAIPending) return;

    const submitToOpenAI = async () => {
      try {
        const response =
          (await chatCompletion({
            messagesData: messages,
            client: openAIClient,
          })) || "OpenAI response error";

        setMessages((prevMessages) => [
          ...prevMessages,
          aiMessage(response, AIModel.OpenAI),
        ]);
      } catch (error) {
        console.error("Error submitting to OpenAI:", error);
      }
    };

    setOpenAIPending(false);
    submitToOpenAI();
  }, [messages, openAIPending, setOpenAIPending]);

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    setInput(event.currentTarget.value);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!input || input === "") return;

    setMessages((current) => [...current, userMessage(input)]);
    setInput("");

    handleGeminiSubmission();
    setOpenAIPending(true);
  };

  const apiKey = apiKeys.gemini ?? "";
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  useEffect(() => {
    const initGeminiChat = () => {
      try {
        const chatSession = model.startChat({
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
  }, []);

  const handleGeminiSubmission = async () => {
    try {
      if (chat) {
        const response = await chat.sendMessage(input);
        const botMessage = aiMessage(response.response.text(), AIModel.Gemini);
        setMessages((prevMessages) => [...prevMessages, { ...botMessage }]);
      }
    } catch (error) {
      setError("There is an error sending the message");
    }
  };

  return (
    <div>
      {error && <div>{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter your prompt..."
            value={input}
            onChange={onChange}
            className="grow"
          />
          <Button type="submit" className="flex-none">
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
