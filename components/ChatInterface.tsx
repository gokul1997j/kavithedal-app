import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  initialMessage?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialMessage }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: initialMessage || "Hello! I'm Kavi, your Kavithedal assistant. How can I help you discover your next great read today?",
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    
    // Add User Message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Create placeholder for AI response
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessagePlaceholder: Message = {
        id: aiMessageId,
        role: 'model',
        text: '',
        timestamp: new Date(),
        isStreaming: true
    };
    setMessages(prev => [...prev, aiMessagePlaceholder]);

    try {
      const stream = sendMessageToGemini(userText);
      let fullText = "";

      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => 
            prev.map(msg => 
                msg.id === aiMessageId 
                ? { ...msg, text: fullText } 
                : msg
            )
        );
      }
      
      setMessages(prev => 
        prev.map(msg => 
            msg.id === aiMessageId 
            ? { ...msg, isStreaming: false } 
            : msg
        )
      );

    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="bg-stone-900 p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-sm">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-white font-serif font-bold">Kavi Assistant</h2>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-stone-300 text-xs">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-stone-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-3`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 shadow-sm ${
                msg.role === 'user' ? 'bg-stone-700 text-white' : 'bg-orange-100 text-orange-600'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Bubble */}
              <div 
                className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-stone-800 text-white rounded-tr-none' 
                    : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none'
                }`}
              >
                 {msg.role === 'model' ? (
                     <div className="prose prose-sm prose-stone max-w-none">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                        {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 bg-orange-400 animate-pulse align-middle"></span>}
                     </div>
                 ) : (
                     <p className="whitespace-pre-wrap">{msg.text}</p>
                 )}
                 <span className={`text-[10px] mt-1 block opacity-60 ${msg.role === 'user' ? 'text-stone-300' : 'text-stone-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-stone-200">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about books, shipping, or recommendations..."
            className="w-full bg-stone-100 text-stone-800 placeholder-stone-400 border border-transparent focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100 rounded-full py-3.5 pl-5 pr-12 transition-all duration-200 outline-none shadow-inner"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 p-2 rounded-full transition-all duration-200 ${
              input.trim() && !isLoading
                ? 'bg-stone-900 text-white hover:bg-orange-600 shadow-md transform hover:scale-105'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-xs text-stone-400 mt-2">
            AI can make mistakes. Please verify important policy details.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;