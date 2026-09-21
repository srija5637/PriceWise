'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Scale,
  DollarSign,
  Maximize2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { executeAiShoppingAssistant, AiShoppingResponse } from '@/lib/ai';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  data?: AiShoppingResponse;
  timestamp: string;
}

export function ShoppingCopilot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Hi User! I am your PriceWise AI Copilot. Ask me to compare products, analyze deals, find cheaper alternatives, or plan a shopping budget.',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Dynamic context suggestions based on active route
  const getContextSuggestions = () => {
    if (pathname.includes('/product/')) {
      return [
        'Is this a good deal?',
        'Find cheaper alternatives',
        'Compare with top rivals',
        'Why did the price change?',
      ];
    }
    if (pathname.includes('/compare')) {
      return ['Which one has better value?', 'Highlight key tradeoffs', 'Find budget options'];
    }
    if (pathname.includes('/deals')) {
      return ['Show biggest price drops today', 'Best phone under ₹30,000', 'Deals on noise cancelling headphones'];
    }
    return [
      'Find a laptop for programming under ₹70,000',
      'Best phone with great camera under ₹30,000',
      'Show products that dropped today',
      'Plan a budget for ₹50,000',
    ];
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // Call grounded PriceWise AI engine
    setTimeout(() => {
      const response = executeAiShoppingAssistant(query.trim());
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: response.explanation,
        data: response,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 px-4 py-3 text-white shadow-2xl shadow-blue-600/40 transition hover:scale-105 hover:from-blue-700 hover:to-indigo-700 cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300" />
            </span>
          </div>
          <span className="text-xs font-bold tracking-wide">Ask PriceWise</span>
        </button>
      )}

      {/* Expanded Copilot Card */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[560px] w-96 max-w-[calc(100vw-2rem)] flex-col rounded-3xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-black flex items-center gap-1.5">
                  <span>PriceWise AI Copilot</span>
                  <span className="rounded-full bg-cyan-400 px-1.5 py-0.2 text-[9px] font-black uppercase text-slate-950">
                    Live
                  </span>
                </h4>
                <p className="text-[10px] text-blue-100">Grounded in verified multi-store prices</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link href="/ai-assistant" onClick={() => setIsOpen(false)} title="Open Full Assistant">
                <button
                  type="button"
                  className="rounded-lg p-1 text-white/80 hover:bg-white/20 hover:text-white cursor-pointer"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-white/80 hover:bg-white/20 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Context Suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 no-scrollbar">
            {getContextSuggestions().map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSendMessage(suggestion)}
                className="whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-2xs hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Recommendation preview card if returned */}
                  {msg.data?.topRecommendation && (
                    <div className="mt-2.5 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 shadow-xs">
                      <span className="text-[9px] font-black uppercase text-blue-600 dark:text-blue-400">
                        Top Grounded Recommendation
                      </span>
                      <h5 className="font-bold text-xs truncate">
                        {msg.data.topRecommendation.product.name}
                      </h5>
                      <div className="mt-1 flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-blue-600 dark:text-blue-400">
                          ₹{msg.data.topRecommendation.lowestPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-slate-400 font-medium">
                          via {msg.data.topRecommendation.bestStore}
                        </span>
                      </div>
                      <Link
                        href={`/product/${msg.data.topRecommendation.product.id}`}
                        onClick={() => setIsOpen(false)}
                        className="mt-2 flex h-7 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-[10px] font-bold"
                      >
                        View Product <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </div>
                  )}
                </div>
                <span className="mt-0.5 text-[9px] text-slate-400 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 p-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:0.2s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:0.4s]" />
                <span className="text-[10px]">Analyzing multi-store prices...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="border-t border-slate-100 dark:border-slate-800 p-3 bg-white dark:bg-slate-900"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Ask about deals, products, budgets..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-10 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-40 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
