import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';

interface Props {
  titleGuj: string;
  titleEng: string;
  descriptionGuj: string;
  icon: React.ElementType;
}

export const GenericModulePlaceholder: React.FC<Props> = ({ titleGuj, titleEng, descriptionGuj, icon: Icon }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto font-sans text-center space-y-6 my-12">
      <div className="w-20 h-20 bg-brand-50 text-brand-600 rounded-3xl mx-auto flex items-center justify-center border border-brand-200 shadow-md">
        <Icon className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          મોડ્યુલ આર્કિટેક્ચર રેડી
        </span>
        <h2 className="text-2xl font-bold text-slate-800">{titleGuj}</h2>
        <div className="text-xs text-slate-400 font-semibold">{titleEng}</div>
        <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          {descriptionGuj}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto text-left text-xs space-y-2">
        <div className="font-bold text-slate-800 flex items-center gap-1.5">
          <Construction className="w-4 h-4 text-amber-500" />
          <span>આવનારા ફેઝમાં ઉમેરાશે:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-600">
          <li>મોડ્યુલર ટેમ્પ્લેટ સિસ્ટમ કનેક્ટર</li>
          <li>ગુજરાતી ઓટો ટાઇપિંગ અને પીડીએફ એક્સપોર્ટ</li>
          <li>શિક્ષક પ્રોફાઇલ સાથે ઓટો ઓનબોર્ડિંગ</li>
        </ul>
      </div>
    </div>
  );
};
