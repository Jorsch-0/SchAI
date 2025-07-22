"use client";

import { GoogleGenAI } from "@google/genai";
import { useEffect, useRef, useState } from "react";

type Message = {
  role: "model" | "user";
  text: string;
};

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const ai = new GoogleGenAI({
    apiKey: 'AIzaSyAzQe-QOq2Zshp1GTsvvN9IVn32t8A3Ox4'
  });

  const chats = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [],
  });

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get("text") as string;
    if (text.trim()) {
      setMessages([...messages, { role: "user", text }]);
      e.currentTarget.reset();
      askAI(text);
    }
  };

  const askAI = async (text: string) => {
    try {
      const response = await chats.sendMessage({
        message: text,
      });

      const result = response.text

      if (result) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "model", text: result },
        ]);
      }
    } catch (error) {
      console.error("Error sending message to AI:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "model", text: "Sorry, something went wrong." },
      ]);
    }
  };

  return (
    <div className="h-full flex items-center flex-col">
      <div
        ref={scrollContainerRef}
        className="flex w-full flex-1 justify-center overflow-auto my-4"
      >
        <div className="flex w-full md:w-1/2 px-4 flex-col gap-5">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-4/5 rounded-2xl p-5 ${
                msg.role === "user" ? "self-end bg-accent" : "self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </div>
      <form
        className="flex w-full md:w-1/2 items-center gap-4 border-t p-4"
        onSubmit={handleSendMessage}
      >
        {/* This input remains hidden and is triggered by the button below. */}
        <input id="file" type="file" multiple={false} hidden />

        <button
          type="button"
          onClick={() => document.getElementById("file")?.click()}
          className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
          aria-label="Attach file"
        >
          {/* Replace with an actual Paperclip icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <input
          type="text"
          name="text"
          placeholder="Ask anything..."
          className="flex-1 rounded-full border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="rounded-full bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          aria-label="Send message"
        >
          {/* Replace with an actual ArrowUp icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
}
