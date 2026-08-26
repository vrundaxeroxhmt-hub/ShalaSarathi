import React, { useState } from 'react';
import { X, UserPlus, Users, Phone, MapPin, Check } from 'lucide-react';
import { Supplier, SupplierSummary } from '@/types/payable';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  supplierSummaries: SupplierSummary[];
  onAddSupplier: (supplierData: { nameGuj: string; nameEng?: string; mobile: string; addressGuj?: string; notesGuj?: string }) => Promise<void>;
}

export const PayableSupplierModal: React.FC<Props> = ({
  isOpen,
  onClose,
  suppliers,
  supplierSummaries,
  onAddSupplier
}) => {
  const [nameGuj, setNameGuj] = useState('');
  const [nameEng, setNameEng] = useState('');
  const [mobile, setMobile] = useState('');
  const [addressGuj, setAddressGuj] = useState('');
  const [notesGuj, setNotesGuj] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameGuj || !mobile) return;

    await onAddSupplier({
      nameGuj,
      nameEng: nameEng || nameGuj,
      mobile,
      addressGuj,
      notesGuj
    });

    setNameGuj('');
    setNameEng('');
    setMobile('');
    setAddressGuj('');
    setNotesGuj('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">સપ્લાયર / વેપારી મેનેજમેન્ટ (Supplier Management)</h3>
              <p className="text-[10px] text-slate-400">પુનઃવપરાશ યોગ્ય વેપારી રેકોર્ડ્સ અને બાકી રકમ સમરી</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 font-bold rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Supplier Form */}
        <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
          <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
            <UserPlus className="w-4 h-4 text-brand-600" />
            <span>નવા વેપારી ઉમેરો (Add New Supplier)</span>
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">વેપારી નામ ગુજરાતી</label>
              <input
                type="text"
                required
                placeholder="દા.ત. શ્રી રામદેવ સ્ટેશનરી અંબાજી"
                value={nameGuj}
                onChange={e => setNameGuj(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">વેપારી નામ ઈંગ્લીશ</label>
              <input
                type="text"
                placeholder="Shree Ramdev Stationery"
                value={nameEng}
                onChange={e => setNameEng(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">મોબાઈલ નંબર</label>
              <input
                type="text"
                required
                placeholder="98250 12345"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">સરનામું (Address)</label>
              <input
                type="text"
                placeholder="સ્ટેશન રોડ, અંબાજી"
                value={addressGuj}
                onChange={e => setAddressGuj(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              <span>વેપારી સેવ કરો</span>
            </button>
          </div>
        </form>

        {/* Existing Suppliers & Outstanding Breakdown Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-900 text-slate-200 font-bold uppercase sticky top-0">
              <tr>
                <th className="py-2.5 px-3">વેપારી નામ</th>
                <th className="py-2.5 px-3">મોબાઈલ</th>
                <th className="py-2.5 px-3 text-center">બિલ સંખ્યા</th>
                <th className="py-2.5 px-3 text-right">કુલ રકમ</th>
                <th className="py-2.5 px-3 text-right">કુલ ચુકવેલ</th>
                <th className="py-2.5 px-3 text-right">કુલ બાકી રકમ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {supplierSummaries.map(ss => (
                <tr key={ss.supplierId} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{ss.supplierNameGuj}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 font-medium">{ss.supplierMobile || '-'}</td>
                  <td className="py-2.5 px-3 text-center font-bold">{ss.totalBillsCount}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-800">₹{ss.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-700">₹{ss.totalPaid.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right font-black text-rose-700 bg-rose-50/50">
                    ₹{ss.totalOutstanding.toLocaleString('en-IN')}
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
