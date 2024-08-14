import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MessageData, MessageType } from "@/types";
import { v1 } from "uuid";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

export const checkGemini = async (apiKey: string) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const aiModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  const chatSession = aiModel.startChat();
  const response = chatSession.sendMessage("hello");

  return response;
};

export const maskApiKey = (apiKey: string, leading = 4, trailing = 4) => {
  if (!apiKey) return;
  if (apiKey.length < leading + trailing) return apiKey;

  return apiKey.replace(
    apiKey.substring(leading, apiKey.length - trailing),
    "x".repeat(8)
  );
};
