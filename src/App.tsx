import React, { useState, useEffect } from 'react';
import { ResponsiveShell } from './components/layout/ResponsiveShell';
import { TeacherProfile } from './types/user';
import { PatrakTemplate, PatrakDocument } from './types/patrak';
import { RojmelEntry, DeadStockItem } from './types/rojmel';
import { Voucher } from './types/voucher';
import { PaperTemplate } from './types/paperGenerator';
import { SavedDocumentItem } from './types/documentLibrary';
import {
  teacherRepo,
  patrakRepo,
  rojmelRepo,
  voucherRepo,
  docLibRepo,
  paperGenRepo
} from './lib/repositories/LocalStorageRepository';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AppErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ShalaSarathi Runtime Error Caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md">
            <h2 className="text-xl font-bold text-white">સિસ્ટમ એરર અટકાવી (Runtime Protected)</h2>
            <p className="text-xs text-slate-300">
              એપ્લિકેશનમાં ક્ષણિક ભૂલ આવી છે. કૃપા કરીને નીચે બટન દબાવી રીફ્રેશ કરો.
            </p>
            {this.state.error && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-rose-300 text-left overflow-x-auto max-h-32 mt-2">
                {this.state.error.message}
              </div>
            )}
          </div>
          <button
            onClick={this.handleReset}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>એપ્લિકેશન રીફ્રેશ કરો</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [templates, setTemplates] = useState<PatrakTemplate[]>([]);
  const [rojmelEntries, setRojmelEntries] = useState<RojmelEntry[]>([]);
  const [deadStockItems, setDeadStockItems] = useState<DeadStockItem[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [paperTemplates, setPaperTemplates] = useState<PaperTemplate[]>([]);
  const [savedDocuments, setSavedDocuments] = useState<SavedDocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prof, tmpl, roj, stock, vch, paper, docs] = await Promise.all([
          teacherRepo.getProfile(),
          patrakRepo.getTemplates(),
          rojmelRepo.getEntries(),
          rojmelRepo.getDeadStockItems(),
          voucherRepo.getVouchers(),
          paperGenRepo.getPaperTemplates(),
          docLibRepo.getAllDocuments()
        ]);

        setTeacher(prof);
        setTemplates(tmpl || []);
        setRojmelEntries(roj || []);
        setDeadStockItems(stock || []);
        setVouchers(vch || []);
        setPaperTemplates(paper || []);
        setSavedDocuments(docs || []);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveProfile = async (updated: TeacherProfile) => {
    const saved = await teacherRepo.updateProfile(updated);
    setTeacher(saved);
  };

  const handleSavePatrakDoc = async (doc: Omit<PatrakDocument, 'id' | 'createdAt' | 'updatedAt'>) => {
    await patrakRepo.saveDocument(doc);
    const updatedDocs = await docLibRepo.getAllDocuments();
    setSavedDocuments(updatedDocs);
  };

  const handleAddRojmelEntry = async (
    entry: Omit<RojmelEntry, 'id' | 'balanceAfter' | 'createdAt'>,
    linkDeadStock: boolean
  ) => {
    const result = await rojmelRepo.addEntry(entry, linkDeadStock);
    const updatedEntries = await rojmelRepo.getEntries();
    setRojmelEntries(updatedEntries);

    if (result.deadStock) {
      const updatedStock = await rojmelRepo.getDeadStockItems();
      setDeadStockItems(updatedStock);
    }
  };

  const handleCreateVoucher = async (vData: Omit<Voucher, 'id' | 'createdAt'>) => {
    await voucherRepo.createVoucher(vData);
    const updatedVouchers = await voucherRepo.getVouchers();
    setVouchers(updatedVouchers);

    const updatedDocs = await docLibRepo.getAllDocuments();
    setSavedDocuments(updatedDocs);
  };

  const handleToggleLibFavorite = async (id: string) => {
    await docLibRepo.toggleFavorite(id);
    const updatedDocs = await docLibRepo.getAllDocuments();
    setSavedDocuments(updatedDocs);
  };

  const handleDeleteLibDoc = async (id: string) => {
    await docLibRepo.deleteDocument(id);
    const updatedDocs = await docLibRepo.getAllDocuments();
    setSavedDocuments(updatedDocs);
  };

  const handleDuplicateLibDoc = async (id: string) => {
    await docLibRepo.duplicateDocument(id);
    const updatedDocs = await docLibRepo.getAllDocuments();
    setSavedDocuments(updatedDocs);
  };

  if (isLoading || !teacher) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center font-sans space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500 to-gujarat-saffron flex items-center justify-center font-black text-2xl animate-pulse shadow-xl">
          શા
        </div>
        <div className="text-lg font-bold">શાળા સારથિ v2 લોડ થઇ રહ્યું છે...</div>
        <div className="text-xs text-slate-400">ગુજરાત પ્રાથમિક શિક્ષક પોર્ટલ v2.0</div>
      </div>
    );
  }

  return (
    <AppErrorBoundary>
      <ResponsiveShell
        teacher={teacher}
        templates={templates}
        rojmelEntries={rojmelEntries}
        deadStockItems={deadStockItems}
        vouchers={vouchers}
        paperTemplates={paperTemplates}
        savedDocuments={savedDocuments}
        onSaveProfile={handleSaveProfile}
        onSavePatrakDoc={handleSavePatrakDoc}
        onAddRojmelEntry={handleAddRojmelEntry}
        onCreateVoucher={handleCreateVoucher}
        onToggleLibFavorite={handleToggleLibFavorite}
        onDeleteLibDoc={handleDeleteLibDoc}
        onDuplicateLibDoc={handleDuplicateLibDoc}
      />
    </AppErrorBoundary>
  );
}
