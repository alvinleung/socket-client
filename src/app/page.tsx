"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("https://server-chocopie.digital:3000");

export default function Home() {

  const [message, setMessage] = useState("");

  useEffect(()=>{
    socket.on("connect", ()=> {
      setMessage("Connected to server")
    })

    return ()=> {
      socket.off("connect");
    }
  })

  return (
    <div>
      <div>
        System Message: {message}
      </div>
      <div>
        Connected? {socket.connected}
      </div>
    </div>
  );
}
