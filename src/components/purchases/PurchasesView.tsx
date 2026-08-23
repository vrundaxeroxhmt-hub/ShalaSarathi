import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PurchaseItem } from '../../types';
import { 
  ShoppingCart, 
  Plus, 
  Printer, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  Store, 
  Receipt,
  X
} from 'lucide-react';

export const PurchasesView: React.FC = () => {
  const { schoolProfile, teacherProfile, grants, purchases, addPurchase, deletePurchase } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [printableVoucher, setPrintableVoucher] = useState<PurchaseItem | null>(null);

  // New Purchase Form
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    itemName: '',
    quantity: 1,
    unit: 'નંગ',
    rate: 0,
    grantHead: grants[0]?.gujaratiName || 'કોમ્પોઝીટ સ્કૂલ ગ્રાન્ટ',
    vendorName: 'વૃંદા ઝેરોક્ષ એન્ડ સ્ટેશનરી, હિંમતનગર',
    billNo: '',
    remarks: ''
  });

  const totalCalculated = Number((formData.quantity * formData.rate).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemName.trim() || formData.quantity <= 0 || formData.rate <= 0) return;

    addPurchase({
      date: formData.date,
      itemName: formData.itemName,
      quantity: formData.quantity,
      unit: formData.unit,
      rate: formData.rate,
      grantHead: formData.grantHead,
      vendorName: formData.vendorName,
      billNo: formData.billNo,
      remarks: formData.remarks
    });

    setShowAddModal(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      itemName: '',
      quantity: 1,
      unit: 'નંગ',
      rate: 0,
      grantHead: grants[0]?.gujaratiName || 'કોમ્પોઝીટ સ્કૂલ ગ્રાન્ટ',
      vendorName: 'વૃંદા ઝેરોક્ષ એન્ડ સ્ટેશનરી, હિંમતનગર',
      billNo: '',
      remarks: ''
    });
  };

  const totalPurchasesSum = purchases.reduce((sum, p) => sum + p.total, 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <ShoppingCart className="w-6 h-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              સ્ટેશનરી અને સાધન ખરીદી રજિસ્ટર (Purchases & Vouchers)
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            શાળા માટે ખરીદેલી સ્ટેશનરી, રમતગમત સાધન કે અન્ય સામગ્રીની નોંધણી. ખરીદી નોંધતાં જ રોજમેળ વાઉચર આપોઆપ બની જાય છે.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>નવી ખરીદી નોંધો</span>
          </button>
        </div>
      </div>

      {/* Summary Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 no-print">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">કુલ ખરીદી રકમ (Total Purchases)</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">₹{totalPurchasesSum.toLocaleString('gu-IN')}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">કુલ ખરીદી આઇટમ્સ</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{purchases.length} રેકોર્ડ્સ</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-900 uppercase">રોજમેળ લિંક (Auto-Sync)</span>
            <p className="text-xs text-amber-800 font-medium mt-0.5">આપોઆપ વાઉચર અને ગ્રાન્ટ કપાત</p>
          </div>
          <Receipt className="w-6 h-6 text-amber-600" />
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
          <h3 className="font-bold text-sm text-slate-900">ખરીદી અને વાઉચર વિગતવાર યાદી</h3>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 font-bold text-slate-800 border-b border-slate-300">
              <tr>
                <th className="p-2.5 border-r border-slate-300 w-24">તારીખ</th>
                <th className="p-2.5 border-r border-slate-300">સામગ્રી / વસ્તુનું નામ</th>
                <th className="p-2.5 border-r border-slate-300 w-20 text-center">જથ્થો</th>
                <th className="p-2.5 border-r border-slate-300 w-20 text-right">ભાવ (₹)</th>
                <th className="p-2.5 border-r border-slate-300 w-24 text-right bg-amber-50/70">કુલ રકમ (₹)</th>
                <th className="p-2.5 border-r border-slate-300 w-36">ગ્રાન્ટ હેડ</th>
                <th className="p-2.5 border-r border-slate-300">વેપારી / બિલ નં.</th>
                <th className="p-2.5 text-center w-28 no-print">ક્રિયા / વાઉચર</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    કોઈ ખરીદી નોંધાઈ નથી.
                  </td>
                </tr>
              ) : (
                purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2.5 border-r border-slate-200 font-mono text-slate-600">{p.date}</td>
                    <td className="p-2.5 border-r border-slate-200 font-bold text-slate-900">
                      {p.itemName}
                      {p.remarks && <div className="text-[10px] text-slate-400 font-normal mt-0.5">{p.remarks}</div>}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-center font-semibold">
                      {p.quantity} {p.unit}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-right font-mono text-slate-700">
                      ₹{p.rate}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-right font-mono font-bold text-amber-900 bg-amber-50/40">
                      ₹{p.total.toLocaleString('gu-IN')}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-slate-700 font-medium">
                      {p.grantHead}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-slate-600">
                      <div>{p.vendorName}</div>
                      {p.billNo && <div className="text-[10px] text-slate-400 font-mono">Bill #{p.billNo}</div>}
                    </td>
                    <td className="p-2.5 text-center no-print">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setPrintableVoucher(p)}
                          className="inline-flex items-center space-x-1 text-blue-700 hover:text-blue-900 bg-blue-50 px-2 py-1 rounded text-[11px] font-bold"
                          title="વાઉચર પ્રિન્ટ"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>વાઉચર</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePurchase(p.id)}
                          className="text-red-400 hover:text-red-600 p-1 rounded"
                          title="દૂર કરો"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Purchase Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">નવી ખરીદી અને વાઉચર એન્ટ્રી</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ખરીદી તારીખ *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ગ્રાન્ટ હેડ (Grant Head) *</label>
                  <select
                    value={formData.grantHead}
                    onChange={(e) => setFormData({ ...formData, grantHead: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    {grants.map(g => (
                      <option key={g.id} value={g.gujaratiName}>
                        {g.gujaratiName} (સિલક: ₹{g.currentBalance})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">સામગ્રી / વસ્તુનું નામ (Item Name) *</label>
                <input
                  type="text"
                  required
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  placeholder="દા.ત. A4 પેપર રીમ (JK Copier 75 GSM)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">જથ્થો (Qty) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 1 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">એકમ (Unit)</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="નંગ / રીમ / પેકેટ"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ભાવ / દર (Rate ₹) *</label>
                  <input
                    type="number"
                    min={0.1}
                    step="0.01"
                    required
                    value={formData.rate || ''}
                    onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
                    placeholder="દા.ત. 290"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Total Calculation Strip */}
              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900 flex justify-between items-center font-bold">
                <span>કુલ ગણતરી (Total = Qty × Rate):</span>
                <span className="font-mono text-sm">₹{totalCalculated.toLocaleString('gu-IN')}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">દુકાનદાર / વેન્ડર નામ</label>
                  <input
                    type="text"
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">બિલ નંબર (Bill No.)</label>
                  <input
                    type="text"
                    value={formData.billNo}
                    onChange={(e) => setFormData({ ...formData, billNo: e.target.value })}
                    placeholder="1204"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ઉપયોગ / નોંધ (Remarks)</label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="દા.ત. પરીક્ષા પેપર ઝેરોક્ષ અને પત્રક પ્રિન્ટ માટે"
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-xs"
                >
                  ખરીદી નોંધો અને વાઉચર બનાવો
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Printable Purchase Voucher Modal */}
      {printableVoucher && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 no-print">
              <span className="font-bold text-sm text-slate-800">અધિકૃત ખરીદી વાઉચર પ્રિન્ટ</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold"
                >
                  પ્રિન્ટ (Print)
                </button>
                <button
                  type="button"
                  onClick={() => setPrintableVoucher(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Official Voucher Layout */}
            <div className="mt-4 border-2 border-slate-800 p-6 rounded-xl text-xs space-y-4">
              <div className="text-center border-b-2 border-slate-800 pb-3">
                <h2 className="text-base font-bold text-slate-900">{schoolProfile.schoolName}</h2>
                <p className="text-[11px] text-slate-600">{schoolProfile.address} • UDISE: {schoolProfile.udiseCode}</p>
                <div className="mt-2 inline-block bg-slate-100 border border-slate-300 px-3 py-0.5 rounded-full font-bold">
                  ખરીદી ચૂકવણું વાઉચર (Payment / Purchase Voucher)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>તારીખ: <strong>{printableVoucher.date}</strong></div>
                <div className="text-right">ગ્રાન્ટ હેડ: <strong>{printableVoucher.grantHead}</strong></div>
                <div>વેપારીનું નામ: <strong>{printableVoucher.vendorName}</strong></div>
                <div className="text-right">બિલ નં.: <strong className="font-mono">{printableVoucher.billNo || '-'}</strong></div>
              </div>

              <table className="w-full border border-slate-400 text-left my-3">
                <thead className="bg-slate-100 border-b border-slate-400 font-bold">
                  <tr>
                    <th className="p-2 border-r border-slate-400">સામગ્રીની વિગત</th>
                    <th className="p-2 border-r border-slate-400 text-center w-16">જથ્થો</th>
                    <th className="p-2 border-r border-slate-400 text-right w-20">દર (₹)</th>
                    <th className="p-2 text-right w-24">કુલ રકમ (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-medium">
                      {printableVoucher.itemName}
                      {printableVoucher.remarks && <div className="text-[10px] text-slate-500">{printableVoucher.remarks}</div>}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-center font-mono">{printableVoucher.quantity} {printableVoucher.unit}</td>
                    <td className="p-2 border-r border-slate-300 text-right font-mono">₹{printableVoucher.rate}</td>
                    <td className="p-2 text-right font-mono font-bold">₹{printableVoucher.total.toLocaleString('gu-IN')}</td>
                  </tr>
                </tbody>
              </table>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <p className="font-semibold text-slate-800">
                  પ્રમાણપત્ર: ઉપરોક્ત સામગ્રી શાળાના ઉપયોગ અર્થે સારી ગુણવત્તામાં મેળવેલ છે અને ડેડસ્ટોક/વપરાશી રજિસ્ટરે નોંધેલ છે.
                </p>
              </div>

              <div className="pt-8 grid grid-cols-2 text-center text-[11px] font-bold text-slate-800">
                <div>
                  <p className="border-t border-slate-400 pt-1 inline-block px-6">માલ સ્વીકારનાર શિક્ષક</p>
                </div>
                <div>
                  <p className="border-t border-slate-400 pt-1 inline-block px-6">આચાર્ય / મુખ્ય શિક્ષક (સિક્કો)</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
