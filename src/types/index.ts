export const enum MessageType {
  Send = "send",
  Recv = "recv",
}

export const enum AIModel {
  AI = "AI",
  OpenAI = "OpenAI",
  Gemini = "Gemini",
}

export type Metrics = {
  timeTaken: number;
  tokensUsed: number;
  tokensPerSec: number;
  apiCreditsUsed: number;
  firstTokenTime: number | null;
};

export type MessageData = {
  id: string;
  name: string;
  timestamp?: Date;
  message: string;
  type: MessageType;
  streaming?: boolean;
  metrics?: Metrics | null;
};
