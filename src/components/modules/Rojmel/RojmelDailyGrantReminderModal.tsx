import React, { useState } from 'react';
import { X, Sparkles, ShoppingCart, ChevronRight, ChevronLeft, Bell } from 'lucide-react';
import { GrantHeadStatus } from '@/types/rojmel';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reminders: GrantHeadStatus[];
  onOpenPurchase: () => void;
}

export const RojmelDailyGrantReminderModal: React.FC<Props> = ({
  isOpen,
  onClose,
  reminders,
  onOpenPurchase
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || reminders.length === 0) return null;

  const currentItem = reminders[currentIndex] || reminders[0];
  const percentUsed = Math.min(100, Math.round((currentItem.usedAmount / currentItem.limit) * 100));

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reminders.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reminders.length) % reminders.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 relative">
        
        {/* Top Indicator Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">દૈનિક ગ્રાન્ટ રીમાઇન્ડર</span>
              <h3 className="font-bold text-slate-900 text-sm">શાળા ગ્રાન્ટ વપરાશ સૂચના</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 font-bold rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reminder Highlight Card */}
        <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="bg-amber-400/20 text-amber-300 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-400/30">
              શૈક્ષણિક વર્ષ {currentItem.financialYear}
            </span>
            <span className="text-[11px] text-slate-300 font-semibold">
              {currentIndex + 1} / {reminders.length} હેડ
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-300 font-medium">બાકી ગ્રાન્ટ એલર્ટ</div>
            <h2 className="text-xl font-black text-amber-400 leading-snug">
              હજુ {currentItem.headNameGuj} માં ₹{currentItem.remainingAmount.toLocaleString('en-IN')} ગ્રાન્ટ બાકી છે.
            </h2>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="flex justify-between text-[11px] font-semibold text-slate-300">
              <span>વપરાયેલ: ₹{currentItem.usedAmount.toLocaleString('en-IN')} ({percentUsed}%)</span>
              <span>મંજૂર લિમિટ: ₹{currentItem.limit.toLocaleString('en-IN')}</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div 
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${percentUsed}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Controls if multiple heads */}
        {reminders.length > 1 && (
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <button
              onClick={handlePrev}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>અગાઉનો હેડ</span>
            </button>

            <button
              onClick={handleNext}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1"
            >
              <span>પછીનો હેડ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
          >
            પછી (Later)
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPurchase();
            }}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-1.5"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>ખરીદી કરો (Purchase Now)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
