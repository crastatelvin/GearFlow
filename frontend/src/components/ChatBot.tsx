"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am the GearFlow AI Assistant. How can I help you with your bike service today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate RAG call to n8n
    setTimeout(async () => {
      let botResponse = "I'm analyzing your history... GearFlow AI is here.";
      
      try {
        // In production: const response = await fetch('N8N_WEBHOOK_URL', { method: 'POST', body: JSON.stringify({ query: input, user_id: 'USER_123' }) });
        const query = input.toLowerCase();
        
        if (query.includes('last service') || query.includes('my history')) {
          botResponse = "Based on your history, your last service was a Full Engine Tune-up on May 01, 2026 for your RE Classic 350. You are all set for another 2,500km!";
        } else if (query.includes('human') || query.includes('agent')) {
          botResponse = "I'm escalating your request to a live coordinator. Please stay on the line.";
        } else {
          botResponse = "GearFlow AI: I can help you with that. Our diagnosis fee is ₹200. Should I book a slot for your Classic 350?";
        }
      } catch (e) {
        botResponse = "I'm having trouble connecting to my knowledge base, but I can still help with basic booking!";
      }

      const assistantMessage = { role: 'assistant', content: botResponse };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-brand-neon rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(57,255,20,0.4)] hover:scale-110 transition-transform z-50"
      >
        <MessageSquare className="text-black w-8 h-8" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-28 right-8 w-[400px] h-[550px] glass border border-brand-neon/30 rounded-3xl overflow-hidden flex flex-col z-50"
          >
            {/* Header */}
            <div className="p-6 bg-brand-neon flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <Bot className="text-brand-neon w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-black font-black text-sm tracking-tight">GEARFLOW AI</h3>
                  <p className="text-black/60 text-[10px] font-bold">ONLINE | RAG POWERED</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-black/60 hover:text-black">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-brand-neon text-black font-medium rounded-tr-none' 
                      : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-neon" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/10 bg-black/50">
              <div className="flex gap-2">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-neon outline-none transition-colors"
                />
                <button 
                  onClick={handleSend}
                  className="w-12 h-12 bg-brand-neon text-black rounded-xl flex items-center justify-center hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
