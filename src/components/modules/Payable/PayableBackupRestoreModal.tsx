import React, { useState, useRef } from 'react';
import { X, Download, Upload, FileSpreadsheet, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PayableItem, Supplier } from '@/types/payable';
import { exportPayableBackup, exportPayableCSV, validateAndParsePayableBackup } from '@/lib/services/payableService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  payables: PayableItem[];
  suppliers: Supplier[];
  onRestoreSuccess: (newPayables: PayableItem[], newSuppliers: Supplier[]) => Promise<void>;
}

export const PayableBackupRestoreModal: React.FC<Props> = ({
  isOpen,
  onClose,
  payables,
  suppliers,
  onRestoreSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    exportPayableBackup(payables, suppliers);
  };

  const handleDownloadCSV = () => {
    exportPayableCSV(payables);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    setParsedData(null);
    setShowOverwriteConfirm(false);

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        const result = validateAndParsePayableBackup(text);

        if (!result.isValid || !result.data) {
          setValidationError(result.error || 'અમાન્ય બેકઅપ ફાઇલ ફોર્મેટ.');
        } else {
          setParsedData(result.data);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFinalRestore = async () => {
    if (!parsedData) return;
    await onRestoreSuccess(parsedData.payables, parsedData.suppliers);
    alert('ઉધારી ડેટા સફળતાપૂર્વક રીસ્ટોર થયો!');
    setShowOverwriteConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">ઉધારી ડેટા બેકઅપ અને રીસ્ટોર (Backup & Restore)</h3>
              <p className="text-[10px] text-slate-400">JSON સુરક્ષિત સંગ્રહ અને Excel CSV એક્સપોર્ટ</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 font-bold rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownloadBackup}
            className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left space-y-2 group transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">JSON બેકઅપ ડાઉનલોડ</h4>
              <p className="text-[10px] text-slate-500 font-medium">સંપૂર્ણ ચુકવણી ઇતિહાસ અને ઇમેજ સાથે ડાઉનલોડ કરો.</p>
            </div>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left space-y-2 group transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Excel CSV એક્સપોર્ટ</h4>
              <p className="text-[10px] text-slate-500 font-medium">Excel માં જોઈ શકાય તેવી UTF-8 BOM CSV ફાઇલ.</p>
            </div>
          </button>
        </div>

        {/* Restore Section */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-brand-600" />
            <span>JSON બેકઅપ ફાઇલ રીસ્ટોર (Restore from JSON)</span>
          </span>

          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!selectedFile ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 bg-white border border-dashed border-slate-300 rounded-xl font-bold text-slate-700 text-xs hover:border-brand-500 transition-colors"
            >
              📁 ફાઇલ સિલેક્ટ કરવા માટે અહીં કલીક કરો
            </button>
          ) : (
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>ચૂંટાયેલ ફાઇલ: {selectedFile.name}</span>
                {parsedData && <span className="text-emerald-600 font-extrabold">✓ માન્ય બેકઅપ</span>}
              </div>

              {validationError && (
                <div className="text-rose-600 font-bold bg-rose-50 p-2 rounded-lg text-[11px]">
                  ⚠️ {validationError}
                </div>
              )}

              {parsedData && !showOverwriteConfirm && (
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] text-slate-600 font-medium">
                    આ બેકઅપમાં <strong>{parsedData.payables.length}</strong> ઉધારી રેકોર્ડ્સ અને <strong>{parsedData.suppliers.length}</strong> વેપારીઓ છે.
                  </div>
                  <button
                    onClick={() => setShowOverwriteConfirm(true)}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow"
                  >
                    રીસ્ટોર પ્રક્રિયા આગળ વધારો
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Overwrite Confirmation Alert */}
          {showOverwriteConfirm && (
            <div className="bg-rose-100 border border-rose-300 p-4 rounded-2xl space-y-3 text-xs text-rose-950 font-bold">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold">⚠️ ચેતવણી: હાલના ઉધારી રેકોર્ડ્સ ઓવરરાઇટ થશે!</div>
                  <p className="font-medium text-[11px] text-rose-900 leading-relaxed mt-0.5">
                    આ પ્રક્રિયા હાલના તમામ ઉધારી ડેટાને નવી ફાઇલ વડે બદલશે. (રોજમેળ ડેટા સુરક્ષિત રહેશે).
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowOverwriteConfirm(false)}
                  className="px-4 py-2 bg-white text-slate-700 font-bold rounded-xl"
                >
                  રદ કરો
                </button>
                <button
                  onClick={handleFinalRestore}
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-extrabold rounded-xl shadow"
                >
                  હા, ખરેખર રીસ્ટોર કરો
                </button>
              </div>
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
