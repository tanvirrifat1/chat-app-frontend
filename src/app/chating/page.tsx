"use client";

import React, { useState, useEffect } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { useGetMyInboxQuery } from "../redux/feature/msgAPI";
import { io, Socket } from "socket.io-client";

// Initialize Socket.IO client
const socket = io("http://10.10.12.25:5006", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default function Messenger() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Record<string, any[]>>({});

  const { data, isLoading } = useGetMyInboxQuery("");
  const currentUserId = "6881bd7d4be36a3b3e49c432"; // Replace with actual logged-in user ID

  const chats =
    data?.data?.data?.map((inbox: any) => ({
      id: inbox.inboxId,
      name: inbox.name,
      avatar: inbox.image,
      lastMessage: inbox.lastMessage || "No messages yet",
    })) || [];

  useEffect(() => {
    if (selectedChat) {
      socket.emit("join", selectedChat);
    }

    if (selectedChat) {
      socket.on(`receive-message:${selectedChat}`, (newMsg: any) => {
        setMessages((prev) => ({
          ...prev,
          [selectedChat]: [
            ...(prev[selectedChat] || []),
            {
              id: newMsg._id || Date.now(),
              sender:
                newMsg.senderId === currentUserId ? "You" : newMsg.senderId,
              text: newMsg.message,
              time: new Date(newMsg.createdAt || Date.now()).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              ),
              status: newMsg.senderId === currentUserId ? "Sent" : "Received",
            },
          ],
        }));
      });
    }

    return () => {
      if (selectedChat) {
        socket.off(`receive-message:${selectedChat}`);
      }
    };
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      const messageData = {
        inboxId: selectedChat,
        senderId: currentUserId,
        message: newMessage,
      };

      socket.emit("send-message", messageData);

      const newMsg = {
        id: Date.now(),
        sender: "You",
        avatar: "/images/you.png",
        text: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "Sent",
      };

      setMessages((prev) => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), newMsg],
      }));

      setNewMessage("");
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:w-1/4 md:block`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold">Messenger</h1>
          <button onClick={toggleSidebar} className="md:hidden">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        {chats?.map((chat: any) => (
          <div
            key={chat?.id}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${
              selectedChat === chat?.id ? "bg-gray-200" : ""
            }`}
            onClick={() => {
              setSelectedChat(chat.id);
              setIsSidebarOpen(false);
            }}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src={process.env.NEXT_PUBLIC_IMAGE_URL + chat?.avatar}
                alt={chat?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3">
              <p className="font-semibold">{chat?.name}</p>
              <p className="text-sm text-gray-500 truncate">
                {chat?.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="bg-white p-4 border-b flex items-center justify-between md:hidden">
          <button onClick={toggleSidebar}>
            <MenuIcon className="w-6 h-6" />
          </button>
          {selectedChat && (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={
                    process.env.NEXT_PUBLIC_IMAGE_URL +
                    chats.find((c: any) => c.id === selectedChat)?.avatar
                  }
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="ml-3 font-semibold">
                {chats.find((c: any) => c.id === selectedChat)?.name}
              </h2>
            </div>
          )}
        </div>

        {/* Desktop Header */}
        {selectedChat && (
          <div className="hidden md:block bg-white p-4 border-b flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={
                  process.env.NEXT_PUBLIC_IMAGE_URL +
                  chats.find((c: any) => c.id === selectedChat)?.avatar
                }
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="ml-3 font-semibold">
              {chats.find((c: any) => c.id === selectedChat)?.name}
            </h2>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {selectedChat ? (
            <div className="space-y-4">
              {(messages[selectedChat] || []).map((msg: any) => (
                <div
                  key={msg.id}
                  className={`chat ${
                    msg.sender !== "You" ? "chat-end" : "chat-start"
                  } flex items-end`}
                >
                  <div className="max-w-[70%]">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{msg.sender}</span>
                      <time className="text-xs opacity-50">{msg.time}</time>
                    </div>
                    <div
                      className={`p-3 rounded-lg break-words whitespace-normal max-w-full ${
                        msg.sender === "You"
                          ? "bg-gray-200 text-gray-800"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="text-xs opacity-50 mt-1">{msg.status}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
          )}
        </div>

        {/* Input */}
        {selectedChat && (
          <div className="bg-white p-4 border-t flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="input input-bordered flex-1 mr-2 text-base rounded-full"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <button
              className="btn btn-primary px-4 py-2 rounded-full"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
