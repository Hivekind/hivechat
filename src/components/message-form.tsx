"use client";

import { useRecoilState, useRecoilValue } from "recoil";
import { messageState } from "@/atoms/messages";
import { apiKeysState } from "@/atoms/api-keys";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { safetySettings, generationConfig } from "@/data/gemini-settings";

interface ChatSession {
  sendMessage: (
    message: string
  ) => Promise<{ response: { text: () => string } }>;
}

import { chatCompletion } from "@/lib/openai";
import { MessageType } from "@/types";
import { userMessage, aiMessage } from "@/lib/utils";

export default function MessageForm() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useRecoilState(messageState);
  const apiKeys = useRecoilValue(apiKeysState);
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    setInput(event.currentTarget.value);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!input || input === "") return;

    // SY TODO: temporary workaround for state not immediately reflected after set
    const msgs = [...messages];
    msgs.push(userMessage(input));

    setMessages((current) => [...current, userMessage(input)]);
    setInput("");

    const response =
      (await chatCompletion({ messagesData: msgs, apiKey: apiKeys.openai })) ||
      "Response error ....";
    setMessages((prevMessages) => [...prevMessages, aiMessage(response)]);
    handleSendMessage();
  };

  const apiKey =
    process.env.GEMINI_API_KEY ?? "AIzaSyCxVKjkJKsCg1O8FnSUSRXXsHiPYPSd6_8";
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  useEffect(() => {
    const initChat = () => {
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

    initChat();
  }, []);

  const handleSendMessage = async () => {
    try {
      const userMessage = {
        type: MessageType.Send,
        name: "YOU",
        timestamp: new Date(),
        message: input,
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");
      if (chat) {
        const response = await chat.sendMessage(input);
        const botMessage = {
          type: MessageType.Recv,
          name: "AI",
          timestamp: new Date(),
          message: response.response.text(),
        };
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
