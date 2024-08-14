import { atom } from "recoil";
import { MessageData, MessageType } from "@/types";

export const window1State = atom<MessageData[]>({
  key: "window1State",
  default: [
    {
      id: "11ef-585e-b5737eb0-9943-27d32153fb28",
      type: MessageType.Recv,
      name: "AI",
      timestamp: new Date(),
      message: "Hello! from AI",
      metrics: {
        timeTaken: 0.0,
        tokensUsed: 0,
        tokensPerSec: 0.0,
        apiCreditsUsed: 0,
        firstTokenTime: null,
      },
    },
  ],
});

export const window2State = atom<MessageData[]>({
  key: "window2State",
  default: [
    {
      id: "11ef-585e-b5737eb0-9943-27d32153fb27",
      type: MessageType.Recv,
      name: "AI",
      timestamp: new Date(),
      message: "Hello! from AI",
      metrics: {
        timeTaken: 0.0,
        tokensUsed: 0,
        tokensPerSec: 0.0,
        apiCreditsUsed: 0,
        firstTokenTime: null,
      },
    },
  ],
});
