"use client";

import { Separator } from "@/components/ui/separator";
import { RecoilRoot, useRecoilValue, useRecoilState } from "recoil";
import MessageForm from "@/components/message-form";
import GeminiChatBox from "@/components/gemini-chat-box";
import OpenAIChatBox from "@/components/openAI-chat-box";
import ApiKeyDialog from "@/components/api-key-dialog";
import { window1State, window2State } from "@/atoms/messages";
import {
  selectedModel1State,
  selectedModel2State,
} from "@/atoms/selected-model";
import { getModel } from "@/data/models";
import type { Model } from "@/data/models";

import {
  streamedResponse1State,
  streamedResponse2State,
} from "@/atoms/streamed-response";
import { openAIApiKeyState, geminiApiKeyState } from "@/atoms/api-keys";

export default function Playground() {
  return (
    <RecoilRoot>
      <MainApp />
    </RecoilRoot>
  );
}

function MainApp() {
  const [window1Messages, setWindow1Messages] = useRecoilState(window1State);
  const [window2Messages, setWindow2Messages] = useRecoilState(window2State);

  const selectedModel1 = useRecoilValue(selectedModel1State);
  const selectedModel2 = useRecoilValue(selectedModel2State);

  const [streamedResponse1, setStreamedResponse1] = useRecoilState(
    streamedResponse1State
  );
  const [streamedResponse2, setStreamedResponse2] = useRecoilState(
    streamedResponse2State
  );

  const models: Model[] = [
    getModel(selectedModel1),
    getModel(selectedModel2),
  ].filter((model) => model !== undefined) as Model[];

  const messages = [window1Messages, window2Messages];
  const setMessages = [setWindow1Messages, setWindow2Messages];
  const streamedResponses = [streamedResponse1, streamedResponse2];
  const setStreamedResponses = [setStreamedResponse1, setStreamedResponse2];

  const openAIApiKey = useRecoilValue(openAIApiKeyState);
  const geminiApiKey = useRecoilValue(geminiApiKeyState);

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
              {models.map((model, index) =>
                model.type === "OpenAI" ? (
                  <OpenAIChatBox
                    key={model.id}
                    messages={messages[index]}
                    setMessages={setMessages[index]}
                    streamedResponse={streamedResponses[index]}
                    setStreamedResponse={setStreamedResponses[index]}
                    model={model}
                    apiKey={openAIApiKey}
                  />
                ) : (
                  <GeminiChatBox
                    key={model.id}
                    messages={messages[index]}
                    setMessages={setMessages[index]}
                    streamedResponse={streamedResponses[index]}
                    setStreamedResponse={setStreamedResponses[index]}
                    model={model}
                    apiKey={geminiApiKey}
                  />
                )
              )}
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
