import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MessageData, MessageType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const userMessage = (message: string): MessageData => {
  return {
    name: "YOU",
    message,
    type: MessageType.Send,
    timestamp: new Date(),
  };
};

export const aiMessage = (message: string): MessageData => {
  return {
    name: "AI",
    message,
    type: MessageType.Recv,
    timestamp: new Date(),
  };
};
