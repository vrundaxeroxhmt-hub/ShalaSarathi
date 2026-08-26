import React, { useState } from 'react';
import { Mic, MicOff, Copy, Check, X, Sparkles } from 'lucide-react';
import { useGujaratiVoice } from '@/hooks/useGujaratiVoice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceInputModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const { isListening, transcript, isSupported, error, startListening, stopListening } = useGujaratiVoice((result) => {
    setText(prev => (prev ? prev + ' ' + result : result));
  });

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200 font-sans relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">ગુજરાતી સ્માર્ટ વોઇસ ટાઇપિંગ</h3>
              <p className="text-[10px] text-slate-400">Gujarati Speech-to-Text Recognition</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 font-bold rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mic Animation Pulse Box */}
        <div className="flex flex-col items-center justify-center space-y-3 py-4 bg-slate-50 rounded-2xl border border-slate-100">
          {isListening ? (
            <button
              onClick={stopListening}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-900/30 animate-pulse ring-8 ring-rose-100"
            >
              <MicOff className="w-9 h-9" />
            </button>
          ) : (
            <button
              onClick={startListening}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-gujarat-saffron text-white flex items-center justify-center shadow-xl shadow-brand-900/30 ring-8 ring-brand-100 hover:scale-105 transition-transform"
            >
              <Mic className="w-9 h-9" />
            </button>
          )}

          <div className="text-center">
            <div className="text-xs font-bold text-slate-800">
              {isListening ? '🎙️ સાંભળી રહ્યા છીએ... ગુજરાતીમાં બોલો' : 'માઇક બટન પર ક્લિક કરી બોલવાનું શરૂ કરો'}
            </div>
            {error && <div className="text-[11px] text-rose-600 mt-1 font-medium">{error}</div>}
          </div>
        </div>

        {/* Text Result Box */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">ઓળખાયેલ ગુજરાતી લખાણ (Live Text)</label>
          <textarea
            rows={4}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="તમે બોલશો તે શબ્દો અહીં લખાશે..."
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setText('')}
            className="text-xs text-slate-500 hover:text-slate-800 font-bold"
          >
            સાફ કરો (Clear)
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'કોપી થયું!' : 'લખાણ કોપી કરો'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
