export const enum MessageType {
  Send = "send",
  Recv = "recv",
}

export const enum AIModel {
  AI = "AI",
  OpenAI = "OpenAI",
  Gemini = "Gemini",
}

export type MessageData = {
  name: string;
  timestamp?: Date;
  message: string;
  type: MessageType;
  streaming?: boolean;
};
