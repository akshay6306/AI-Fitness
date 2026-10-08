'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Flame,
  Zap,
  RefreshCw,
  Trophy
} from 'lucide-react';
import { getStoredProfile } from '@/utils/storage';
import { ChatMessage, UserProfile } from '@/types';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: `### ⚡ WELCOME TO COACH AI!
I am your personal AI sports scientist, master nutritionist, and mindset coach. 

Remember: **NO EXCUSES. JUST EXECUTION.** How can I push your training, diet, or mental toughness today?`,
    timestamp: 'Just now'
  }
];

const QUICK_PROMPTS = [
  "🔥 Give me an intense 30-second pre-workout mindset talk!",
  "💪 How do I build unstoppable discipline when motivation dies?",
  "🥗 How can I substitute chicken breast while keeping 30g protein?",
  "🦵 What's a safe squat alternative for knee pain or tendonitis?",
  "📈 How do I break a 2-week weight loss plateau?",
];

export default function CoachPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prof = getStoredProfile();
    setProfile(prof);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || !profile || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const historyFormatted = messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          profile,
          chatHistory: historyFormatted
        })
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (e) {
      console.error('Coach API call failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-flame-500 to-amber-500 p-0.5 shadow-lg shadow-flame-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-flame-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white flex items-center gap-2">
              Coach AI Assistant
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-flame-500/20 text-flame-400 border border-flame-500/30 uppercase font-black">
                BEAST MINDSET ACTIVE
              </span>
            </h1>
            <p className="text-xs text-slate-400">RAG Sports Science, Biomechanics & Motivation Engine</p>
          </div>
        </div>

        <button
          onClick={() => setMessages(INITIAL_MESSAGES)}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-bold flex items-center gap-1.5"
          title="Clear chat history"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-3xl glass-card border border-slate-800/80">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[90%] md:max-w-[80%] ${isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isAssistant 
                  ? 'bg-flame-500/20 text-flame-400 border border-flame-500/30' 
                  : 'bg-nutrition-500/20 text-nutrition-400 border border-nutrition-500/30'
              }`}>
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                isAssistant
                  ? 'bg-slate-900/90 text-slate-200 border border-slate-800/90 shadow-md'
                  : 'bg-gradient-to-r from-flame-500 to-amber-500 text-slate-950 font-bold shadow-md shadow-flame-500/10'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className={`text-[10px] mt-2 flex justify-end ${isAssistant ? 'text-slate-500' : 'text-slate-950/70'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 mr-auto max-w-[80%]">
            <div className="w-8 h-8 rounded-xl bg-flame-500/20 text-flame-400 border border-flame-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Flame className="w-4 h-4 text-flame-400 animate-pulse" />
              <span>Coach AI is formulating your response...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-bold whitespace-nowrap transition-all hover:border-flame-500/50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Coach AI about workouts, pre-workout motivation, meal subs..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-flame-500 placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-flame-500 to-amber-500 hover:opacity-95 text-slate-950 text-xs font-black flex items-center justify-center shadow-lg shadow-flame-500/20 transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
