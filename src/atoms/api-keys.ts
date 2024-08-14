import { atom } from "recoil";
import { encryptedLocalStorageEffect } from "./local-storage-effect";

export const openAIApiKeyState = atom({
  key: "openAIApiKeyState",
  default: "",
  effects: [encryptedLocalStorageEffect("openAIApiKey")],
});

export const geminiApiKeyState = atom({
  key: "geminiApiKeyState",
  default: "",
  effects: [encryptedLocalStorageEffect("geminiApiKey")],
});
