import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MessageData, MessageType } from "@/types";
import { v1 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const userMessage = (message: string): MessageData => {
  return {
    id: uuid(),
    name: "YOU",
    message,
    type: MessageType.Send,
    timestamp: new Date(),
  };
};

export const aiMessage = (message: string, name: string): MessageData => {
  return {
    id: uuid(),
    name,
    message,
    type: MessageType.Recv,
    timestamp: new Date(),
  };
};

// generates a "sortable" uuid
// see https://github.com/uuidjs/uuid/issues/75#issuecomment-25936084
export const uuid = () => {
  return v1().replace(/^(.{8})-(.{4})-(.{4})/, "$3-$2-$1");
};
