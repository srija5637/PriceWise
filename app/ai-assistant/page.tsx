'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  Send,
  Sparkles,
  ExternalLink,
  Star,
  CheckCircle2,
  HelpCircle,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { executeAiShoppingAssistant, AiShoppingResponse } from '@/lib/ai';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  data?: AiShoppingResponse;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'Find the best phone under ₹70,000',
  'Find a laptop for coding under ₹1,00,000',
  'Compare iPhone 16 and OnePlus 12',
  'Show products with recent price drops',
  'Find a highly rated wireless headphone under ₹30,000',
];

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your PriceWise AI Shopping Assistant. I analyze real-time price trends, verified customer reviews, seller reputations, and multi-store offers to help you buy smarter. How can I help you today?',
      timestamp: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Call AI intelligence engine
    setTimeout(() => {
      const responseData = executeAiShoppingAssistant(query);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: responseData.explanation,
        data: responseData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>AI Shopping Assistant</span>
              <Badge variant="secondary" className="text-[10px]">Catalog Grounded</Badge>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Converts natural language inquiries into structured data queries without hallucinated prices
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Quick Prompts:</span>
        </span>
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="rounded-full border border-slate-200/90 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-2xs transition hover:border-blue-400 hover:bg-blue-50/80 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <Card className="rounded-3xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col h-[560px]">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-100/80 text-slate-800 dark:bg-slate-800/80 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700/50'
                }`}
              >
                <p>{msg.text}</p>

                {/* Structured Criteria Display */}
                {msg.data?.structuredFilters && (
                  <div className="rounded-xl bg-white/80 p-2.5 text-[11px] border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">
                      Parsed Query Criteria:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.data.structuredFilters.category && (
                        <Badge variant="outline" className="text-[10px]">
                          Category: {msg.data.structuredFilters.category}
                        </Badge>
                      )}
                      {msg.data.structuredFilters.maxPrice && (
                        <Badge variant="outline" className="text-[10px]">
                          Max: ₹{msg.data.structuredFilters.maxPrice.toLocaleString('en-IN')}
                        </Badge>
                      )}
                      {msg.data.structuredFilters.priorities.map((p) => (
                        <Badge key={p} variant="secondary" className="text-[10px]">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Recommendation Highlight Card */}
                {msg.data?.topRecommendation && (
                  <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-3.5 dark:border-emerald-900/50 dark:bg-emerald-950/30 text-slate-900 dark:text-slate-100 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-emerald-200 bg-white p-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={msg.data.topRecommendation.product.imageUrl}
                            alt={msg.data.topRecommendation.product.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                            Top Recommendation
                          </span>
                          <span className="font-bold text-sm block">
                            {msg.data.topRecommendation.product.name}
                          </span>
                          <span className="text-emerald-700 dark:text-emerald-300 font-extrabold text-sm">
                            {formatCurrency(msg.data.topRecommendation.lowestPrice)} on {msg.data.topRecommendation.bestStore}
                          </span>
                        </div>
                      </div>

                      <span className="flex items-center justify-center h-8 w-10 rounded-lg bg-emerald-600 text-white font-extrabold text-xs">
                        {msg.data.topRecommendation.valueScore}
                      </span>
                    </div>

                    <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                      {msg.data.topRecommendation.reasons.map((r, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 flex gap-2">
                      <Link href={`/product/${msg.data.topRecommendation.product.id}`}>
                        <Button size="sm" variant="default" className="rounded-xl text-xs h-7">
                          <span>Inspect Prices</span>
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                <span className="block text-[10px] opacity-60 text-right">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 items-center text-xs text-slate-400">
              <Bot className="h-4 w-4 animate-bounce text-blue-600" />
              <span>Analyzing live multi-store product catalog...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-100 p-4 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. 'Find best laptop for coding under ₹1,00,000')..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50/80 px-4 text-xs dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!inputQuery.trim() || isTyping}
              className="h-11 px-5 rounded-xl text-xs font-semibold gap-1.5 shadow-sm"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
