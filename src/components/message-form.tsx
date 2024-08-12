"use client";

import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { window1State, window2State } from "@/atoms/messages";
import { apiKeysState } from "@/atoms/api-keys";
import { streamedResponseState } from "@/atoms/streamed-response";

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

import { chatStream } from "@/lib/openai";
import { AIModel } from "@/types";
import { userMessage, aiMessage } from "@/lib/utils";

export default function MessageForm() {
  const [input, setInput] = useState("");
  const [window1Messages, setWindow1Messages] = useRecoilState(window1State);
  const setWindow2Messages = useSetRecoilState(window2State);
  const apiKeys = useRecoilValue(apiKeysState);
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openAIPending, setOpenAIPending] = useState<boolean>(false);
  const [openAIClient, setOpenAIClient] = useState<OpenAI | null>(null);
  const setStreamedResponse = useSetRecoilState(streamedResponseState);

  useEffect(() => {
    const client = new OpenAI({
      apiKey: apiKeys.openai,
      dangerouslyAllowBrowser: true,
    });

    setOpenAIClient(client);
  }, [apiKeys]);

  useEffect(() => {
    if (!openAIPending) return;

    const streamOpenAI = async () => {
      try {
        let finalResponse = "";

        await chatStream({
          messagesData: window1Messages,
          client: openAIClient,
          onStream: (chunk) => {
            const chunkContent = chunk.choices[0]?.delta?.content || "";
            finalResponse += chunkContent;

            setStreamedResponse((prev) => prev + chunkContent);
          },
        });

        setWindow1Messages((prevMessages) => [
          ...prevMessages,
          aiMessage(finalResponse, AIModel.OpenAI),
        ]);

        setStreamedResponse("");
      } catch (error) {
        console.error("Error stream from OpenAI:", error);
      }
    };

    setOpenAIPending(false);
    streamOpenAI();
  }, [
    window1Messages,
    openAIClient,
    openAIPending,
    setWindow1Messages,
    setOpenAIPending,
    setStreamedResponse,
  ]);

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    setInput(event.currentTarget.value);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!input || input === "") return;

    setWindow1Messages((current) => [...current, userMessage(input)]);
    setWindow2Messages((current) => [...current, userMessage(input)]);
    setInput("");

    handleGeminiSubmission();
    setOpenAIPending(true);
  };

  useEffect(() => {
    const apiKey = apiKeys.gemini ?? "";
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

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
  }, [apiKeys.gemini]);

  const handleGeminiSubmission = async () => {
    try {
      if (chat) {
        const response = await chat.sendMessage(input);
        const botMessage = aiMessage(response.response.text(), AIModel.Gemini);
        setWindow2Messages((prevMessages) => [
          ...prevMessages,
          { ...botMessage },
        ]);
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
