import React, { useState } from 'react';
import { FolderArchive, Search, Star, Trash2, Copy, Printer, Eye, Filter, CheckCircle2, Clock } from 'lucide-react';
import { SavedDocumentItem, DocumentCategory, DocumentStatus } from '@/types/documentLibrary';

interface Props {
  documents: SavedDocumentItem[];
  onToggleFavorite: (id: string) => Promise<void>;
  onDeleteDocument: (id: string) => Promise<void>;
  onDuplicateDocument: (id: string) => Promise<void>;
}

export const MyDocsModule: React.FC<Props> = ({
  documents,
  onToggleFavorite,
  onDeleteDocument,
  onDuplicateDocument
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'draft' | 'completed' | 'favorites'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Patrak', 'Aheval', 'Rojmel', 'Voucher', 'Paper'];

  const filtered = documents.filter(doc => {
    const matchesSearch = doc.titleGuj.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || doc.category === categoryFilter;

    let matchesTab = true;
    if (activeTab === 'draft') matchesTab = doc.status === 'draft';
    if (activeTab === 'completed') matchesTab = doc.status === 'completed';
    if (activeTab === 'favorites') matchesTab = !!doc.isFavorite;

    return matchesSearch && matchesCategory && matchesTab;
  });

  const handlePrint = (doc: SavedDocumentItem) => {
    window.print();
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans space-y-6">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 mb-2">
            <FolderArchive className="w-3.5 h-3.5" />
            <span>તમારા તમામ સત્તાવાર દસ્તાવેજોની લાઇબ્રેરી</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">મારા દસ્તાવેજો (My Document Library)</h2>
          <p className="text-xs text-slate-500 mt-1">
            સેવ થયેલ પત્રકો, અહેવાલ, રોજમેળ નોંધ અને વાઉચર એક જ જગ્યાએ જુઓ, ડુપ્લિકેટ કરો કે પ્રિન્ટ કરો.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('All')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'All' ? 'bg-brand-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              બધા દસ્તાવેજો (All)
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'completed' ? 'bg-brand-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              સંપૂર્ણ સાચવેલ (Completed)
            </button>
            <button
              onClick={() => setActiveTab('draft')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'draft' ? 'bg-brand-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ડ્રાફ્ટ ફાઇલો (Drafts)
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1 ${
                activeTab === 'favorites' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>મનપસંદ (Favorites)</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="ફાઇલ નામથી શોધો..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg transition-all border ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {cat === 'All' ? 'તમામ કેટેગરી' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3 text-slate-400">
          <FolderArchive className="w-12 h-12 mx-auto text-slate-300" />
          <div className="font-bold text-slate-700 text-sm">કોઈ દસ્તાવેજ મળ્યો નથી.</div>
          <div className="text-xs">તમે પત્રક, અહેવાલ કે વાઉચર સેવ કરશો એટલે અહીં દર્શાવાશે.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(doc => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black bg-brand-600 text-white px-2.5 py-0.5 rounded">
                    {doc.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      doc.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {doc.status === 'completed' ? 'Completed' : 'Draft'}
                    </span>
                    <button
                      onClick={() => onToggleFavorite(doc.id)}
                      className="p-1 text-slate-400 hover:text-amber-500"
                    >
                      <Star className={`w-4 h-4 ${doc.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{doc.titleGuj}</h3>
                  {doc.subtitleGuj && (
                    <div className="text-xs text-slate-500 font-medium mt-1">{doc.subtitleGuj}</div>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>સાચવ્યા સમય: {new Date(doc.createdAt).toLocaleDateString('gu-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-1 text-xs">
                <button
                  onClick={() => onDuplicateDocument(doc.id)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg flex items-center gap-1"
                  title="ડુપ્લિકેટ કરો"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>કોપી</span>
                </button>

                <button
                  onClick={() => handlePrint(doc)}
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg flex items-center gap-1"
                  title="પ્રિન્ટ કરો"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>પ્રિન્ટ</span>
                </button>

                <button
                  onClick={() => onDeleteDocument(doc.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                  title="ડિલીટ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
