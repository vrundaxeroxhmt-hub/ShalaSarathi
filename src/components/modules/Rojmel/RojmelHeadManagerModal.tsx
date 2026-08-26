import React, { useState } from 'react';
import { X, Plus, Trash2, ShieldAlert, Edit3, Check } from 'lucide-react';
import { HeadItem } from '@/types/rojmel';
import { rojmelRepo } from '@/lib/repositories/LocalStorageRepository';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  heads: HeadItem[];
  financialYear: string;
  onRefresh: () => Promise<void>;
  teacherCanEditLimits: boolean;
}

export const RojmelHeadManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  heads,
  financialYear,
  onRefresh,
  teacherCanEditLimits
}) => {
  const [editingHeadId, setEditingHeadId] = useState<string | null>(null);
  const [headNameGuj, setHeadNameGuj] = useState('');
  const [headNameEng, setHeadNameEng] = useState('');
  const [grantCategory, setGrantCategory] = useState('Composite School Grant');
  const [grantLimit, setGrantLimit] = useState('10000');
  const [overspentAllowed, setOverspentAllowed] = useState(false);

  if (!isOpen) return null;

  const handleStartEdit = (head: HeadItem) => {
    setEditingHeadId(head.id);
    setHeadNameGuj(head.headNameGuj);
    setHeadNameEng(head.headNameEng);
    setGrantCategory(head.grantCategory);
    setGrantLimit(String(head.grantLimit));
    setOverspentAllowed(head.overspentAllowed);
  };

  const handleCancelEdit = () => {
    setEditingHeadId(null);
    setHeadNameGuj('');
    setHeadNameEng('');
    setGrantCategory('Composite School Grant');
    setGrantLimit('10000');
    setOverspentAllowed(false);
  };

  const handleSaveHead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headNameGuj || !grantLimit) return;

    const numLimit = parseFloat(grantLimit);
    if (isNaN(numLimit) || numLimit < 0) {
      alert('કૃપા કરીને માન્ય ધનાત્મક ગ્રાન્ટ લિમિટ દાખલ કરો.');
      return;
    }

    if (editingHeadId) {
      await rojmelRepo.updateHead(editingHeadId, {
        headNameGuj,
        headNameEng: headNameEng || headNameGuj,
        grantCategory,
        grantLimit: numLimit,
        overspentAllowed
      });
    } else {
      await rojmelRepo.saveHead({
        headNameGuj,
        headNameEng: headNameEng || headNameGuj,
        grantCategory,
        grantLimit: numLimit,
        financialYear,
        overspentAllowed
      });
    }

    handleCancelEdit();
    await onRefresh();
  };

  const handleDelete = async (id: string) => {
    await rojmelRepo.deleteHead(id);
    await onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">ગ્રાન્ટ હેડ મેનેજમેન્ટ (Head Management)</h3>
            <p className="text-[10px] text-slate-400">નાણાકીય વર્ષ {financialYear} માટેના બજેટ હેડ અને લિમિટ</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 font-bold rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protected Setting Alert if Teacher Edit Disabled */}
        {!teacherCanEditLimits && (
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl text-xs text-rose-900 font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>⚠️ એડમિન સેટિંગ: ગ્રાન્ટ લિમિટમાં ફેરફાર શિક્ષક દ્વારા કરી શકાશે નહીં (Protected Limits).</span>
          </div>
        )}

        {/* Add / Edit Head Form */}
        <form onSubmit={handleSaveHead} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
              {editingHeadId ? <Edit3 className="w-4 h-4 text-brand-600" /> : <Plus className="w-4 h-4 text-brand-600" />}
              <span>{editingHeadId ? 'ગ્રાન્ટ હેડ સુધારો (Edit Head)' : 'નવો ગ્રાન્ટ હેડ ઉમેરો (Add Head)'}</span>
            </span>
            {editingHeadId && (
              <button type="button" onClick={handleCancelEdit} className="text-[11px] text-rose-600 font-bold">
                રદ કરો
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">હેડ નામ ગુજરાતી</label>
              <input
                type="text"
                required
                placeholder="દા.ત. TLM શૈક્ષણિક સાહિત્ય ગ્રાન્ટ"
                value={headNameGuj}
                onChange={e => setHeadNameGuj(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">હેડ નામ ઈંગ્લીશ</label>
              <input
                type="text"
                placeholder="TLM Grant"
                value={headNameEng}
                onChange={e => setHeadNameEng(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ગ્રાન્ટ કેટેગરી</label>
              <input
                type="text"
                value={grantCategory}
                onChange={e => setGrantCategory(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">મંજૂર ગ્રાન્ટ લિમિટ (₹)</label>
              <input
                type="number"
                required
                disabled={!teacherCanEditLimits}
                value={grantLimit}
                onChange={e => setGrantLimit(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-extrabold text-slate-900 disabled:opacity-60"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={overspentAllowed}
                  onChange={e => setOverspentAllowed(e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded"
                />
                <span>વધુ ખર્ચ મંજૂર</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow flex items-center gap-1"
            >
              {editingHeadId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{editingHeadId ? 'લિમિટ સુધારો (Update Limit)' : 'હેડ સેવ કરો'}</span>
            </button>
          </div>
        </form>

        {/* Existing Heads Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-60 overflow-y-auto font-sans">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-900 text-slate-200 font-bold uppercase sticky top-0">
              <tr>
                <th className="py-2.5 px-3">હેડ નામ</th>
                <th className="py-2.5 px-3">કેટેગરી</th>
                <th className="py-2.5 px-3 text-right">બજેટ લિમિટ (₹)</th>
                <th className="py-2.5 px-3 text-center">ઓવરસ્પેન્ડ</th>
                <th className="py-2.5 px-3 text-center">એક્શન</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {heads.map(h => (
                <tr key={h.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{h.headNameGuj}</td>
                  <td className="py-2.5 px-3 text-slate-600 font-semibold">{h.grantCategory}</td>
                  <td className="py-2.5 px-3 text-right font-black text-slate-900">₹{h.grantLimit.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-center font-bold">
                    {h.overspentAllowed ? (
                      <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full">YES</span>
                    ) : (
                      <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded-full">NO</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleStartEdit(h)}
                        className="p-1 text-brand-600 hover:bg-brand-50 rounded"
                        title="લિમિટ સુધારો (Edit Limit)"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(h.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
