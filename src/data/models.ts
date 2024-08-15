export const types = ["OpenAI", "Gemini"] as const;

export type ModelType = (typeof types)[number];

export type Model = {
  id: string;
  name: string;
  outputCost: number;
  type: ModelType;
  description: string;
  strengths?: string;
};

export const models: Model[] = [
  {
    id: "c305f976-8e38-42b1-9fb7-d21b2e34f0d1",
    name: "gpt-4o",
    outputCost: 0.015, // ref: https://artificialanalysis.ai/models/gpt-4o/providers
    type: "OpenAI",
    description:
      "A high-intelligence flagship model for complex, multi-step tasks.",
    strengths: "",
  },
  {
    id: "c305f976-8e38-42b1-9fb7-d21b2e34f0d2",
    name: "gpt-4o-mini",
    outputCost: 0.0006, // ref: https://artificialanalysis.ai/models/gpt-4o-mini/providers
    type: "OpenAI",
    description:
      "An affordable and intelligent small model for fast, lightweight tasks.",
    strengths:
      "I am an AI language model designed to provide information, answer questions, and assist with various tasks through natural language understanding. My strengths include quick information retrieval, creative content generation, multilingual support, and problem-solving capabilities.",
  },
  {
    id: "c305f976-8e38-42b1-9fb7-d21b2e34f0d3",
    name: "gpt-4-turbo",
    outputCost: 0.03, // ref: https://artificialanalysis.ai/models/gpt-4-turbo/providers
    type: "OpenAI",
    description: "The latest GPT-4 Turbo model with vision capabilities.",
    strengths: "",
  },
  {
    id: "c305f976-8e38-42b1-9fb7-d21b2e34f0d4",
    name: "gpt-4",
    outputCost: 0.06, // ref: https://artificialanalysis.ai/models/gpt-4/providers
    type: "OpenAI",
    description: "The previous set of high-intelligence models.",
    strengths: "",
  },
  {
    id: "c305f976-8e38-42b1-9fb7-d21b2e34f0d5",
    name: "gpt-3.5-turbo",
    outputCost: 0.0015, // ref: https://artificialanalysis.ai/models/gpt-3.5-turbo/providers
    type: "OpenAI",
    description: "A fast, inexpensive model for simple tasks.",
    strengths: "",
  },
  {
    id: "f4b8f4b4-7f0b-4f0b-8e3d-3f1f2f1b1f11",
    name: "gemini-1.5-flash",
    description:
      "A fast and versatile multimodal model for scaling across diverse tasks.",
    outputCost: 0.0003, // ref: https://artificialanalysis.ai/models/gemini-1.5-flash/providers
    type: "Gemini",
    strengths:
      "I excel at accessing and processing information, offering a wide range of knowledge, and communicating effectively in various languages. I also continuously learn and adapt, becoming more accurate and helpful over time.",
  },
  {
    id: "f4b8f4b4-7f0b-4f0b-8e3d-3f1f2f1b1f12",
    name: "gemini-1.5-pro",
    description:
      "A mid-size multimodal model that is optimized for a wide-range of reasoning tasks.",
    outputCost: 0.0105, // ref: https://artificialanalysis.ai/models/gemini-1.5-pro/providers
    type: "Gemini",
    strengths: "",
  },
  {
    id: "f4b8f4b4-7f0b-4f0b-8e3d-3f1f2f1b1f13",
    name: "gemini-1.0-pro",
    description:
      "A Natural Language Processing model that handles tasks like multi-turn text and code chat, and code generation.",
    outputCost: 0.0015, // ref: https://artificialanalysis.ai/models/gemini-1.0-pro/providers
    type: "Gemini",
    strengths: "",
  },
];

export const getModel = (name: string) => {
  return models.find((model) => model.name === name);
};
