"use client";

import { useState, useEffect } from "react";
import { generateText } from "@/lib/openai";
import type { Message } from "@/lib/openai";

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");

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
  }, []);


  // save chat history to session storage
  useEffect(() => {
    sessionStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userInput) {
      alert("No user input ...");
      return;
    }

    const msgs = [...messages];
    msgs.push({ role: "user", content: userInput });

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userInput },
    ]);
    setUserInput("");

    const response = (await generateText(msgs)) || "Response error ....";
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
