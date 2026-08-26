import React, { useEffect } from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { ParishishtNumber } from '@/types/parishishtTemplate';
import { RojmelEntry, HeadItem } from '@/types/rojmel';
import { TeacherProfile } from '@/types/user';
import { renderParishishtData, getApplicableParishishtTemplate } from '@/lib/services/parishishtTemplateEngine';

interface Props {
  parishishtNo: ParishishtNumber;
  documentDate: string;
  forcedVersion?: number;
  orientation?: 'landscape' | 'portrait';
  rojmelEntries: RojmelEntry[];
  heads: HeadItem[];
  teacher: TeacherProfile;
  onClose: () => void;
}

export const RojmelParishishtPrintRenderer: React.FC<Props> = ({
  parishishtNo,
  documentDate,
  forcedVersion,
  orientation = 'landscape',
  rojmelEntries,
  heads,
  teacher,
  onClose
}) => {
  const isLandscape = orientation === 'landscape';

  useEffect(() => {
    if (isLandscape) {
      document.body.classList.add('landscape-mode');
    } else {
      document.body.classList.remove('landscape-mode');
    }
    return () => {
      document.body.classList.remove('landscape-mode');
    };
  }, [isLandscape]);

  const handlePrint = () => {
    window.print();
  };

  const template = getApplicableParishishtTemplate(parishishtNo, documentDate, forcedVersion);
  const rendered = renderParishishtData(parishishtNo, rojmelEntries, heads, teacher, { documentDate, forcedVersion, orientation });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans space-y-6">
      {/* Inline Print Orientation & Safe 10mm Margin Style */}
      <style>{`
        @media print {
          @page {
            size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'} !important;
            margin: 10mm !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>

      {/* Top Action Bar (Hidden on Print) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between no-print">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>પાછા (Back to Rojmel)</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500">
            પ્રિન્ટ મોડ: <strong className="text-slate-900">A4 {orientation.toUpperCase()}</strong> (10mm સાઇડ માર્જિન)
          </span>
          <button
            onClick={handlePrint}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>🖨 સત્તાવાર {orientation.toUpperCase()} પ્રિન્ટ કરો</span>
          </button>
        </div>
      </div>

      {/* DEDICATED A4 PRINT CONTAINER */}
      <div className={`bg-white p-8 rounded-2xl border-2 border-slate-900 shadow-2xl space-y-6 print-container font-sans text-slate-900 ${
        isLandscape ? 'w-full max-w-none' : 'max-w-4xl mx-auto'
      }`}>
        
        {/* Header Banner - Unwanted Audit Text Completely Removed */}
        <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
          <h1 className="text-2xl font-black">{teacher.school.schoolNameGuj}</h1>
          <div className="text-xs font-semibold text-slate-700 flex flex-wrap justify-center gap-3">
            <span>UDISE Code: <strong>{teacher.school.udiseCode}</strong></span>
            <span>ગામ/શહેર: <strong>{teacher.school.village || 'સત્તાવાર'}</strong></span>
            <span>તાલુકો: <strong>{teacher.school.taluka || 'તાલુકો'}</strong></span>
            <span>જિલ્લો: <strong>{teacher.school.district || 'જિલ્લો'}</strong></span>
            <span>શૈક્ષણિક વર્ષ: <strong>{teacher.academicYear}</strong></span>
          </div>
          <div className="inline-block bg-slate-900 text-white text-xs font-extrabold px-5 py-1 rounded-md mt-2">
            {template.nameGuj.toUpperCase()} (A4 {orientation.toUpperCase()})
          </div>
        </div>

        {/* PARISHISHT-1 SPECIAL REGISTER */}
        {parishishtNo === 1 && rendered.parishisht1Data ? (
          <div className="space-y-6 font-sans text-xs">
            
            {/* Map over Multi-page Chunks */}
            {rendered.parishisht1Data.pages.map((pageChunk, pIdx) => (
              <div key={pIdx} className={`space-y-4 ${pIdx > 0 ? 'print-page-break pt-6' : ''}`}>
                
                {pIdx > 0 && (
                  <div className="text-center border-b border-slate-400 pb-2 text-xs font-bold text-slate-700 flex justify-between">
                    <span>{teacher.school.schoolNameGuj} - {template.nameGuj}</span>
                    <span>ચાલુ પત્રક (પેજ {pageChunk.pageIndex} / {pageChunk.totalPages})</span>
                  </div>
                )}

                {/* Opening Balance Summary (On Page 1) */}
                {pIdx === 0 && (
                  <div className="bg-slate-100 border border-slate-900 p-2.5 rounded-lg flex justify-between items-center font-bold text-slate-900">
                    <span>શરૂઆતની સિલક (Opening Balance):</span>
                    <div className="flex gap-4">
                      <span>રોકડ: <strong className="text-emerald-800 font-extrabold">₹{rendered.parishisht1Data?.openingCash.toLocaleString('en-IN')}</strong></span>
                      <span>બેંક: <strong className="text-purple-800 font-extrabold">₹{rendered.parishisht1Data?.openingBank.toLocaleString('en-IN')}</strong></span>
                      <span>કુલ સિલક: <strong className="text-slate-900 font-black">₹{rendered.parishisht1Data?.openingTotal.toLocaleString('en-IN')}</strong></span>
                    </div>
                  </div>
                )}

                {/* Dual JAMA & UDHAR Register: Grid 2 Columns for Landscape, 1 Column Stacked for Portrait */}
                <div className={`grid gap-4 items-start ${isLandscape ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  
                  {/* JAMA / RECEIPT TABLE */}
                  <div className="border border-slate-900 rounded-lg overflow-hidden">
                    <div className="bg-emerald-900 text-white text-center font-extrabold p-2 border-b border-slate-900">
                      જમા બાજુ (RECEIPTS / JAMA)
                    </div>
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-900 font-bold">
                          <th className="p-1.5 border-r border-slate-900">તારીખ</th>
                          <th className="p-1.5 border-r border-slate-900">રસીદ નં</th>
                          <th className="p-1.5 border-r border-slate-900">વિગત / હેડ</th>
                          <th className="p-1.5 border-r border-slate-900 text-right">રોકડ (₹)</th>
                          <th className="p-1.5 border-r border-slate-900 text-right">બેંક (₹)</th>
                          <th className="p-1.5 text-right">કુલ (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageChunk.jamaRows.map((r, idx) => (
                          <tr key={idx} className="border-b border-slate-300 font-medium">
                            <td className="p-1.5 border-r border-slate-900 font-bold whitespace-nowrap">{r.date}</td>
                            <td className="p-1.5 border-r border-slate-900 font-mono text-[10px]">{r.receiptNo}</td>
                            <td className="p-1.5 border-r border-slate-900 leading-snug">
                              <div className="font-bold text-slate-900">{r.payeeOrHead}</div>
                              <div className="text-[10px] text-slate-600">{r.particular}</div>
                            </td>
                            <td className="p-1.5 border-r border-slate-900 text-right font-bold text-emerald-800">
                              {r.cashAmount > 0 ? `₹${r.cashAmount.toLocaleString('en-IN')}` : '-'}
                            </td>
                            <td className="p-1.5 border-r border-slate-900 text-right font-bold text-purple-800">
                              {r.bankAmount > 0 ? `₹${r.bankAmount.toLocaleString('en-IN')}` : '-'}
                            </td>
                            <td className="p-1.5 text-right font-black text-slate-900">
                              ₹{r.totalAmount.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}

                        {/* Jama Total Row (On Last Page Chunk) */}
                        {pIdx === pageChunk.totalPages - 1 && (
                          <tr className="bg-slate-200 font-black border-t-2 border-slate-900">
                            <td colSpan={3} className="p-2 border-r border-slate-900 text-slate-900">
                              કુલ જમા આવક:
                            </td>
                            <td className="p-2 border-r border-slate-900 text-right text-emerald-800">
                              ₹{rendered.parishisht1Data?.jamaTotalCash.toLocaleString('en-IN')}
                            </td>
                            <td className="p-2 border-r border-slate-900 text-right text-purple-800">
                              ₹{rendered.parishisht1Data?.jamaTotalBank.toLocaleString('en-IN')}
                            </td>
                            <td className="p-2 text-right text-slate-900">
                              ₹{((rendered.parishisht1Data?.jamaTotalCash || 0) + (rendered.parishisht1Data?.jamaTotalBank || 0)).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* UDHAR / PAYMENT TABLE */}
                  <div className="border border-slate-900 rounded-lg overflow-hidden">
                    <div className="bg-rose-900 text-white text-center font-extrabold p-2 border-b border-slate-900">
                      ઉધાર/જાવક બાજુ (PAYMENTS / UDHAR)
                    </div>
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-900 font-bold">
                          <th className="p-1.5 border-r border-slate-900">તારીખ</th>
                          <th className="p-1.5 border-r border-slate-900">વાઉચર નં</th>
                          <th className="p-1.5 border-r border-slate-900">વિગત / હેડ</th>
                          <th className="p-1.5 border-r border-slate-900 text-right">રોકડ (₹)</th>
                          <th className="p-1.5 border-r border-slate-900 text-right">બેંક (₹)</th>
                          <th className="p-1.5 text-right">કુલ (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageChunk.udharRows.map((r, idx) => (
                          <tr key={idx} className="border-b border-slate-300 font-medium">
                            <td className="p-1.5 border-r border-slate-900 font-bold whitespace-nowrap">{r.date}</td>
                            <td className="p-1.5 border-r border-slate-900 font-mono text-[10px]">{r.voucherNo}</td>
                            <td className="p-1.5 border-r border-slate-900 leading-snug">
                              <div className="font-bold text-slate-900">{r.paidToOrHead}</div>
                              <div className="text-[10px] text-slate-600">{r.particular}</div>
                            </td>
                            <td className="p-1.5 border-r border-slate-900 text-right font-bold text-rose-800">
                              {r.cashAmount > 0 ? `₹${r.cashAmount.toLocaleString('en-IN')}` : '-'}
                            </td>
                            <td className="p-1.5 border-r border-slate-900 text-right font-bold text-purple-800">
                              {r.bankAmount > 0 ? `₹${r.bankAmount.toLocaleString('en-IN')}` : '-'}
                            </td>
                            <td className="p-1.5 text-right font-black text-slate-900">
                              ₹{r.totalAmount.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}

                        {/* Udhar Total Row (On Last Page Chunk) */}
                        {pIdx === pageChunk.totalPages - 1 && (
                          <tr className="bg-slate-200 font-black border-t-2 border-slate-900">
                            <td colSpan={3} className="p-2 border-r border-slate-900 text-slate-900">
                              કુલ જાવક/ખર્ચ:
                            </td>
                            <td className="p-2 border-r border-slate-900 text-right text-rose-800">
                              ₹{rendered.parishisht1Data?.udharTotalCash.toLocaleString('en-IN')}
                            </td>
                            <td className="p-2 border-r border-slate-900 text-right text-purple-800">
                              ₹{rendered.parishisht1Data?.udharTotalBank.toLocaleString('en-IN')}
                            </td>
                            <td className="p-2 text-right text-slate-900">
                              ₹{((rendered.parishisht1Data?.udharTotalCash || 0) + (rendered.parishisht1Data?.udharTotalBank || 0)).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>

              </div>
            ))}

            {/* Closing Balance Footer Box */}
            <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-900 flex justify-between items-center font-bold text-xs">
              <span>આખર સિલક બાકી (Closing Balance In Hand):</span>
              <div className="flex gap-6 font-mono">
                <span>રોકડ હાથ પર: <strong>₹{rendered.parishisht1Data.closingCash.toLocaleString('en-IN')}</strong></span>
                <span>બેંક ખાતે સિલક: <strong>₹{rendered.parishisht1Data.closingBank.toLocaleString('en-IN')}</strong></span>
                <span>કુલ આખર સિલક: <strong className="text-amber-400 font-black text-sm">₹{rendered.parishisht1Data.closingTotal.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>
          </div>
        ) : (
          /* GENERAL PARISHISHT 02..12 TABLE RENDERER */
          <div className="space-y-4 text-xs font-sans">
            <div className="bg-slate-50 border border-slate-900 rounded-xl p-3 flex justify-between font-bold text-slate-900">
              <span>કુલ આવક: ₹{rendered.summary.totalIncome.toLocaleString('en-IN')}</span>
              <span>કુલ જાવક: ₹{rendered.summary.totalExpense.toLocaleString('en-IN')}</span>
              <span>આખર સિલક: ₹{rendered.summary.closingBalance.toLocaleString('en-IN')}</span>
            </div>

            <table className="w-full text-left border border-slate-900 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-900 font-bold">
                  {parishishtNo === 2 ? (
                    <>
                      <th className="p-2 border-r border-slate-900">ગ્રાન્ટ હેડ નામ</th>
                      <th className="p-2 border-r border-slate-900 text-right">મંજૂર ગ્રાન્ટ (₹)</th>
                      <th className="p-2 border-r border-slate-900 text-right">કુલ ખર્ચ (₹)</th>
                      <th className="p-2 text-right">બાકી સિલક (₹)</th>
                    </>
                  ) : (
                    <>
                      <th className="p-2 border-r border-slate-900">તારીખ</th>
                      <th className="p-2 border-r border-slate-900">વાઉચર નં</th>
                      <th className="p-2 border-r border-slate-900">ગ્રાન્ટ હેડ</th>
                      <th className="p-2 border-r border-slate-900">વિગત</th>
                      <th className="p-2 border-r border-slate-900 text-right">આવક (₹)</th>
                      <th className="p-2 border-r border-slate-900 text-right">જાવક (₹)</th>
                      <th className="p-2 text-right">સિલક (₹)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {rendered.generalRows?.map((r, idx) => (
                  <tr key={idx} className="border-b border-slate-300 font-medium">
                    {parishishtNo === 2 ? (
                      <>
                        <td className="p-2 border-r border-slate-900 font-bold">{r.headNameGuj}</td>
                        <td className="p-2 border-r border-slate-900 text-right font-semibold">₹{r.grantLimit.toLocaleString('en-IN')}</td>
                        <td className="p-2 border-r border-slate-900 text-right font-bold text-rose-700">₹{r.totalSpent.toLocaleString('en-IN')}</td>
                        <td className="p-2 text-right font-black text-emerald-700">₹{r.remaining.toLocaleString('en-IN')}</td>
                      </>
                    ) : (
                      <>
                        <td className="p-2 border-r border-slate-900 font-bold whitespace-nowrap">{r.date}</td>
                        <td className="p-2 border-r border-slate-900 font-mono text-[11px]">{r.voucherNo}</td>
                        <td className="p-2 border-r border-slate-900 font-semibold">{r.headNameGuj}</td>
                        <td className="p-2 border-r border-slate-900">{r.particularGuj}</td>
                        <td className="p-2 border-r border-slate-900 text-right font-bold text-emerald-700">
                          {r.income > 0 ? `₹${r.income.toLocaleString('en-IN')}` : '-'}
                        </td>
                        <td className="p-2 border-r border-slate-900 text-right font-bold text-rose-700">
                          {r.expense > 0 ? `₹${r.expense.toLocaleString('en-IN')}` : '-'}
                        </td>
                        <td className="p-2 text-right font-black text-slate-900">
                          ₹{r.balance.toLocaleString('en-IN')}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Official Signatures Grid */}
        <div className="border-t-2 border-slate-900 pt-8 mt-12 flex justify-between text-xs font-bold text-slate-900">
          <div className="text-center space-y-6">
            <div>તૈયાર કરનાર શિક્ષક સહી</div>
            <div className="border-b border-slate-400 w-36"></div>
          </div>

          <div className="text-center space-y-6">
            <div>ઓડિટ તપાસનાર શિક્ષક સહી</div>
            <div className="border-b border-slate-400 w-36"></div>
          </div>

          <div className="text-center space-y-6">
            <div>મુખ્ય શિક્ષક / આચાર્ય સહી & સિક્કો</div>
            <div className="border-b border-slate-400 w-44"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
