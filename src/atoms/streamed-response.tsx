import { atom } from "recoil";

export const streamedResponseState = atom<string>({
  key: "streamedResponseState",
  default: "",
});
