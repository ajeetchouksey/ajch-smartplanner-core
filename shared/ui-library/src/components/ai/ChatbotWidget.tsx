import React, { useState } from "react";
import './ChatbotWidget.css';

export const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: "ai", text: "I'm an AI assistant!" }]);
    }, 700);
  };

  return (
    <div className={`ai-chatbot-widget${open ? " open" : ""}`}>
      <button className="ai-chatbot-toggle" onClick={() => setOpen(!open)}>
        <span className="ai-neural-bubble" />
        <span className="ai-chatbot-icon">🤖</span>
      </button>
      {open && (
        <div className="ai-chatbot-window glassmorphism">
          <div className="ai-chatbot-header">AI Chatbot</div>
          <div className="ai-chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-chatbot-msg ${msg.from}`}>{msg.text}</div>
            ))}
          </div>
          <div className="ai-chatbot-input-row">
            <input
              className="ai-chatbot-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button className="ai-chatbot-send" onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
