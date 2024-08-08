import { atom } from "recoil";

export const messageState = atom({
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
