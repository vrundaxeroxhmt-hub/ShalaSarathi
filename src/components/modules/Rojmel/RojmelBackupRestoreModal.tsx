import React, { useState, useRef } from 'react';
import { X, Download, Upload, FileSpreadsheet, ShieldAlert, Check, RefreshCw } from 'lucide-react';
import { RojmelEntry, DeadStockItem } from '@/types/rojmel';
import { 
  exportRojmelBackup, 
  exportRojmelCSV, 
  validateAndParseRojmelBackup, 
  DEFAULT_OPENING_BALANCE 
} from '@/lib/services/rojmelService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entries: RojmelEntry[];
  deadStockItems: DeadStockItem[];
  onRestoreSuccess: (newEntries: RojmelEntry[], newDeadStock: DeadStockItem[]) => Promise<void>;
}

export const RojmelBackupRestoreModal: React.FC<Props> = ({
  isOpen,
  onClose,
  entries,
  deadStockItems,
  onRestoreSuccess
}) => {
  const [restoreConfirmText, setRestoreConfirmText] = useState('');
  const [selectedBackupData, setSelectedBackupData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleBackupJSON = () => {
    exportRojmelBackup(entries, deadStockItems, DEFAULT_OPENING_BALANCE);
  };

  const handleExportCSV = () => {
    exportRojmelCSV(entries, DEFAULT_OPENING_BALANCE);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const res = validateAndParseRojmelBackup(event.target.result as string);
          if (res.isValid && res.data) {
            setSelectedBackupData(res.data);
          } else {
            setErrorMsg(res.error || 'અમાન્ય બેકઅપ ફાઇલ.');
            setSelectedBackupData(null);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmRestore = async () => {
    if (!selectedBackupData) return;

    try {
      await onRestoreSuccess(selectedBackupData.entries, selectedBackupData.deadStockItems);
      setSuccessMsg('રોજમેળ ડેટા સફળતાપૂર્વક રિસ્ટોર થયો! બેલેન્સ ગણતરી અપડેટ કરવામાં આવી છે.');
      setSelectedBackupData(null);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setErrorMsg('રિસ્ટોરમાં ભૂલ આવી. ફરી પ્રયાસ કરો.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">રોજમેળ બેકઅપ, નિકાસ અને રિસ્ટોર (Backup & Restore)</h3>
            <p className="text-[10px] text-slate-400">તમારા રોજમેળ ડેટાનું સુરક્ષિત સેવિંગ અને એક્સપોર્ટ</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 font-bold rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Card 1: Backup JSON */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Download className="w-4 h-4 text-brand-600" />
                <span>Backup Data / બેકઅપ</span>
              </div>
              <p className="text-slate-500 font-medium leading-snug">
                રોજમેળ અને ડેડ સ્ટોકના તમામ રેકોર્ડ JSON ફાઇલમાં સેવ કરો.
              </p>
            </div>
            <button
              onClick={handleBackupJSON}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 rounded-xl shadow flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>JSON બેકઅપ ડાઉનલોડ</span>
            </button>
          </div>

          {/* Card 2: Export CSV */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export CSV / Excel નિકાસ</span>
              </div>
              <p className="text-slate-500 font-medium leading-snug">
                માઇક્રોસોફ્ટ એક્સેલ compatible CSV ફાઇલમાં નિકાસ કરો.
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl shadow flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Excel CSV ડાઉનલોડ</span>
            </button>
          </div>
        </div>

        {/* Card 3: Restore Data Section */}
        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-amber-700" />
              <span>Restore Data / ડેટા રિસ્ટોર કરો</span>
            </span>
          </div>

          <p className="text-amber-900 font-medium">
            જો તમે અગાઉ લીધેલ JSON બેકઅપ ફાઇલ અપલોડ કરશો તો તે ડેટા ફરીથી લોડ થશે.
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".json"
            className="hidden"
          />

          {!selectedBackupData ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl shadow flex items-center justify-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>JSON બેકઅપ ફાઇલ પસંદ કરો</span>
            </button>
          ) : (
            <div className="bg-white p-4 rounded-xl border border-amber-300 space-y-3 shadow-md">
              <div className="flex items-center gap-2 text-rose-700 font-bold">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>ચેતવણી: જૂનો Rojmel ડેટા ઓવરરાઇટ થશે!</span>
              </div>
              <p className="text-slate-700 font-semibold">
                મળેલ ફાઇલમાં {selectedBackupData.entries.length} રોજમેળ એન્ટ્રીઓ અને {selectedBackupData.deadStockItems.length} ડેડ સ્ટોક રેકોર્ડ્સ છે.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedBackupData(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold rounded-lg"
                >
                  રદ કરો
                </button>
                <button
                  onClick={handleConfirmRestore}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow"
                >
                  હા, Restore કરો
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 bg-rose-100 text-rose-800 border border-rose-300 rounded-xl font-bold text-center">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-center flex items-center justify-center gap-1">
              <Check className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
          >
            બંધ કરો
          </button>
        </div>
      </div>
    </div>
  );
};
