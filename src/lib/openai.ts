import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export const chatCompletion = async (messages: Message[]) => {
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
    throw new Error("OpenAI Error: chat.completons.create");
  }
};

export const initiateChat = async (prompt: string) => {
  const assistantId = await createAssistant();

  const { threadId, response } = await createAndRunThread(assistantId, prompt);

  return {
    assistant_id: assistantId,
    thread_id: threadId,
    response,
  };
};

export const continueChat = async ({
  threadId,
  assistantId,
  prompt,
}: {
  threadId: string;
  assistantId: string;
  prompt: string;
}) => {
  const message_id = await createMessage(threadId, prompt);

  // const response = await runThread(threadId, assistantId);
  const response = await runThreadAndPoll(threadId, assistantId);

  return {
    message_id,
    response,
  };
};

export const createAssistant = async () => {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "My Assistant",
      model: "gpt-4o-mini",
    });

    console.log("assistant -- ", assistant);

    return assistant.id;
  } catch (error) {
    console.error(error);
    throw new Error("OpenAI Error: assistants.create");
  }
};

export const createAndRunThread = async (assistantId: string, prompt: string) => {
  const run = openai.beta.threads.createAndRunPoll({
    assistant_id: assistantId,
    thread: {
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }
  });

  const result = await run;
  console.log("createAndRunThread Result: ", result);

  const threadId = result.thread_id;

  const messageList = await openai.beta.threads.messages.list(threadId, {
    limit: 1,
    order: "desc",
  });

  console.log("messageList: ", messageList);

  let message: string = "";
  const content = messageList.data[0].content[0];
  if (content.type === "text") {
    message = content.text.value;
    console.log("Message content: ", message);
  }

  return {
    threadId,
    response: message,
  };
};

export const createThread = async () => {
  try {
    const thread = await openai.beta.threads.create();

    console.log("thread -- ", thread);

    return thread.id;
  } catch (error) {
    console.error(error);
    throw new Error("OpenAI Error: threads.create");
  }
};

export const createMessage = async (threadId: string, prompt: string) => {
  try {
    const message = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: prompt,
    });

    console.log("message -- ", message);

    return message.id;
  } catch (error) {
    console.error(error);
    throw new Error("OpenAI Error: threads.messages.create");
  }
};

export const runThread = async (threadId: string, assistantId: string) => {
  let response: string = "";

  const run = openai.beta.threads.runs
    .stream(threadId, {
      assistant_id: assistantId,
    })
    //Subscribe to streaming events and log them
    // .on('event', (event) => console.log("stream event: ", event))
    // .on('textDelta', (delta, snapshot) => console.log("stream textDelta: ", snapshot))
    // .on('messageDelta', (delta, snapshot) => console.log("stream messageDelta: ", snapshot))
    // .on('run', (run) => console.log("stream run: ", run))
    // .on('connect', () => console.log("stream connect"))
    .on("textDone", (text) => {
      console.log("stream textDone: ", text);
      console.log("stream textDone value: ", text.value);

      response = text.value;
    });

  const result = await run.finalRun();
  console.log("Run Result: ", result);

  return response;
};


export const runThreadAndPoll = async (threadId: string, assistantId: string) => {
  const run = openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistantId,
  });

  const result = await run;
  console.log("runThreadAndPoll Result: ", result);

  const messageList = await openai.beta.threads.messages.list(threadId, {
    limit: 1,
    order: "desc",
  });

  console.log("messageList: ", messageList);

  const content = messageList.data[0].content[0];
  if (content.type === "text") {
    const message = content.text.value;

    console.log("lastMessage content: ", message);
    return message;
  }

  return "";
};
