import React, { useState } from 'react';
import { PatrakTemplate, PatrakDocument } from '@/types/patrak';
import { TeacherProfile } from '@/types/user';
import { PatrakBrowser } from './PatrakBrowser';
import { PatrakAutoFillWizard } from './PatrakAutoFillWizard';
import { patrakRepo } from '@/lib/repositories/LocalStorageRepository';
import { Sparkles, FileSpreadsheet } from 'lucide-react';

interface Props {
  templates: PatrakTemplate[];
  teacher: TeacherProfile;
  onSaveDocument: (doc: Omit<PatrakDocument, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isMobile?: boolean;
}

export const PatrakModule: React.FC<Props> = ({ 
  templates: initialTemplates, 
  teacher, 
  onSaveDocument, 
  isMobile = false 
}) => {
  const [templates, setTemplates] = useState<PatrakTemplate[]>(initialTemplates);
  const [activeTemplate, setActiveTemplate] = useState<PatrakTemplate | null>(null);
  const [showAutoFillWizard, setShowAutoFillWizard] = useState(false);

  const handleToggleFavorite = async (id: string) => {
    await patrakRepo.toggleFavorite(id);
    const updated = await patrakRepo.getTemplates();
    setTemplates(updated);
  };

  const handleSelectTemplate = (template: PatrakTemplate) => {
    setActiveTemplate(template);
    setShowAutoFillWizard(true);
  };

  if (showAutoFillWizard) {
    return (
      <PatrakAutoFillWizard
        templates={templates}
        teacher={teacher}
        initialTemplate={activeTemplate}
        onBackToCatalog={() => {
          setShowAutoFillWizard(false);
          setActiveTemplate(null);
        }}
        onSaveDocument={onSaveDocument}
        isMobile={isMobile}
      />
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>૭૩ પત્રક ઓટો-ટેમ્પ્લેટ અને ૫-સ્ટેપ ઓટો-ફિલ ઇજનેર</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">ગુણોત્સવ ૨.૦ અને સત્તાવાર પત્રક સિસ્ટમ</h2>
          <p className="text-xs text-slate-500 mt-1">
            તમામ ૭૩ પત્રકોમાંથી પસંદગી કરો, પસંદ કરેલ વર્ઝન (A / B / C) સાથે ૫-સ્ટેપ ઓટો-ફિલ વર્કફ્લો દ્વારા પત્રક તૈયાર કરો.
          </p>
        </div>

        <button
          onClick={() => setShowAutoFillWizard(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>૫-સ્ટેપ ઓટો-ફિલ વિઝાર્ડ શરૂ કરો</span>
        </button>
      </div>

      {/* Catalog Browser */}
      <PatrakBrowser
        templates={templates}
        onSelectTemplate={handleSelectTemplate}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
};
