import React from 'react';
import { AhevalPatrakTemplate, TemplateField } from '@/types/ahevalPatrak';
import { TeacherProfile } from '@/types/user';
import { ShieldCheck, Info } from 'lucide-react';

interface Props {
  template: AhevalPatrakTemplate;
  fieldValues: Record<string, any>;
  onChangeFieldValue?: (fieldId: string, value: any) => void;
  isReadOnly?: boolean;
  teacher: TeacherProfile;
}

export const TemplateRenderer: React.FC<Props> = ({
  template,
  fieldValues,
  onChangeFieldValue,
  isReadOnly = false,
  teacher
}) => {
  const isWorkingRef = template.sourceType === 'working-reference';
  const isLandscape = template.orientation === 'landscape';

  const renderFieldInput = (f: TemplateField) => {
    const val = fieldValues[f.id] !== undefined ? fieldValues[f.id] : (f.defaultValue || '');
    const canEdit = !isReadOnly && f.editableByTeacher;

    if (!canEdit) {
      return (
        <div className="font-bold text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs min-h-[34px] flex items-center">
          {f.type === 'currency' ? `₹${Number(val || 0).toLocaleString('en-IN')}` : (String(val) || '-')}
        </div>
      );
    }

    switch (f.type) {
      case 'multiline':
        return (
          <textarea
            value={val}
            onChange={e => onChangeFieldValue && onChangeFieldValue(f.id, e.target.value)}
            placeholder={f.placeholder || 'અહીં વિગત લખો...'}
            rows={3}
            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        );

      case 'number':
      case 'currency':
        return (
          <input
            type="number"
            value={val}
            onChange={e => onChangeFieldValue && onChangeFieldValue(f.id, Number(e.target.value))}
            placeholder={f.placeholder || '0'}
            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={val}
            onChange={e => onChangeFieldValue && onChangeFieldValue(f.id, e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        );

      case 'dropdown':
        return (
          <select
            value={val}
            onChange={e => onChangeFieldValue && onChangeFieldValue(f.id, e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            <option value="">-- પસંદ કરો --</option>
            {f.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'yes_no':
        return (
          <div className="flex gap-4 font-bold text-xs pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name={`radio_${f.id}`}
                checked={val === 'હા'}
                onChange={() => onChangeFieldValue && onChangeFieldValue(f.id, 'હા')}
                className="text-brand-600 focus:ring-brand-500"
              />
              <span>હા</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name={`radio_${f.id}`}
                checked={val === 'ના'}
                onChange={() => onChangeFieldValue && onChangeFieldValue(f.id, 'ના')}
                className="text-brand-600 focus:ring-brand-500"
              />
              <span>ના</span>
            </label>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={val}
            onChange={e => onChangeFieldValue && onChangeFieldValue(f.id, e.target.value)}
            placeholder={f.placeholder || ''}
            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        );
    }
  };

  return (
    <div
      className={`bg-white text-slate-900 font-sans p-6 rounded-2xl shadow-xl border border-slate-900 space-y-5 mx-auto ${
        isLandscape ? 'max-w-5xl' : 'max-w-3xl'
      }`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Official / Reference Document Header */}
      <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
        <h2 className="text-xl font-black text-slate-900 tracking-wide">
          {teacher?.school?.schoolNameGuj || 'સત્તાવાર પ્રાથમિક શાળા'}
        </h2>
        <div className="text-xs font-bold text-slate-700 flex justify-center gap-4 flex-wrap">
          <span>UDISE કોડ: <strong>{teacher?.school?.udiseCode || '-'}</strong></span>
          <span>ગામ: <strong>{teacher?.school?.village || 'સત્તાવાર'}</strong></span>
          <span>તાલુકો: <strong>{teacher?.school?.taluka || 'તાલુકો'}</strong></span>
          <span>શૈક્ષણિક વર્ષ: <strong>{teacher?.academicYear || '2026-27'}</strong></span>
        </div>
        <div className="inline-block bg-slate-900 text-white font-extrabold text-xs px-4 py-1 rounded-md mt-2">
          {template.titleGuj} (v{template.version}.0)
        </div>
      </div>

      {/* Working Reference Disclaimer Banner */}
      {isWorkingRef ? (
        <div className="bg-amber-50 border border-amber-300 text-amber-950 p-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>⚠️ સંદર્ભ આધારિત કાર્યકારી નમૂનો (Reference / Working Format — Not an official approval claim)</span>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-2 rounded-xl text-[11px] font-bold text-center flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>સત્તાવાર સંદર્ભ ચકાસાયેલ દસ્તાવેજ (Reference Verified Template)</span>
        </div>
      )}

      {/* Dynamic Sections & Fields */}
      <div className="space-y-6">
        {template.sections.sort((a, b) => a.order - b.order).map(sec => (
          <div key={sec.id} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/40">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-300 pb-1.5 text-brand-900">
              {sec.titleGuj}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sec.fields.sort((a, b) => a.order - b.order).map(f => (
                <div key={f.id} className={`space-y-1 ${f.type === 'multiline' || f.type === 'table' ? 'md:col-span-2' : ''}`}>
                  <label className="block text-xs font-bold text-slate-700">
                    {f.labelGuj}
                    {f.required && <span className="text-rose-600 font-bold ml-0.5">*</span>}
                  </label>
                  {renderFieldInput(f)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Signature Section */}
      <div className="pt-8 border-t border-slate-900 flex justify-between text-xs font-bold text-slate-900">
        <div className="text-center space-y-8">
          <div>તૈયાર કરનાર શિક્ષક સહી</div>
          <div className="border-b border-slate-900 w-36 mx-auto"></div>
        </div>

        <div className="text-center space-y-8">
          <div>ચકાસનાર સભ્ય സહી</div>
          <div className="border-b border-slate-900 w-36 mx-auto"></div>
        </div>

        <div className="text-center space-y-8">
          <div>મુખ્ય શિક્ષક / આચાર્ય સહી અને સિક્કો</div>
          <div className="border-b border-slate-900 w-44 mx-auto"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-slate-600 border-t border-slate-200 pt-2 font-medium">
        શાળા સારથિ v2.0 — સત્તાવાર અહેવાલ / પત્રક જનરેશન સિસ્ટમ
      </div>
    </div>
  );
};
