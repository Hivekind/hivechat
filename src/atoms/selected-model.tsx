import { atom } from "recoil";

export const selectedModel1State = atom<string>({
  key: "selectedModel1State",
  default: "gpt-4o-mini",
});

export const selectedModel2State = atom<string>({
  key: "selectedModel2State",
  default: "gemini-1.5-flash",
});
