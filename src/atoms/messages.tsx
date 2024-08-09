import { atom } from "recoil";
import { MessageData, MessageType } from "@/types";

export const messageState = atom<MessageData[]>({
  key: "messageState",
  default: [
    {
      type: MessageType.Recv,
      name: "AI",
      timestamp: new Date(),
      message: "Hello!",
    },
  ],
});
