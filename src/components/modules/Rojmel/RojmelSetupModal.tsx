import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { RojmelAccountSetup } from '@/types/rojmel';
import { rojmelRepo } from '@/lib/repositories/LocalStorageRepository';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setup: RojmelAccountSetup | null;
  onSaveSuccess: () => Promise<void>;
}

export const RojmelSetupModal: React.FC<Props> = ({
  isOpen,
  onClose,
  setup,
  onSaveSuccess
}) => {
  const isEditingAllowed = !setup?.isLocked || setup?.editRequestStatus === 'released_once';

  const [schoolNameGuj, setSchoolNameGuj] = useState(setup?.schoolNameGuj || 'અંબાજી પ્રાથમિક શાળા નંબર ૧');
  const [rojmelNameGuj, setRojmelNameGuj] = useState(setup?.rojmelNameGuj || 'શાળા કાર્યાલય મુખ્ય રોજમેળ રજિસ્ટર');
  const [financialYear, setFinancialYear] = useState(setup?.financialYear || '2026-27');
  const [bankName, setBankName] = useState(setup?.bankName || 'State Bank of India');
  const [accountNumber, setAccountNumber] = useState(setup?.accountNumber || '4892');
  const [ifsc, setIfsc] = useState(setup?.ifsc || 'SBIN0001234');
  const [branch, setBranch] = useState(setup?.branch || 'અંબાજી શાખા');
  const [openingBalance, setOpeningBalance] = useState(setup?.openingBalance ? String(setup.openingBalance) : '25000');

  const [showConfirmSweetAlert, setShowConfirmSweetAlert] = useState(false);
  const [editReason, setEditReason] = useState('');
  const [showEditRequestModal, setShowEditRequestModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInitialFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmSweetAlert(true);
  };

  const handleFinalSubmit = async () => {
    try {
      // Quota Check
      if (!setup) {
        const quota = await rojmelRepo.checkPackageQuotaAllowed();
        if (!quota.allowed) {
          setAlertMsg(`તમારા સબ્સ્ક્રિપ્શન પ્લાન મુજબ મહત્તમ ${quota.maxAllowed} રોજમેળ જ બનાવી શકાય છે.`);
          setShowConfirmSweetAlert(false);
          return;
        }
      }

      const maskedAcc = accountNumber.length > 4 
        ? `••••••••${accountNumber.slice(-4)}` 
        : accountNumber;

      await rojmelRepo.saveSetup({
        schoolNameGuj,
        schoolNameEng: 'Ambaji Primary School No. 1',
        rojmelNameGuj,
        rojmelNameEng: 'School Office Main Rojmel Register',
        financialYear,
        bankName,
        accountNumber: maskedAcc,
        ifsc,
        branch,
        openingBalance: parseFloat(openingBalance),
        isLocked: true, // Locked on submission!
        editRequestStatus: 'none'
      });

      setShowConfirmSweetAlert(false);
      await onSaveSuccess();
      onClose();
    } catch (err: any) {
      setAlertMsg(err.message || 'સેટઅપ સેવ કરવામાં ભૂલ આવી.');
      setShowConfirmSweetAlert(false);
    }
  };

  const handleSendEditRequest = async () => {
    if (!setup || !editReason) return;
    await rojmelRepo.requestEditRelease(setup.id, editReason);
    alert('એડમિનને ફેરફાર માટેની વિનંતી મોકલાઈ ગઈ છે. એડમિન 1-Time મંજૂરી આપશે.');
    setShowEditRequestModal(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">શાળા રોજમેળ સેટઅપ (Rojmel Setup & Locking)</h3>
              <p className="text-[10px] text-slate-400">સત્તાવાર બેંક અને શાળા સેટઅપ માહિતી</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 font-bold rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lock Warning Banner if Setup is Locked */}
        {setup?.isLocked && setup.editRequestStatus !== 'released_once' && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-amber-900">
              <div className="font-extrabold">🔒 રોજમેળ સેટઅપ લોક થયેલ છે (Setup Locked)</div>
              <p className="font-medium text-[11px] leading-relaxed">
                શાળાનું નામ, રોજમેળ નામ અને નાણાકીય વર્ષ સુરક્ષા નીતિ મુજબ લોક છે. ફેરફાર કરવા માટે એડમિન પરમિશન જરૂરી છે.
              </p>
              {setup.editRequestStatus === 'requested' ? (
                <div className="text-[10px] bg-amber-200 text-amber-950 px-2.5 py-1 rounded-lg font-bold w-fit mt-1">
                  ⏳ એડમિન મંજૂરી માટે વિનંતી મોકલેલ છે...
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowEditRequestModal(true)}
                  className="mt-1 bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow"
                >
                  એડમિન પાસે સુધારા પરમિશન માગો (Request Edit)
                </button>
              )}
            </div>
          </div>
        )}

        {/* One-Time Edit Released Pill */}
        {setup?.editRequestStatus === 'released_once' && (
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs text-emerald-900 font-bold flex items-center justify-between">
            <span>✨ એડમિને ૧-વખત માટે સુધારા પરમિશન આપી છે (One-Time Edit Release)</span>
            <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-md">Save પર ઓટો-લોક થશે</span>
          </div>
        )}

        {/* Setup Form */}
        <form onSubmit={handleInitialFormSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">શાળાનું નામ (School Name)</label>
              <input
                type="text"
                disabled={!isEditingAllowed}
                value={schoolNameGuj}
                onChange={e => setSchoolNameGuj(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">રોજમેળ નામ (Rojmel Name)</label>
              <input
                type="text"
                disabled={!isEditingAllowed}
                value={rojmelNameGuj}
                onChange={e => setRojmelNameGuj(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">નાણાકીય વર્ષ (Financial Year)</label>
              <select
                disabled={!isEditingAllowed}
                value={financialYear}
                onChange={e => setFinancialYear(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 disabled:opacity-60"
              >
                <option value="2025-26">2025-26</option>
                <option value="2026-27">2026-27</option>
                <option value="2027-28">2027-28</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">પ્રારંભિક સિલક (Opening Balance ₹)</label>
              <input
                type="number"
                disabled={!isEditingAllowed}
                value={openingBalance}
                onChange={e => setOpeningBalance(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-extrabold text-slate-900 text-sm disabled:opacity-60"
              />
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
            <span className="font-bold text-slate-800 text-xs">બેંક ખાતા વિગત (Bank Details)</span>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-0.5">બેંકનું નામ</label>
                <input
                  type="text"
                  disabled={!isEditingAllowed}
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-0.5">ખાતા નંબર (Masked)</label>
                <input
                  type="text"
                  disabled={!isEditingAllowed}
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-0.5">IFSC કોડ</label>
                <input
                  type="text"
                  disabled={!isEditingAllowed}
                  value={ifsc}
                  onChange={e => setIfsc(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-0.5">શાખા (Branch)</label>
                <input
                  type="text"
                  disabled={!isEditingAllowed}
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
            >
              બંધ કરો
            </button>
            {isEditingAllowed && (
              <button
                type="submit"
                className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                સબમિટ કરો (Submit & Lock)
              </button>
            )}
          </div>
        </form>
      </div>

      {/* SweetAlert Style Confirmation Modal */}
      {showConfirmSweetAlert && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 font-sans text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center border-2 border-amber-300 animate-bounce">
              <HelpCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-lg">રોજમેળ સેટઅપ ફાઇનલ સબમિટ?</h3>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                સબમિટ કર્યા બાદ શાળાનું નામ, રોજમેળ નામ અને નાણાકીય વર્ષ લોક થઈ જશે. ફેરફાર માટે એડમિન મંજૂરીની જરૂર પડશે.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmSweetAlert(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                ફરી ચકાસો
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-lg flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>હા, ખરેખર લોક કરો</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Request Modal */}
      {showEditRequestModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 font-sans">
            <h3 className="font-bold text-slate-900 text-base">એડમિન પરમિશન વિનંતી (Request Edit)</h3>
            <p className="text-xs text-slate-500">
              રોજમેળ સેટઅપ ફેરફાર કરવા માટેનું ચોક્કસ કારણ દર્શાવો.
            </p>
            <textarea
              required
              rows={3}
              placeholder="દા.ત. નાણાકીય વર્ષ અથવા બેંક ખાતા ક્રમાંકમાં ભૂલ સુધારવા માટે..."
              value={editReason}
              onChange={e => setEditReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditRequestModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                રદ કરો
              </button>
              <button
                onClick={handleSendEditRequest}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow"
              >
                વિનંતી મોકલો
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
