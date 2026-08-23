import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RojmelTransaction } from '../../types';
import { 
  Wallet, 
  Plus, 
  Printer, 
  AlertTriangle, 
  CheckCircle2, 
  Ban, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText, 
  ShieldCheck 
} from 'lucide-react';

export const RojmelView: React.FC = () => {
  const { 
    schoolProfile, 
    teacherProfile, 
    grants, 
    rojmelTransactions, 
    addRojmelTransaction, 
    voidRojmelTransaction,
    showToast 
  } = useApp();

  const [selectedGrantHead, setSelectedGrantHead] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [voidModalTx, setVoidModalTx] = useState<RojmelTransaction | null>(null);
  const [voidReasonInput, setVoidReasonInput] = useState('');

  // Add Transaction Form State
  const [formData, setFormData] = useState({
    accountId: grants[0]?.id || 'grnt-1',
    grantHead: grants[0]?.gujaratiName || 'કોમ્પોઝીટ સ્કૂલ ગ્રાન્ટ',
    date: new Date().toISOString().split('T')[0],
    voucherNo: `V-${new Date().getFullYear()}-${String(rojmelTransactions.length + 1).padStart(2, '0')}`,
    description: '',
    type: 'expense' as 'income' | 'expense',
    amount: 0,
    paymentMode: 'ચેક' as 'રોકડ' | 'ચેક' | 'ડિજિટલ/PFMS' | 'બેંક ટ્રાન્સફર',
    referenceNo: '',
    remarks: '',
    createdBy: teacherProfile.name
  });

  const filteredTransactions = rojmelTransactions.filter(t => {
    if (selectedGrantHead === 'all') return true;
    return t.grantHead === selectedGrantHead;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.status === 'સક્રિય')
    .reduce((sum, t) => sum + (t.income || 0), 0);

  const totalExpense = filteredTransactions
    .filter(t => t.status === 'સક્રિય')
    .reduce((sum, t) => sum + (t.expense || 0), 0);

  const netBalance = totalIncome - totalExpense;

  const handleGrantSelect = (headName: string) => {
    const selected = grants.find(g => g.gujaratiName === headName);
    setFormData(prev => ({
      ...prev,
      grantHead: headName,
      accountId: selected?.id || 'grnt-1'
    }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || formData.amount <= 0) return;

    addRojmelTransaction({
      accountId: formData.accountId,
      grantHead: formData.grantHead,
      date: formData.date,
      voucherNo: formData.voucherNo,
      description: formData.description,
      income: formData.type === 'income' ? formData.amount : 0,
      expense: formData.type === 'expense' ? formData.amount : 0,
      paymentMode: formData.paymentMode,
      referenceNo: formData.referenceNo,
      remarks: formData.remarks,
      createdBy: formData.createdBy
    });

    setShowAddModal(false);
    setFormData({
      ...formData,
      voucherNo: `V-${new Date().getFullYear()}-${String(rojmelTransactions.length + 2).padStart(2, '0')}`,
      description: '',
      amount: 0,
      referenceNo: '',
      remarks: ''
    });
  };

  const handleConfirmVoid = () => {
    if (!voidModalTx || !voidReasonInput.trim()) return;
    voidRojmelTransaction(voidModalTx.id, voidReasonInput.trim());
    setVoidModalTx(null);
    setVoidReasonInput('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <Wallet className="w-6 h-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              રોજમેળ અને ગ્રાન્ટ હિસાબ (Digital Cash Book)
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            ઓડિટ-સેફ દૈનિક રોજમેળ. આવક-જાવક નોંધ, ગ્રાન્ટ હેડ મુજબ વર્ગીકરણ અને અધિકૃત A4 પ્રિન્ટેબલ રોકડમેળ.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>નવી એન્ટ્રી / વાઉચર ઉમેરો</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>A4 રોજમેળ પ્રિન્ટ</span>
          </button>
        </div>
      </div>

      {/* Grant Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 no-print">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">કુલ જમા આવક (Total Income)</span>
          <div className="flex items-center space-x-2 mt-1">
            <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
            <span className="text-xl font-extrabold text-slate-900">₹{totalIncome.toLocaleString('gu-IN')}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">કુલ ખર્ચ / જાવક (Total Expenses)</span>
          <div className="flex items-center space-x-2 mt-1">
            <ArrowUpRight className="w-5 h-5 text-rose-600" />
            <span className="text-xl font-extrabold text-slate-900">₹{totalExpense.toLocaleString('gu-IN')}</span>
          </div>
        </div>

        <div className="bg-white border border-blue-200 bg-blue-50/40 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">હાલની સિલક (Closing Balance)</span>
          <div className="flex items-center space-x-2 mt-1">
            <Wallet className="w-5 h-5 text-blue-700" />
            <span className="text-xl font-extrabold text-blue-900">₹{netBalance.toLocaleString('gu-IN')}</span>
          </div>
        </div>

        <div className="bg-white border border-amber-200 bg-amber-50/40 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider">ઓડિટ નિયમ (Audit Safe)</span>
            <p className="text-xs text-amber-800 font-medium mt-0.5">કોઈપણ એન્ટ્રી ભૂંસાતી નથી (રદ રેકોર્ડ)</p>
          </div>
          <ShieldCheck className="w-7 h-7 text-amber-600 shrink-0" />
        </div>
      </div>

      {/* Grant Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap gap-2 items-center justify-between no-print">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700">ગ્રાન્ટ ફિલ્ટર:</span>
          <select
            value={selectedGrantHead}
            onChange={(e) => setSelectedGrantHead(e.target.value)}
            className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">બધા ગ્રાન્ટ હેડ્સ (All Grants)</option>
            {grants.map(g => (
              <option key={g.id} value={g.gujaratiName}>
                {g.gujaratiName} (સિલક: ₹{g.currentBalance})
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          કુલ વાઉચર્સ: <strong>{filteredTransactions.length}</strong>
        </span>
      </div>

      {/* Printable Sheet View */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        
        {/* Official Header */}
        <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">{schoolProfile.schoolName}</h2>
          <p className="text-xs text-slate-700 mt-0.5">
            {schoolProfile.address} • UDISE: <span className="font-mono font-bold">{schoolProfile.udiseCode}</span>
          </p>
          <div className="mt-2 inline-block bg-blue-100 px-4 py-1 rounded-full text-xs font-bold text-blue-950 border border-blue-300">
            દૈનિક રોકડમેળ / રોજમેળ પત્રક (Cash Book Register) — શૈક્ષણિક વર્ષ {schoolProfile.academicYear}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 font-bold text-slate-800 border-b border-slate-300">
              <tr>
                <th className="p-2.5 border-r border-slate-300 w-24">તારીખ</th>
                <th className="p-2.5 border-r border-slate-300 w-24">વાઉચર નં.</th>
                <th className="p-2.5 border-r border-slate-300 w-36">ગ્રાન્ટ હેડ</th>
                <th className="p-2.5 border-r border-slate-300">વિગત / ચૂકવણું / આવક વિગત</th>
                <th className="p-2.5 border-r border-slate-300 w-24 text-center">પેમેન્ટ મોડ / રેફ.</th>
                <th className="p-2.5 border-r border-slate-300 w-24 text-right bg-emerald-50/70">આવક (₹)</th>
                <th className="p-2.5 border-r border-slate-300 w-24 text-right bg-rose-50/70">જાવક (₹)</th>
                <th className="p-2.5 text-center w-20 no-print">સ્થિતિ / ક્રિયા</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    આ હેડમાં કોઈ ટ્રાન્ઝેક્શન મળ્યા નથી.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isVoid = tx.status === 'રદ કરેલ (Void)';
                  return (
                    <tr 
                      key={tx.id} 
                      className={`hover:bg-slate-50 transition-colors ${
                        isVoid ? 'bg-red-50/50 opacity-60 line-through text-slate-400' : ''
                      }`}
                    >
                      <td className="p-2.5 border-r border-slate-200 font-mono">{tx.date}</td>
                      <td className="p-2.5 border-r border-slate-200 font-mono font-bold text-blue-900">{tx.voucherNo}</td>
                      <td className="p-2.5 border-r border-slate-200 font-medium text-slate-700">{tx.grantHead}</td>
                      <td className="p-2.5 border-r border-slate-200">
                        <div className="font-semibold text-slate-900">{tx.description}</div>
                        {tx.remarks && <div className="text-[10px] text-slate-500 mt-0.5">{tx.remarks}</div>}
                        {isVoid && tx.voidReason && (
                          <div className="text-[10px] text-red-600 font-bold mt-0.5 not-line-through">
                            રદ કારણ: {tx.voidReason}
                          </div>
                        )}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-center font-mono">
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                          {tx.paymentMode}
                        </span>
                        {tx.referenceNo && <div className="text-[10px] text-slate-400 mt-0.5">{tx.referenceNo}</div>}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-right font-mono font-bold text-emerald-700 bg-emerald-50/30">
                        {tx.income > 0 ? `₹${tx.income.toLocaleString('gu-IN')}` : '-'}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-right font-mono font-bold text-rose-700 bg-rose-50/30">
                        {tx.expense > 0 ? `₹${tx.expense.toLocaleString('gu-IN')}` : '-'}
                      </td>
                      <td className="p-2.5 text-center no-print not-line-through">
                        {isVoid ? (
                          <span className="text-[10px] text-red-600 font-bold">રદ થયેલ</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setVoidModalTx(tx)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                            title="ઓડિટ રદ કરો (Void Transaction)"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td colSpan={5} className="p-2.5 text-right border-r border-slate-300">
                  કુલ સરવાળો (Total):
                </td>
                <td className="p-2.5 text-right font-mono text-emerald-800 border-r border-slate-300">
                  ₹{totalIncome.toLocaleString('gu-IN')}
                </td>
                <td className="p-2.5 text-right font-mono text-rose-800 border-r border-slate-300">
                  ₹{totalExpense.toLocaleString('gu-IN')}
                </td>
                <td className="p-2.5 text-center no-print"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Signatures */}
        <div className="mt-12 pt-8 grid grid-cols-2 text-center text-xs font-bold text-slate-800">
          <div>
            <p className="border-t border-slate-400 pt-1 inline-block px-8">રોજમેળ લખનાર (શિક્ષક / સહાયક)</p>
          </div>
          <div>
            <p className="border-t border-slate-400 pt-1 inline-block px-8">આચાર્ય / મુખ્ય શિક્ષક (સહી અને સિક્કો)</p>
          </div>
        </div>

      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">રોજમેળમાં નવી એન્ટ્રી (New Cash Entry)</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3 text-xs">
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                  className={`py-2 rounded-lg font-bold border ${
                    formData.type === 'expense'
                      ? 'bg-rose-50 border-rose-400 text-rose-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  જાવક / ખર્ચ (Expense)
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                  className={`py-2 rounded-lg font-bold border ${
                    formData.type === 'income'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  આવક / જમા (Income)
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ગ્રાન્ટ હેડ (Grant Account) *</label>
                <select
                  value={formData.grantHead}
                  onChange={(e) => handleGrantSelect(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                >
                  {grants.map(g => (
                    <option key={g.id} value={g.gujaratiName}>
                      {g.gujaratiName} (હાલ સિલક: ₹{g.currentBalance})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">તારીખ *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">વાઉચર નંબર *</label>
                  <input
                    type="text"
                    required
                    value={formData.voucherNo}
                    onChange={(e) => setFormData({ ...formData, voucherNo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ખર્ચ / આવકની વિગત (Description) *</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="દા.ત. A4 પેપર રીમ ખરીદી અથવા સાધન રિપેરિંગ"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">રકમ (₹ Amount) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="દા.ત. 1450"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">પેમેન્ટ મોડ (Payment Mode)</label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="ચેક">ચેક (Cheque)</option>
                    <option value="ડિજિટલ/PFMS">ડિજિટલ / PFMS</option>
                    <option value="રોકડ">રોકડ (Cash)</option>
                    <option value="બેંક ટ્રાન્સફર">બેંક ટ્રાન્સફર (NEFT)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">બિલ / રેફરન્સ / ચેક નંબર</label>
                <input
                  type="text"
                  value={formData.referenceNo}
                  onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
                  placeholder="દા.ત. CHQ-554203 અથવા Bill #1204"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">વિશેષ નોંધ (Remarks)</label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="દુકાનદાર નામ અથવા વધારાની વિગત"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs"
                >
                  રોજમેળમાં સાચવો
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Void Modal */}
      {voidModalTx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center space-x-3 text-red-600 pb-3 border-b border-slate-100">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">ઓડિટ રદ (Void Reversal)</h3>
            </div>

            <div className="my-4 text-xs text-slate-600 space-y-2">
              <p>
                વાઉચર નં. <strong className="text-slate-900">{voidModalTx.voucherNo}</strong> ({voidModalTx.description}) ને ઓડિટ નિયમ મુજબ રદ કરવામાં આવશે.
              </p>
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                ⚠️ સરકારી ઓડિટ નિયમ અનુસાર રેકોર્ડ ક્યારેય કાયમ માટે ભૂંસાતો નથી. તે રદ કરેલ કારણ સાથે સાચવવામાં આવશે.
              </p>
              
              <div className="pt-2">
                <label className="block font-semibold text-slate-700 mb-1">રદ કરવાનું ચોક્કસ કારણ *</label>
                <input
                  type="text"
                  required
                  value={voidReasonInput}
                  onChange={(e) => setVoidReasonInput(e.target.value)}
                  placeholder="દા.ત. ખોટી રકમ દાખલ થઈ હતી / બિલ રદ થયેલ છે"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setVoidModalTx(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
              >
                પાછા જાઓ
              </button>
              <button
                type="button"
                onClick={handleConfirmVoid}
                disabled={!voidReasonInput.trim()}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                રદની પુષ્ટિ કરો
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
