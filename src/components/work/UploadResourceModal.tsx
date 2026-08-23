import React from 'react';
import { UploadResourceView } from './UploadResourceView';
import { X } from 'lucide-react';

interface UploadResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadResourceModal: React.FC<UploadResourceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-50 rounded-3xl max-w-4xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 my-auto">
        <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            શિક્ષક સંસાધન અપલોડ & કમ્યુનિટી શેરિંગ
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <UploadResourceView onBack={onClose} />
        </div>
      </div>
    </div>
  );
};
