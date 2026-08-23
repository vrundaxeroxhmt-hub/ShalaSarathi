import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bookmark, 
  Download, 
  Trash2, 
  Eye, 
  FileText, 
  FileSpreadsheet, 
  Receipt, 
  Sparkles,
  ArrowRight,
  FolderHeart
} from 'lucide-react';

export const MyWorkView: React.FC = () => {
  const { 
    communityPosts, 
    toggleSavePost, 
    incrementDownload, 
    setActiveTab, 
    setActiveSubFeature, 
    rojmelTransactions, 
    purchases 
  } = useApp();

  const savedPosts = communityPosts.filter(p => p.isSaved);
  const [activeSubTab, setActiveSubTab] = useState<'saved' | 'recent_vouchers' | 'quick_tools'>('saved');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <FolderHeart className="w-6 h-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              મારું કાર્ય અને સાચવેલ સાધનો (My Work & Saved Library)
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            તમે કમ્યુનિટીમાંથી સાચવેલા પ્રશ્નપત્રો, પરિપત્રો, પત્રક ડ્રાફ્ટ અને તમારા તાજેતરના શાળા વાઉચર્સ એક જ જગ્યાએ.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 text-xs">
        <button
          type="button"
          onClick={() => setActiveSubTab('saved')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'saved'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>સાચવેલ કમ્યુનિટી મટીરીયલ ({savedPosts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('recent_vouchers')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'recent_vouchers'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>મારા તાજેતરના વાઉચર્સ ({purchases.length})</span>
        </button>
      </div>

      {/* Content */}
      {activeSubTab === 'saved' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedPosts.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">કોઈ મટીરીયલ સાચવેલું નથી</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                કમ્યુનિટી ફીડમાંથી તમને ઉપયોગી લાગતા પ્રશ્નપત્રો અને પત્રકો Bookmark આઇકોન પર ક્લિક કરીને અહીં સાચવી શકો છો.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('community');
                  setActiveSubFeature('community-feed');
                }}
                className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-amber-700"
              >
                <span>કમ્યુનિટીમાં જાઓ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            savedPosts.map((post) => (
              <div 
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {post.standard} • {post.subject}
                    </span>
                    <span className="text-[11px] text-slate-400">{post.createdAt}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                    {post.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center space-x-2 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">શિક્ષક: {post.creatorName}</span>
                    <span>({post.creatorDistrict})</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => toggleSavePost(post.id)}
                    className="text-red-500 hover:text-red-700 font-medium flex items-center space-x-1"
                    title="સંગ્રહમાંથી દૂર કરો"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>દૂર કરો</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => incrementDownload(post.id)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>વાપરો / પ્રિન્ટ</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeSubTab === 'recent_vouchers' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 mb-3">તાજેતરના ખરીદી અને રોજમેળ વાઉચર્સ</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 font-bold text-slate-800 border-b border-slate-300">
                <tr>
                  <th className="p-2.5 border-r border-slate-300">તારીખ</th>
                  <th className="p-2.5 border-r border-slate-300">વસ્તુ / સામગ્રી</th>
                  <th className="p-2.5 border-r border-slate-300">ગ્રાન્ટ હેડ</th>
                  <th className="p-2.5 border-r border-slate-300">વેપારી</th>
                  <th className="p-2.5 text-right bg-amber-50">કુલ રકમ (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {purchases.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-2.5 border-r border-slate-200 font-mono">{p.date}</td>
                    <td className="p-2.5 border-r border-slate-200 font-bold text-slate-900">{p.itemName}</td>
                    <td className="p-2.5 border-r border-slate-200 text-slate-700">{p.grantHead}</td>
                    <td className="p-2.5 border-r border-slate-200 text-slate-600">{p.vendorName}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-amber-900 bg-amber-50/40">
                      ₹{p.total.toLocaleString('gu-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
