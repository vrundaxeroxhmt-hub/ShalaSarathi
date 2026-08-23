import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PmPoshanDailyRecord } from '../../types';
import { 
  UtensilsCrossed, 
  Plus, 
  Printer, 
  Trash2, 
  Calendar, 
  Settings2, 
  CheckCircle2, 
  Wheat, 
  IndianRupee 
} from 'lucide-react';

export const PmPoshanView: React.FC = () => {
  const { schoolProfile, teacherProfile, pmPoshanLogs, addPmPoshanLog, deletePmPoshanLog } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRateSettings, setShowRateSettings] = useState(false);

  // Configurable Rates State
  const [grainRatePrimary, setGrainRatePrimary] = useState(0.100); // 100g
  const [grainRateUpperPrimary, setGrainRateUpperPrimary] = useState(0.150); // 150g
  const [cookingRatePrimary, setCookingRatePrimary] = useState(5.45); // ₹5.45
  const [cookingRateUpperPrimary, setCookingRateUpperPrimary] = useState(8.17); // ₹8.17

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    primaryCount: 42,
    upperPrimaryCount: 38,
    menuItem: 'વેજ પુલાવ + છાશ',
    remarks: 'બાળકોએ ઉત્સાહપૂર્વક ભોજન લીધું'
  });

  const menus = [
    'વેજ પુલાવ + છાશ + સુખડી',
    'દાળ-ભાત + ચણા ચાટ / કઠોળ',
    'થેપલાં + બટાટા સૂકીભાજી',
    'દાળ-ઢોકળી + લીલી ડુંગળી',
    'ખીચડી-કઢી + મોહનથાળ / મિષ્ટાન',
    'શાક-રોટલી + સંભારો'
  ];

  const calcGrain = Number(((formData.primaryCount * grainRatePrimary) + (formData.upperPrimaryCount * grainRateUpperPrimary)).toFixed(3));
  const calcCost = Number(((formData.primaryCount * cookingRatePrimary) + (formData.upperPrimaryCount * cookingRateUpperPrimary)).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.primaryCount < 0 || formData.upperPrimaryCount < 0) return;

    addPmPoshanLog({
      date: formData.date,
      primaryCount: formData.primaryCount,
      upperPrimaryCount: formData.upperPrimaryCount,
      grainRatePrimary,
      grainRateUpperPrimary,
      cookingRatePrimary,
      cookingRateUpperPrimary,
      menuItem: formData.menuItem,
      remarks: formData.remarks
    });

    setShowAddModal(false);
  };

  const totalMonthlyGrain = pmPoshanLogs.reduce((sum, l) => sum + l.grainUsedKg, 0);
  const totalMonthlyCost = pmPoshanLogs.reduce((sum, l) => sum + l.totalCookingCost, 0);
  const totalBeneficiaryCount = pmPoshanLogs.reduce((sum, l) => sum + l.totalStudents, 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-orange-100 text-orange-800">
              <UtensilsCrossed className="w-6 h-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              PM પોષણ દૈનિક ગણતરી (PM Poshan / MDM Register)
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            પ્રાથમિક (૧ થી ૫) અને ઉચ્ચ પ્રાથમિક (૬ થી ૮) દૈનિક વિદ્યાર્થી હાજરી મુજબ અનાજ વપરાશ (કિગ્રા) અને કુકિંગ કોસ્ટનો આપોઆપ હિસાબ.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowRateSettings(!showRateSettings)}
            className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <Settings2 className="w-4 h-4" />
            <span>દર સેટિંગ્સ (Govt Rates)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-1.5 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>આજની નોંધણી કરો</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>A4 રજિસ્ટર પ્રિન્ટ</span>
          </button>
        </div>
      </div>

      {/* Rate Settings Card */}
      {showRateSettings && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 shadow-xs text-xs space-y-3 no-print">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-amber-900 flex items-center space-x-1.5">
              <Settings2 className="w-4 h-4 text-amber-700" />
              <span>સરકારી નિયત દરો (Configurable PM Poshan Norms)</span>
            </h4>
            <span className="text-[11px] text-amber-800 font-medium">સરકારી પરિપત્ર મુજબ ફેરફાર કરી શકાય છે.</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">પ્રાથમિક અનાજ દર (કિગ્રા)</label>
              <input
                type="number"
                step="0.001"
                value={grainRatePrimary}
                onChange={(e) => setGrainRatePrimary(parseFloat(e.target.value) || 0.100)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold"
              />
              <span className="text-[10px] text-slate-500">ધોરણ ૧ થી ૫ (૧૦૦ ગ્રામ)</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ઉચ્ચ પ્રાથમિક અનાજ દર (કિગ્રા)</label>
              <input
                type="number"
                step="0.001"
                value={grainRateUpperPrimary}
                onChange={(e) => setGrainRateUpperPrimary(parseFloat(e.target.value) || 0.150)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold"
              />
              <span className="text-[10px] text-slate-500">ધોરણ ૬ થી ૮ (૧૫૦ ગ્રામ)</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">પ્રાથમિક કુકિંગ કોસ્ટ (₹)</label>
              <input
                type="number"
                step="0.01"
                value={cookingRatePrimary}
                onChange={(e) => setCookingRatePrimary(parseFloat(e.target.value) || 5.45)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold"
              />
              <span className="text-[10px] text-slate-500">પ્રતિ બાળક ₹ ૫.૪૫</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ઉચ્ચ પ્રાથમિક કુકિંગ કોસ્ટ (₹)</label>
              <input
                type="number"
                step="0.01"
                value={cookingRateUpperPrimary}
                onChange={(e) => setCookingRateUpperPrimary(parseFloat(e.target.value) || 8.17)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold"
              />
              <span className="text-[10px] text-slate-500">પ્રતિ બાળક ₹ ૮.૧૭</span>
            </div>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 no-print">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">કુલ લાભાન્વિત બાળકો (Total Meals)</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalBeneficiaryCount} બાળકો</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center space-x-1.5 text-amber-800">
            <Wheat className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase">કુલ અનાજ વપરાશ (Grain Consumed)</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalMonthlyGrain.toFixed(2)} કિગ્રા</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center space-x-1.5 text-emerald-800">
            <IndianRupee className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase">કુલ કુકિંગ કોસ્ટ રકમ (Cooking Cost)</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">₹{totalMonthlyCost.toLocaleString('gu-IN')}</p>
        </div>
      </div>

      {/* Printable Sheet Register */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        
        {/* Official Header */}
        <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">{schoolProfile.schoolName}</h2>
          <p className="text-xs text-slate-700 mt-0.5">
            {schoolProfile.address} • UDISE: <span className="font-mono font-bold">{schoolProfile.udiseCode}</span>
          </p>
          <div className="mt-2 inline-block bg-orange-100 px-4 py-1 rounded-full text-xs font-bold text-orange-950 border border-orange-300">
            પી.એમ. પોષણ (મધ્યાહ્ન ભોજન યોજના) દૈનિક વપરાશ રજિસ્ટર — વર્ષ {schoolProfile.academicYear}
          </div>
        </div>

        {/* Register Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 font-bold text-slate-800 border-b border-slate-300">
              <tr>
                <th className="p-2.5 border-r border-slate-300 w-24">તારીખ</th>
                <th className="p-2.5 border-r border-slate-300 w-36">મેનુ (વાનગી)</th>
                <th className="p-2.5 border-r border-slate-300 w-20 text-center">પ્રાથમિક (૧-૫)</th>
                <th className="p-2.5 border-r border-slate-300 w-20 text-center">ઉ. પ્રાથમિક (૬-૮)</th>
                <th className="p-2.5 border-r border-slate-300 w-20 text-center bg-slate-200/60">કુલ હાજરી</th>
                <th className="p-2.5 border-r border-slate-300 w-24 text-right bg-amber-50/70">અનાજ વપરાશ (કિગ્રા)</th>
                <th className="p-2.5 border-r border-slate-300 w-24 text-right bg-emerald-50/70">કુકિંગ કોસ્ટ (₹)</th>
                <th className="p-2.5 border-r border-slate-300">નોંધ / ગુણવત્તા</th>
                <th className="p-2.5 text-center w-16 no-print">ક્રિયા</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pmPoshanLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    કોઈ નોંધણી થયેલ નથી.
                  </td>
                </tr>
              ) : (
                pmPoshanLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2.5 border-r border-slate-200 font-mono text-slate-600">{log.date}</td>
                    <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-800">{log.menuItem}</td>
                    <td className="p-2.5 border-r border-slate-200 text-center font-mono">{log.primaryCount}</td>
                    <td className="p-2.5 border-r border-slate-200 text-center font-mono">{log.upperPrimaryCount}</td>
                    <td className="p-2.5 border-r border-slate-200 text-center font-mono font-bold bg-slate-100/50">
                      {log.totalStudents}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-right font-mono font-bold text-amber-900 bg-amber-50/40">
                      {log.grainUsedKg}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-right font-mono font-bold text-emerald-800 bg-emerald-50/40">
                      ₹{log.totalCookingCost.toFixed(2)}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-slate-600">{log.remarks || '-'}</td>
                    <td className="p-2.5 text-center no-print">
                      <button
                        type="button"
                        onClick={() => deletePmPoshanLog(log.id)}
                        className="text-red-400 hover:text-red-600 p-1"
                        title="દૂર કરો"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td colSpan={4} className="p-2.5 text-right border-r border-slate-300">
                  કુલ સરવાળો (Monthly Total):
                </td>
                <td className="p-2.5 text-center font-mono border-r border-slate-300 bg-slate-200/60">
                  {totalBeneficiaryCount}
                </td>
                <td className="p-2.5 text-right font-mono text-amber-900 border-r border-slate-300 bg-amber-100/40">
                  {totalMonthlyGrain.toFixed(2)} કિગ્રા
                </td>
                <td className="p-2.5 text-right font-mono text-emerald-900 border-r border-slate-300 bg-emerald-100/40">
                  ₹{totalMonthlyCost.toFixed(2)}
                </td>
                <td colSpan={2} className="p-2.5 no-print"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Signatures */}
        <div className="mt-12 pt-8 grid grid-cols-2 text-center text-xs font-bold text-slate-800">
          <div>
            <p className="border-t border-slate-400 pt-1 inline-block px-8">MDM સંચાલક / શિક્ષક શ્રી</p>
          </div>
          <div>
            <p className="border-t border-slate-400 pt-1 inline-block px-8">આચાર્ય / મુખ્ય શિક્ષક (સહી અને સિક્કો)</p>
          </div>
        </div>

      </div>

      {/* Add PM Poshan Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">PM પોષણ દૈનિક હાજરી અને અનાજ એન્ટ્રી</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
              
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
                  <label className="block font-semibold text-slate-700 mb-1">મેનુ (મેન્યૂ પસંદ કરો) *</label>
                  <select
                    value={formData.menuItem}
                    onChange={(e) => setFormData({ ...formData, menuItem: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    {menus.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">પ્રાથમિક હાજરી (ધોરણ ૧ થી ૫) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.primaryCount}
                    onChange={(e) => setFormData({ ...formData, primaryCount: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-500">અનાજ: {grainRatePrimary * 1000}g • કુકિંગ: ₹{cookingRatePrimary}</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ઉચ્ચ પ્રાથમિક હાજરી (ધોરણ ૬ થી ૮) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.upperPrimaryCount}
                    onChange={(e) => setFormData({ ...formData, upperPrimaryCount: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-500">અનાજ: {grainRateUpperPrimary * 1000}g • કુકિંગ: ₹{cookingRateUpperPrimary}</span>
                </div>
              </div>

              {/* Automatic Calculation Preview */}
              <div className="bg-orange-50 p-3 rounded-xl border border-orange-200 text-orange-950 space-y-1 font-medium">
                <div className="flex justify-between">
                  <span>કુલ જમનાર બાળકો:</span>
                  <strong>{formData.primaryCount + formData.upperPrimaryCount} બાળકો</strong>
                </div>
                <div className="flex justify-between">
                  <span>આપોઆપ અનાજ જરૂરિયાત:</span>
                  <strong className="font-mono text-amber-900">{calcGrain} કિગ્રા ({calcGrain * 1000} ગ્રામ)</strong>
                </div>
                <div className="flex justify-between">
                  <span>આપોઆપ કુકિંગ કોસ્ટ રકમ:</span>
                  <strong className="font-mono text-emerald-900">₹{calcCost.toFixed(2)}</strong>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">નિરીક્ષણ / ગુણવત્તા નોંધ (Remarks)</label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="દા.ત. ખોરાકની ગુણવત્તા ઉત્તમ, SMC સભ્યશ્રી ઉપસ્થિત"
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
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold shadow-xs"
                >
                  રજિસ્ટરમાં નોંધો
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
