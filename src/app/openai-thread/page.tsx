"use client";

import { useState, useEffect } from "react";
import { initiateChat, continueChat } from "@/lib/openai";

export type Message = {
  role: string;
  content: string;
};

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");

  const [assistantId, setAssistantId] = useState("");
  const [threadId, setThreadId] = useState("");

  // get chat history from session storage
  useEffect(() => {
    const storedMessages = sessionStorage.getItem("chatHistory");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      setMessages([
        { role: "assistant", content: "Hello, how may I help you?" },
      ]);
    }

    const storedAssistantId = sessionStorage.getItem("assistantId");
    if (storedAssistantId) {
      setAssistantId(JSON.parse(storedAssistantId));
    } 

    const storedThreadId = sessionStorage.getItem("threadId");
    if (storedThreadId) {
      setThreadId(JSON.parse(storedThreadId));
    } 
  }, []);



  // save chat history to session storage
  useEffect(() => {
    sessionStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    sessionStorage.setItem("assistantId", JSON.stringify(assistantId));
  }, [assistantId]);

  useEffect(() => {
    sessionStorage.setItem("threadId", JSON.stringify(threadId));
  }, [threadId]);




  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userInput) {
      alert("No user input ...");
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userInput },
    ]);
    setUserInput("");

    if (!threadId) {
      console.log("initiating chat ...");

      const { assistant_id, thread_id, response } = await initiateChat(
        userInput
      );

      setAssistantId(assistant_id);
      setThreadId(thread_id);

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: response },
      ]);

      return;
    }

    console.log("Continue chat ...");

    const { message_id, response } = await continueChat({
      threadId,
      assistantId,
      prompt: userInput
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: response },
    ]);
  };

  return (
    <div>
      <div className="chat-history">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 m-4 rounded-lg ${
              message.role === "user"
                ? "bg-gray-200 text-gray-800"
                : "bg-blue-500 text-white"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex items-end p-4">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="border-black border-2 p-4 rounded-lg w-1/3"
            rows={5}
          />
          <button
            type="submit"
            className="ml-10 p-4 rounded-lg bg-gray-300 h-10 flex justify-center items-center"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
