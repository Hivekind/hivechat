import { atom } from "recoil";
import { MessageData, MessageType } from "@/types";

export const messageState = atom<MessageData[]>({
  key: "messageState",
  default: [
    {
      id: "11ef-585e-b5737eb0-9943-27d32153fb28",
      type: MessageType.Recv,
      name: "AI",
      timestamp: new Date(),
      message: "Hello!",
    },
  ],
});
