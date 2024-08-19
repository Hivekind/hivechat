"use client";

import { useEffect } from "react";
import {
  RecoilRoot,
  useRecoilValue,
  useRecoilState,
  useResetRecoilState,
} from "recoil";
import MessageForm from "@/components/message-form";
import { OuterChatBox } from "@/components/outer-chat-box";
import ApiKeyDialog from "@/components/api-key-dialog";
import { window1State, window2State } from "@/atoms/messages";
import {
  selectedModel1State,
  selectedModel2State,
} from "@/atoms/selected-model";
import HivekindLogo from "../../public/images/hivekind.svg";

import {
  streamedResponse1State,
  streamedResponse2State,
} from "@/atoms/streamed-response";
import { openAIApiKeyState, geminiApiKeyState } from "@/atoms/api-keys";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import TentLogo from "../../public/images/tent.svg";
import GithubLogo from "../../public/images/github.svg";
import Link from "next/link";

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

  const resetWindow1Messages = useResetRecoilState(window1State);
  const resetWindow2Messages = useResetRecoilState(window2State);

  const [selectedModel1, setSelectedModel1] =
    useRecoilState(selectedModel1State);
  const [selectedModel2, setSelectedModel2] =
    useRecoilState(selectedModel2State);

  const [streamedResponse1, setStreamedResponse1] = useRecoilState(
    streamedResponse1State
  );
  const [streamedResponse2, setStreamedResponse2] = useRecoilState(
    streamedResponse2State
  );

  const messages = [window1Messages, window2Messages];
  const setMessages = [setWindow1Messages, setWindow2Messages];
  const streamedResponses = [streamedResponse1, streamedResponse2];
  const setStreamedResponses = [setStreamedResponse1, setStreamedResponse2];
  const selectedModels = [selectedModel1, selectedModel2];
  const setSelectedModels = [setSelectedModel1, setSelectedModel2];

  const openAIApiKey = useRecoilValue(openAIApiKeyState);
  const geminiApiKey = useRecoilValue(geminiApiKeyState);

  const resetSession = () => {
    resetWindow1Messages();
    resetWindow2Messages();
  };

  useEffect(() => {
    resetWindow1Messages();
    resetWindow2Messages();
  }, [
    selectedModel1,
    selectedModel2,
    resetWindow1Messages,
    resetWindow2Messages,
  ]);

  return (
    <>
      <div className="hidden h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <div className="flex gap-5 w-full">
            <Link href="/">
              <h1 className="text-xl font-semibold border-r border-slate-200 pr-5">
                Compare AI Models
              </h1>
            </Link>
            <a
              target="_blank"
              href="https://hivekind.com/"
              rel="noopener noreferrer"
              className="content-center"
            >
              <Image
                src={HivekindLogo}
                alt="Hivekind"
                width={135}
                height={100}
              />
            </a>
          </div>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end items-center text-sm gap-2">
            <Button className="" onClick={resetSession}>
              New Session
            </Button>
            <ApiKeysCta />
            <a
              target="_blank"
              href="https://hivekind.com/"
              rel="noopener noreferrer"
              className="flex gap-2"
            >
              <Image
                src={TentLogo}
                alt="Visit Hivekind.com"
                width={16}
                height={16}
              />
              <p>Visit Hivekind.com</p>
            </a>
            <a
              target="_blank"
              href="https://github.com/Hivekind"
              rel="noopener noreferrer"
              className="pl-4"
            >
              <Image src={GithubLogo} alt="Github" width={16} height={16} />
            </a>
          </div>
        </div>
        <div className="p-8 pt-2">
          <div className="flex h-full flex-col space-y-4">
            <div className="flex flex-row gap-4">
              {selectedModels.map((model, index) => {
                return (
                  <OuterChatBox
                    key={index}
                    selectedModel={model}
                    setSelectedModel={setSelectedModels[index]}
                    messages={messages[index]}
                    setMessages={setMessages[index]}
                    streamedResponse={streamedResponses[index]}
                    setStreamedResponse={setStreamedResponses[index]}
                    openAIApiKey={openAIApiKey}
                    geminiApiKey={geminiApiKey}
                  ></OuterChatBox>
                );
              })}
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
