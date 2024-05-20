import React, { useEffect, useState } from "react";
//@ts-ignore
export default function ChatBox({ socket }) {
  const [open, setOpen] = useState(false);
  const [sendMessage, setSendMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleMessage = ({
      name,
      sendMessage,
    }: {
      name: string;
      sendMessage: string;
    }) => {
      //@ts-ignore
      setMessages((prevMessages) => [
        ...prevMessages,
        { name, text: sendMessage },
      ]);
    };

    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket]);

  const sendMessages = () => {
    if (sendMessage.trim()) {
      socket.emit("message", { sendMessage });
      setSendMessage("");
    }
  };

  const toggleVisibility = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="z-40">
      <div>
        <button
          onClick={toggleVisibility}
          className="w-[6rem] h-[3rem] rounded-md text-xl font-bold bg-red-600 bottom-[1rem] text-white absolute"
        >
          Chat
        </button>
      </div>
      {open && (
        <div className="absolute bottom-[1rem] right-[10rem] w-[20rem] h-[30rem] bg-slate-100 text-black p-2 rounded-md shadow-lg flex flex-col">
          <div className="flex-grow overflow-y-auto">
            {messages.map((item, index) => (
              <div
                key={index}
                className="bg-slate-300 p-2 rounded-md my-2 shadow-sm"
              >
                <div className="font-bold text-cyan-700">
                  {/* @ts-ignore */}
                  {item.name}
                </div>
                <div>
                  {/* @ts-ignore */}
                  {item.text}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <div className="flex">
              <input
                onChange={(e) => setSendMessage(e.target.value)}
                value={sendMessage}
                type="text"
                className="w-full h-[2rem] p-2 bg-slate-400 text-white font-bold rounded-l-md"
                placeholder="Enter your message"
              />
              <button
                className="bg-indigo-500 rounded-r-md text-white w-[5rem]"
                onClick={sendMessages}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
