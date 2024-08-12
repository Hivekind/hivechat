import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useRecoilState } from "recoil";
import { openAIApiKeyState, geminiApiKeyState } from "@/atoms/api-keys";
import Image from "next/image";
import SettingsLogo from "../../public/images/settings.svg";

import { checkOpenAI, checkGemini, maskApiKey } from "@/lib/utils";
import { ButtonStates } from "./stateful-button";
import { useState } from "react";
import { ApiKeyInput } from "./api-key-input";

export default function ApiKeyDialog() {
  const [openAIApiPersistedKey, setOpenAIApiPersistedKey] =
    useRecoilState(openAIApiKeyState);
  const [geminiApiPersistedKey, setGeminiApiPersistedKey] =
    useRecoilState(geminiApiKeyState);

  const [openAIApiKey, setOpenAIApiKey] = useState(openAIApiPersistedKey);
  const [geminiApiKey, setGeminiApiKey] = useState(geminiApiPersistedKey);

  const [openAIApiKeyError, setOpenAIApiKeyError] = useState(false);
  const [geminiApiKeyError, setGeminiApiKeyError] = useState(false);

  const [openAIButtonState, setOpenAIButtonState] = useState(
    ButtonStates.default
  );
  const [geminiButtonState, setGeminiButtonState] = useState(
    ButtonStates.default
  );

  const onSubmitOpenAI: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    setOpenAIButtonState(ButtonStates.busy);

    if (openAIApiKey === "") {
      setOpenAIButtonState(ButtonStates.success);
      setOpenAIApiKeyError(false);
      setOpenAIApiPersistedKey(openAIApiKey);
      return;
    }

    const response = await checkOpenAI(openAIApiKey);

    if (response.status != 200) {
      setOpenAIButtonState(ButtonStates.default);
      setOpenAIApiKeyError(true);
    } else {
      setOpenAIButtonState(ButtonStates.success);
      setOpenAIApiKeyError(false);
      setOpenAIApiPersistedKey(openAIApiKey);
    }
  };

  const onSubmitGemini: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    setGeminiButtonState(ButtonStates.busy);

    if (geminiApiKey === "") {
      setGeminiButtonState(ButtonStates.success);
      setGeminiApiKeyError(false);
      setGeminiApiPersistedKey(geminiApiKey);
    }

    try {
      await checkGemini(geminiApiKey);
      setGeminiButtonState(ButtonStates.success);
      setGeminiApiKeyError(false);
      setGeminiApiPersistedKey(geminiApiKey);
    } catch (error) {
      console.log(error);
      setGeminiButtonState(ButtonStates.default);
      setGeminiApiKeyError(true);
      return;
    }
  };

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        // reset the dialog state when the modal is opened
        if (isOpen) {
          setOpenAIButtonState(ButtonStates.default);
          setGeminiButtonState(ButtonStates.default);

          // reset input fields if there are any errors
          if (openAIApiKeyError) {
            setOpenAIApiKey("");
            setOpenAIApiKeyError(false);
          }
          if (geminiApiKeyError) {
            setGeminiApiKey("");
            setGeminiApiKeyError(false);
          }

          // if there's an api key persisted, assume that the key is valid
          if (openAIApiPersistedKey) {
            setOpenAIApiKey(maskApiKey(openAIApiPersistedKey));
            setOpenAIButtonState(ButtonStates.disabled);
          }
          if (geminiApiPersistedKey) {
            setGeminiApiKey(maskApiKey(geminiApiPersistedKey));
            setGeminiButtonState(ButtonStates.disabled);
          }
        }
      }}
    >
      <DialogTrigger asChild>
        <div className="flex gap-2">
          <Image src={SettingsLogo} alt="Hivekind" width={16} height={16} />
          <p>API Keys</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Keys</DialogTitle>
          <DialogDescription>
            We store your API keys on your browser and use it only for
            communicating with the selected API models
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-8">
          <ApiKeyInput
            name="OpenAI"
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            url="https://platform.openai.com/account/api-keys"
            onSubmit={onSubmitOpenAI}
            value={openAIApiKey ?? ""}
            setValue={setOpenAIApiKey}
            buttonState={openAIButtonState}
            setButtonState={setOpenAIButtonState}
            isValid={!openAIApiKeyError}
          />
          <ApiKeyInput
            name="Gemini"
            placeholder="AIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            url="https://makersuite.google.com/app/apikey"
            onSubmit={onSubmitGemini}
            value={geminiApiKey ?? ""}
            setValue={setGeminiApiKey}
            buttonState={geminiButtonState}
            setButtonState={setGeminiButtonState}
            isValid={!geminiApiKeyError}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
