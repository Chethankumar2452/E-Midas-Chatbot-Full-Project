"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageCircle, Calendar, Stethoscope } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello 👋\nI am your Hospital AI Assistant.\nHow can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message,
          },
        ]);

        if (data.lead) {
          toast.success("Lead information saved!");
        }
      } else {
        toast.error("Failed to get response");
      }
    } catch {
      toast.error("Error communicating with assistant");
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: Calendar,
      label: "Book Appointment",
      value: "book",
    },
    {
      icon: Stethoscope,
      label: "Contact Doctor",
      value: "doctor",
    },
    {
      icon: MessageCircle,
      label: "Services",
      value: "services",
    },
    {
      icon: Calendar,
      label: "Working Hours",
      value: "hours",
    },
  ];

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-primary rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-h-[650px] glass-card flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-primary text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  Hospital Assistant
                </h3>
                <p className="text-xs text-green-100">
                  AI Powered
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-xl ${
                      msg.role === "user"
  ? "bg-green-600 text-white rounded-br-none shadow-lg"
  : "bg-white text-gray-900 border border-green-200 rounded-bl-none shadow-md"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="bg-white border border-green-200 rounded-xl p-3 w-fit">
                  Thinking...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && !loading && (
              <div className="p-4 border-t grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.value}
                      onClick={() => {
                        setInput(action.label);
                      }}
                      className="p-2 text-xs bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 rounded-lg flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="p-4 border-t flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !loading
                  ) {
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-white border border-green-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />

              <button
  onClick={handleSendMessage}
  disabled={loading || !input.trim()}
  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
>
  <Send className="w-5 h-5 text-white" />
</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}