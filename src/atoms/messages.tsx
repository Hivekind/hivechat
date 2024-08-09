import { atom } from "recoil";
import { MessageData } from "@/types";

export const messageState = atom<MessageData[]>({
  key: "messageState",
  default: [
    {
      type: "recv",
      name: "AI",
      timestamp: new Date(),
      message: "Hello!",
    },
    {
      type: "send",
      name: "YOU",
      timestamp: new Date(),
      message: "test",
    },
  ],
});
