"use client";

import { Separator } from "@/components/ui/separator";
import { RecoilRoot, useRecoilValue } from "recoil";
import MessageForm from "@/components/message-form";
import ChatBox from "@/components/chat-box";
import ApiKeyDialog from "@/components/api-key-dialog";
import { MessageData } from "@/types";
import { window1State, window2State } from "@/atoms/messages";
import {
  selectedModel1State,
  selectedModel2State,
} from "@/atoms/selected-model";
import { getModel } from "@/data/models";

export default function Playground() {
  return (
    <RecoilRoot>
      <MainApp />
    </RecoilRoot>
  );
}

function MainApp() {
  const window1Messages: MessageData[] = useRecoilValue(window1State);
  const window2Messages: MessageData[] = useRecoilValue(window2State);
  const selectedModel1 = useRecoilValue(selectedModel1State);
  const selectedModel2 = useRecoilValue(selectedModel2State);

  const models = [getModel(selectedModel1), getModel(selectedModel2)];

  const messages = [window1Messages, window2Messages];

  return (
    <>
      <div className="hidden h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg font-semibold">Playground</h2>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <ApiKeysCta />
          </div>
        </div>
        <Separator />
        <div className="p-8">
          <div className="flex h-full flex-col space-y-4">
            <div className="flex flex-row">
              {models.map((model, index) => (
                <ChatBox
                  key={model.id}
                  messages={messages[index]}
                  model={model}
                />
              ))}
            </div>
            <MessageForm />
          </div>
        </div>
      </div>
    </>
  );
}

function ApiKeysCta() {
  return (
    <div className="mt-auto p-4">
      <ApiKeyDialog />
    </div>
  );
}
