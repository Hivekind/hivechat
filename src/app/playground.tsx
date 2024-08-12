"use client";

import { Separator } from "@/components/ui/separator";
import { RecoilRoot, useRecoilValue } from "recoil";
import MessageForm from "@/components/message-form";
import ChatBox from "@/components/chat-box";
import ApiKeyDialog from "@/components/api-key-dialog";
import { MessageData } from "@/types";
import { messageState } from "@/atoms/messages";

export default function Playground() {
  return (
    <RecoilRoot>
      <MainApp />
    </RecoilRoot>
  );
}

function MainApp() {
  const messages: MessageData[] = useRecoilValue(messageState);
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
              <ChatBox messages={messages} />
              <ChatBox messages={messages} />
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
