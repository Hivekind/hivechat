export const types = ["GPT-3", "Gemini"] as const;

export type ModelType = (typeof types)[number];

export type Model = {
  id: string;
  name: string;
  description: string;
  strengths?: string;
  type: ModelType;
};

export const models: Model[] = [
  {
    id: "c305f976-8e38-42b1-9fb7-d21b2e34f0da",
    name: "gpt-4o-mini",
    description:
      "Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text.",
    type: "GPT-3",
    strengths:
      "I am an AI language model designed to provide information, answer questions, and assist with various tasks through natural language understanding. My strengths include quick information retrieval, creative content generation, multilingual support, and problem-solving capabilities.",
  },
  {
    id: "f4b8f4b4-7f0b-4f0b-8e3d-3f1f2f1b1f1f",
    name: "gemini-1.5-flash",
    description:
      "A model that can generate text and code, with a focus on speed and low-latency. It is particularly good at generating short responses.",
    type: "Gemini",
    strengths:
      "I excel at accessing and processing information, offering a wide range of knowledge, and communicating effectively in various languages. I also continuously learn and adapt, becoming more accurate and helpful over time.",
  },
];

export const getModel = (name: string) => {
  return models.find((model) => model.name === name);
};
