"use client";

import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { window1State, window2State } from "@/atoms/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userMessage } from "@/lib/utils";

export default function MessageForm() {
  const [input, setInput] = useState("");
  const setWindow1Messages = useSetRecoilState(window1State);
  const setWindow2Messages = useSetRecoilState(window2State);

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    setInput(event.currentTarget.value);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!input || input === "") return;

    setWindow1Messages((current) => [...current, userMessage(input)]);
    setWindow2Messages((current) => [...current, userMessage(input)]);
    setInput("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="flex w-3/5 items-center gap-2 mx-auto">
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
