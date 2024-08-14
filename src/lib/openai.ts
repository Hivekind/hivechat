import OpenAI from "openai";
import { MessageData, MessageType } from "@/types";

const toOpenAIMessages = (messagesData: MessageData[]) => {
  const messages: OpenAI.ChatCompletionMessageParam[] = messagesData.map(
    (messageData) => {
      return {
        role: messageData.type === MessageType.Send ? "user" : "assistant",
        content: messageData.message,
      };
    }
  );

  return messages;
};

type chatCompletionProps = {
  messagesData: MessageData[];
  client: OpenAI | null;
  model: string;
};

export const chatStream = async ({
  messagesData,
  client,
  model,
  onStream,
}: chatCompletionProps & { onStream: (chunk: any) => void }) => {
  if (!client) {
    throw new Error("OpenAI client not initialized");
  }

  const messages = toOpenAIMessages(messagesData);

  try {
    const stream = await client.chat.completions.create({
      model,
      messages,
      stream: true,
      stream_options: { include_usage: true },
    });

    for await (const chunk of stream) {
      onStream(chunk);
    }
  } catch (error) {
    console.error(error);
    throw new Error("OpenAI Error: chat.completions.create stream");
  }
};

export const checkOpenAIKey = async (apiKey: string) => {
  let success = false;

  try {
    const client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "hello",
        },
      ],
    });

    success = true;
  } catch (error) {
    success = false;
  }

  return success;
};
