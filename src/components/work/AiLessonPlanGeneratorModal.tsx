import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { AiLessonPlanGeneratorView } from './AiLessonPlanGeneratorView';

interface AiLessonPlanGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStandard?: string;
  initialSubject?: string;
}

export const AiLessonPlanGeneratorModal: React.FC<AiLessonPlanGeneratorModalProps> = ({
  isOpen,
  onClose,
  initialStandard,
  initialSubject,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-50 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/70 border border-indigo-400/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                AI પાઠ આયોજન જનરેટર (AI Lesson Plan Generator)
              </h2>
              <p className="text-[11px] text-indigo-200">
                Gemini 3.7 Flash મોડેલ દ્વારા GCERT 5E માળખું & અધ્યયન નિષ્પત્તિઓ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="બંધ કરો (Close)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <AiLessonPlanGeneratorView
            initialStandard={initialStandard}
            initialSubject={initialSubject}
            onBackToHub={onClose}
          />
        </div>
      </div>
    </div>
  );
};
