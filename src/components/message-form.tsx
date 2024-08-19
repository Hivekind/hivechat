"use client";

import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { window1State, window2State } from "@/atoms/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userMessage } from "@/lib/utils";
import StatefulButton, { ButtonStates } from "./stateful-button";

export default function MessageForm() {
  const [input, setInput] = useState("");
  const [sendState, setSendState] = useState(ButtonStates.disabled);
  const setWindow1Messages = useSetRecoilState(window1State);
  const setWindow2Messages = useSetRecoilState(window2State);

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (
      sendState === ButtonStates.disabled &&
      event.currentTarget.value !== ""
    ) {
      setSendState(ButtonStates.default);
    } else if (
      sendState !== ButtonStates.disabled &&
      event.currentTarget.value === ""
    ) {
      setSendState(ButtonStates.disabled);
    }

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
      <form onSubmit={onSubmit} name="message-form">
        <div className="flex w-3/5 items-center gap-2 mx-auto">
          <Input
            type="text"
            placeholder="Enter your prompt..."
            value={input}
            onChange={onChange}
            className="grow"
          />
          <StatefulButton type="submit" className="flex-none" state={sendState}>
            Send
          </StatefulButton>
        </div>
      </form>
    </div>
  );
}
