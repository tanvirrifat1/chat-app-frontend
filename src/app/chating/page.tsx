"use client";

import React, { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { useGetMyInboxQuery } from "../redux/feature/msgAPI";

const Messenger: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const { data, isLoading } = useGetMyInboxQuery("");

  // Initialize messages state as an empty object
  const [messages, setMessages] = useState<Record<string, any[]>>({});

  // Map API data to chats format
  const chats =
    data?.data?.data?.map((inbox: any) => ({
      id: inbox.inboxId,
      name: inbox.name,
      avatar: inbox.image,
      lastMessage: inbox.lastMessage || "No messages yet",
    })) || [];

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      const newMsg = {
        id: Date.now(),
        sender: "You",
        avatar: "/images/you.png", // Replace with actual user avatar
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
        {chats.map((chat: any) => (
          <div
            key={chat.id}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${
              selectedChat === chat.id ? "bg-gray-200" : ""
            }`}
            onClick={() => {
              setSelectedChat(chat.id);
              setIsSidebarOpen(false);
            }}
          >
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img
                  src={process.env.NEXT_PUBLIC_IMAGE_URL + chat.avatar}
                  alt={chat.name}
                />
              </div>
            </div>
            <div className="ml-3">
              <p className="font-semibold">{chat.name}</p>
              <p className="text-sm text-gray-500 truncate">
                {chat.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header with Hamburger Menu */}
        <div className="bg-white p-4 border-b flex items-center justify-between md:hidden">
          <button onClick={toggleSidebar}>
            <MenuIcon className="w-6 h-6" />
          </button>
          {selectedChat && (
            <div className="flex items-center">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={chats.find((c: any) => c.id === selectedChat)?.avatar}
                    alt="avatar"
                  />
                </div>
              </div>
              <h2 className="ml-3 font-semibold">
                {chats.find((c: any) => c.id === selectedChat)?.name}
              </h2>
            </div>
          )}
        </div>

        {/* Desktop Chat Header */}
        {selectedChat && (
          <div className="hidden md:block bg-white p-4 border-b flex items-center">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img
                  src={chats.find((c: any) => c.id === selectedChat)?.avatar}
                  alt="avatar"
                />
              </div>
            </div>
            <h2 className="ml-3 font-semibold">
              {chats.find((c: any) => c.id === selectedChat)?.name}
            </h2>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {selectedChat ? (
            (messages[selectedChat] || []).map((msg: any) => (
              <div
                key={msg.id}
                className={`chat ${
                  msg.sender === "You" ? "chat-end" : "chat-start"
                }`}
              >
                <div className="chat-header">
                  {msg.sender}
                  <time className="text-xs opacity-50 ml-2">{msg.time}</time>
                </div>
                <div className="chat-bubble">{msg.text}</div>
                <div className="chat-footer opacity-50">{msg.status}</div>
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
          )}
        </div>

        {/* Message Input */}
        {selectedChat && (
          <div className="bg-white p-4 border-t flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="input input-bordered flex-1 mr-2 text-base"
            />
            <button
              className="btn btn-primary px-4 py-2"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messenger;
