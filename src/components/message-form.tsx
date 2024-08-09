"use client";

import { useRecoilState, useRecoilValue } from "recoil";
import { messageState } from "@/atoms/messages";
import { apiKeysState } from "@/atoms/api-keys";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { chatCompletion } from "@/lib/openai";

export default function MessageForm() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useRecoilState(messageState);
  const apiKeys = useRecoilValue(apiKeysState);

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    setInput(event.currentTarget.value);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!input || input === "") return;

    // SY TODO: temporary workaround for state not immediately reflected after set
    const msgs = [...messages];
    msgs.push({
      type: "send",
      name: "YOU",
      timestamp: new Date(),
      message: input,
    });

    setMessages((current) => [
      ...current,
      {
        type: "send",
        name: "YOU",
        timestamp: new Date(),
        message: input,
      },
    ]);
    setInput("");

    const response = (await chatCompletion({ messagesData: msgs, apiKey: apiKeys.openai })) || "Response error ....";
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: "recv",
        name: "AI",
        timestamp: new Date(),
        message: response,
      }
    ]);
  };

  return (
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
  );
}
