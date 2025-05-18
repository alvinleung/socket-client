"use client";

import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let _socket: Socket;
function useSocket() {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  useEffect(() => {
    // create _socket singleton
    if (!_socket) {
      _socket = io("https://server-chocopie.digital:3000");
    }
    setSocket(_socket);
  }, []);
  return socket;
}

interface Message {
  userId: string;
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      setMessages((prev) => [
        ...prev,
        { userId: "system", content: "Connected to server" },
      ]);
    });

    socket.on("message", ({ content, userId }) => {
      setMessages((prev) => [...prev, { userId, content }]);
    });

    return () => {
      socket.off("connect");
    };
  }, [socket]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!socket) return;
      if (e.key !== "Enter") return;

      // submit the message
      const msgbox = e.target as HTMLInputElement;
      socket.emit("message", msgbox.value);

      // empty the box
      msgbox.value = "";
    },
    [socket],
  );
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [messages]);

  return (
    <div className="mx-auto max-w-[500px] mt-8 relative font-mono">
      <div className="flex flex-col gap-2 mb-24">
        {messages.map((msg, index) => {
          return (
            <div key={index} className="flex flex-col">
              <div className="text-xs opacity-60">{msg.userId}</div>
              <div className="text-base">{msg.content}</div>
            </div>
          );
        })}
      </div>
      <input
        className="mx-auto max-w-[500px] bg-zinc-800 px-4 py-2 w-full rounded-2xl fixed bottom-4"
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
