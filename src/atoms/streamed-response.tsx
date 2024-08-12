import { atom } from "recoil";

export const streamedResponse1State = atom<string>({
  key: "streamedResponse1State",
  default: "",
});

export const streamedResponse2State = atom<string>({
  key: "streamedResponse2State",
  default: "",
});
