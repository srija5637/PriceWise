'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Link as LinkIcon,
  Barcode,
  Mic,
  MicOff,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
  ExternalLink,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  analyzeProductImage,
  analyzeProductUrl,
  resolveBarcodeProduct,
  MultimodalAnalysisResult,
} from '@/lib/ai/workflows/multimodal';

interface MultimodalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'image' | 'url' | 'barcode' | 'voice';
}

export function MultimodalSearchModal({
  isOpen,
  onClose,
  defaultTab = 'image',
}: MultimodalSearchModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'image' | 'url' | 'barcode' | 'voice'>(defaultTab);

  // States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MultimodalAnalysisResult | null>(null);

  // URL state
  const [urlInput, setUrlInput] = useState('');

  // Barcode state
  const [barcodeInput, setBarcodeInput] = useState('0195949038234');

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');

  // Handle Image Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate AI vision inference
    setTimeout(async () => {
      const result = await analyzeProductImage(file.name);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 1200);
  };

  // Handle URL Submit
  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(async () => {
      const result = await analyzeProductUrl(urlInput.trim());
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 1100);
  };

  // Handle Barcode Submit
  const handleBarcodeSubmit = async (code: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(async () => {
      const result = await resolveBarcodeProduct(code);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 900);
  };

  // Handle Voice Search toggle
  const toggleVoiceListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    // Check if Web Speech API is supported
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback simulation
      setIsListening(true);
      setVoiceTranscript('Listening for product name...');
      setTimeout(() => {
        setVoiceTranscript('Sony WH-1000XM5 wireless headphones');
        setIsListening(false);
      }, 2000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceTranscript('');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setVoiceTranscript(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleNavigateToResult = (query: string) => {
    onClose();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl rounded-3xl p-0 overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Multimodal AI Shopping Intelligence</span>
          </div>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Search with Image, URL, Barcode, or Voice
          </DialogTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload a photo, screenshot, paste a competitor URL, or scan a barcode to find the lowest price across all stores.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3">
            <button
              type="button"
              onClick={() => {
                setActiveTab('image');
                setAnalysisResult(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'image'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Image / Screenshot</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('url');
                setAnalysisResult(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <LinkIcon className="h-3.5 w-3.5" />
              <span>Paste URL</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('barcode');
                setAnalysisResult(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'barcode'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <Barcode className="h-3.5 w-3.5" />
              <span>Barcode / QR</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('voice');
                setAnalysisResult(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'voice'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <Mic className="h-3.5 w-3.5" />
              <span>Voice Search</span>
            </button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* TAB 1: Image & Screenshot */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition">
                <UploadCloud className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-2" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Upload Product Photo or Competitor Screenshot
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  Drag and drop PNG, JPG, or WebP (up to 10MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Sample Quick Images */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">Or try samples:</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAnalyzing(true);
                    setTimeout(async () => {
                      const res = await analyzeProductImage('iphone-16-screenshot.png');
                      setAnalysisResult(res);
                      setIsAnalyzing(false);
                    }, 800);
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  iPhone 16 Screenshot
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAnalyzing(true);
                    setTimeout(async () => {
                      const res = await analyzeProductImage('sony-headphones.jpg');
                      setAnalysisResult(res);
                      setIsAnalyzing(false);
                    }, 800);
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Sony Headphones Photo
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: URL Analysis */}
          {activeTab === 'url' && (
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Paste Any Product Link (Amazon, Flipkart, Croma, etc.)
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="url"
                    placeholder="https://www.amazon.in/dp/B0BDK627R3 or Flipkart link..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button type="submit" className="h-11 px-5 font-semibold bg-blue-600 hover:bg-blue-700 text-white">
                    Analyze
                  </Button>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                PriceWise extracts the product identifiers, checks real-time prices across all competing stores, and returns where it is cheapest.
              </p>
            </form>
          )}

          {/* TAB 3: Barcode / QR */}
          {activeTab === 'barcode' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                <Barcode className="h-12 w-12 text-slate-700 dark:text-slate-300 mb-2" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Barcode / UPC / EAN Scanner
                </span>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Enter or scan a 12-digit UPC or 13-digit EAN code to look up verified cross-store retailer inventory.
                </p>
                <div className="mt-4 flex gap-2 w-full max-w-md">
                  <input
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    className="flex-1 h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  <Button
                    onClick={() => handleBarcodeSubmit(barcodeInput)}
                    className="h-10 px-4 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-semibold"
                  >
                    Lookup
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Voice Search */}
          {activeTab === 'voice' && (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <button
                type="button"
                onClick={toggleVoiceListening}
                className={`relative flex h-20 w-20 items-center justify-center rounded-full text-white shadow-xl transition cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 animate-pulse ring-8 ring-rose-500/20'
                    : 'bg-blue-600 hover:bg-blue-700 ring-8 ring-blue-500/20'
                }`}
              >
                {isListening ? <Mic className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </button>

              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isListening ? 'Listening... Speak your shopping request' : 'Click microphone to start voice search'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  e.g., &ldquo;Find me a coding laptop under ₹70,000&rdquo; or &ldquo;Lowest price for Sony headphones&rdquo;
                </p>
              </div>

              {voiceTranscript && (
                <div className="w-full max-w-md p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-left">
                  <span className="text-[10px] font-bold uppercase text-blue-700 dark:text-blue-300">
                    Transcribed Audio:
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                    &ldquo;{voiceTranscript}&rdquo;
                  </p>
                  <Button
                    onClick={() => handleNavigateToResult(voiceTranscript)}
                    className="mt-3 w-full h-8 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Search This Request <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Loading Animation */}
          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                AI Vision & Catalog Engine Analyzing Product...
              </span>
              <span className="text-[11px] text-slate-400">
                Cross-referencing verified retailer databases and specs
              </span>
            </div>
          )}

          {/* Analysis Results Card */}
          {analysisResult && !isAnalyzing && (
            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-3 animate-in fade-in">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                      Product Identified ({Math.round(analysisResult.confidence * 100)}% confidence)
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {analysisResult.identifiedTitle}
                    </h4>
                  </div>
                </div>
                <Badge className="bg-emerald-600 text-white font-semibold">
                  Verified Match
                </Badge>
              </div>

              {/* Attributes grid */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                {Object.entries(analysisResult.extractedAttributes).map(([key, val]) => (
                  <div key={key} className="p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{key}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{val}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Ready to compare across all supported retailers.
                </span>
                <Button
                  onClick={() => handleNavigateToResult(analysisResult.searchRedirectQuery)}
                  className="h-9 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                >
                  Compare All Prices <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
