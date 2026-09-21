'use client';

import React, { useState } from 'react';
import { HelpCircle, Mail, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FAQS = [
  {
    q: 'How does PriceWise collect its price data?',
    a: 'PriceWise uses a modular multi-provider architecture including verified retailer APIs, affiliate product feeds, and permitted web extraction via Firecrawl. We adhere strictly to website terms, access limits, and data integrity policies.',
  },
  {
    q: 'How is the Value Score calculated?',
    a: 'Our transparent scoring formula combines Price Competitiveness (40%), Product Rating (25%), Review Volume Confidence (15%), Seller Verification (10%), and Fulfillment Speed (10%). We measure relative buying efficiency rather than making subjective claims of product quality.',
  },
  {
    q: 'How often are prices checked and updated?',
    a: 'Active products and price alerts are audited automatically in scheduled cycles. Each offer in our comparison matrix displays an exact timestamp indicating when that specific retailer was last checked.',
  },
  {
    q: 'Does PriceWise fabricate prices when a store is unavailable?',
    a: 'Never. Per our strict core integrity rules, PriceWise never invents prices, ratings, review counts, or seller information. When data cannot be retrieved, we clearly display "Data unavailable" or "Temporarily unavailable".',
  },
];

export function HelpSupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedback('');
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <HelpCircle className="h-4 w-4" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Help & Support
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Everything you need to know about PriceWise shopping intelligence and data policies
        </p>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQS.map((faq, i) => (
            <Card key={i} className="rounded-2xl border-slate-200/80 p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2">
                {faq.q}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.a}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Feedback / Contact Card */}
      <Card className="rounded-2xl border-slate-200/80 p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <span>Contact PriceWise Support & Feedback</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {submitted ? (
            <div className="py-6 text-center text-emerald-600 font-bold text-xs">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
              <span>Thank you for your feedback! Our team will review it shortly.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <textarea
                required
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Let us know what retailers or features you'd like added..."
                className="w-full rounded-xl border border-slate-200 p-3 dark:border-slate-800 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button type="submit" variant="primary" size="sm" className="rounded-xl">
                Submit Feedback
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default HelpSupportPage;
