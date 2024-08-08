import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export const generateText = async (messages: Message[]) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });

    console.log("completion -- ", completion);
    console.log("message -- ", completion.choices[0].message.content);

    return completion.choices[0].message.content;

  } catch (error) {
    console.error(error);
    throw new Error("Error fetching data from OpenAI");
  }
};
