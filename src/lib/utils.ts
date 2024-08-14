import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MessageData, MessageType, Metrics } from "@/types";
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

export const aiMessage = (
  message: string,
  name: string,
  metrics: Metrics | null
): MessageData => {
  return {
    id: uuid(),
    name,
    message,
    type: MessageType.Recv,
    timestamp: new Date(),
    metrics: metrics,
  };
};

// generates a "sortable" uuid
// see https://github.com/uuidjs/uuid/issues/75#issuecomment-25936084
export const uuid = () => {
  return v1().replace(/^(.{8})-(.{4})-(.{4})/, "$3-$2-$1");
};

export const checkOpenAI = async (bearerToken: string) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      accept: "*/*",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      authorization: `Bearer ${bearerToken}`,
      "content-type": "application/json",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    body: '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"hello"}]}',
    method: "POST",
    mode: "cors",
    credentials: "omit",
  });

  return response;
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

export const formattedCalculatedMetrics = (
  startTime: number,
  tokensCount: number,
  firstTokenTime: number | null,
  cost: number
) => {
  const endTime = performance.now();
  const totalTimeTaken = endTime - startTime;
  return {
    timeTaken: totalTimeTaken / 1000,
    tokensUsed: tokensCount,
    tokensPerSec: tokensCount / (totalTimeTaken / 1000),
    apiCreditsUsed: tokensCount * cost,
    firstTokenTime: firstTokenTime,
  };
};
