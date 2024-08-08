"use client";

import { useSetRecoilState } from "recoil";
import { messageState } from "@/atoms/messages";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MessageForm() {
  const [input, setInput] = useState("");
  const setMessage = useSetRecoilState(messageState);

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    setInput(event.currentTarget.value);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!input || input === "") return;
    setMessage((current) => [
      ...current,
      {
        type: "send",
        name: "YOU",
        timestamp: new Date(),
        message: input,
      },
    ]);
    setInput("");
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
