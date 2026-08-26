import React, { useState } from 'react';
import { FileText, Mic, MicOff, Save, Printer, Sparkles, Plus, Image as ImageIcon, CheckCircle2, ShieldCheck } from 'lucide-react';
import { TeacherProfile } from '@/types/user';
import { useGujaratiVoice } from '@/hooks/useGujaratiVoice';

interface Props {
  teacher: TeacherProfile;
}

export const AhevalModule: React.FC<Props> = ({ teacher }) => {
  const [titleGuj, setTitleGuj] = useState('૧૫મી ઓગસ્ટ સ્વતંત્રતા દિવસ ઉજવણી અહેવાલ');
  const [eventDate, setEventDate] = useState('2026-08-15');
  const [masterContent, setMasterContent] = useState(
    'અમારી અંબાજી પ્રાથમિક શાળા નંબર ૧ માં ૧૫મી ઓગસ્ટ ના રોજ ૭૯ મા સ્વતંત્રતા દિવસની ભવ્ય ઉજવણી કરવામાં આવી હતી. શાળાના તમામ બાળકો અને ગ્રામજનો ઉત્સાહપૂર્વક હાજર રહ્યા હતા.'
  );
  const [customText, setCustomText] = useState(
    'ધ્વજવંદન આચાર્યશ્રી વિજયભાઈ પટેલના હસ્તે કરવામાં આવ્યું હતું. સાંસ્કૃતિક કાર્યક્રમમાં બાળકો દ્વારા દેશભક્તિ ગીત અને નાટક રજૂ કરાયા હતા.'
  );
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&auto=format&fit=crop&q=80'
  ]);
  const [isSaved, setIsSaved] = useState(false);

  // Gujarati Voice Input Hook
  const { isListening, transcript, isSupported, error, startListening, stopListening } = useGujaratiVoice((text) => {
    setCustomText(prev => prev + ' ' + text);
  });

  const handleAddPhoto = () => {
    setPhotos([...photos, 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&auto=format&fit=crop&q=80']);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto font-sans space-y-6">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 mb-2">
            <Mic className="w-3.5 h-3.5" />
            <span>ગુજરાતી વોઇસ સપોર્ટેડ અહેવાલ ટાઇપિંગ</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">શાળા અહેવાલ લેખન (Aheval Generator)</h2>
          <p className="text-xs text-slate-500 mt-1">
            માસ્ટર ટેમ્પ્લેટ સામગ્રી સાથે તમારા કસ્ટમ વોઇસ ઇનપુટ ઉમેરી ૧-ક્લિકમાં રેડી અહેવાલ બનાવો.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>પીડીએફ / પ્રિન્ટ</span>
          </button>
        </div>
      </div>

      {/* Version Safety Guarantee Box */}
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3 text-emerald-900 text-xs font-semibold">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <div>
          <span className="font-bold">વર્ઝન સેફ્ટી ગેરંટી (Version Safe):</span> એડમિન દ્વારા માસ્ટર ટેમ્પ્લેટ અપડેટ થાય તો પણ તમારા પર્સનલ કસ્ટમાઇઝ્ડ અહેવાલ ક્યારેય ઓવરરાઇટ નહી થાય!
        </div>
      </div>

      {/* Editor & Voice Controller Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">અહેવાલનું શીર્ષક (Title)</label>
            <input
              type="text"
              value={titleGuj}
              onChange={e => setTitleGuj(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 text-sm"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">કાર્યક્રમ તારીખ (Date)</label>
            <input
              type="date"
              value={eventDate}
              onChange={e => setEventDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
            />
          </div>
        </div>

        {/* Master Admin Content Section */}
        <div>
          <label className="block font-bold text-slate-700 mb-1 text-xs">માસ્ટર એડમિન સામગ્રી (Master Standard Description)</label>
          <textarea
            rows={3}
            value={masterContent}
            onChange={e => setMasterContent(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
          />
        </div>

        {/* Voice Powered Custom Content Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block font-bold text-slate-700 text-xs">
              શિક્ષકની પોતાની નોંધ (તમારી કસ્ટમ વિગત - વોઇસ અથવા ટાઇપ કરો)
            </label>

            {/* Voice Toggle Button */}
            {isListening ? (
              <button
                type="button"
                onClick={stopListening}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5 animate-pulse"
              >
                <MicOff className="w-4 h-4" />
                <span>રેકોર્ડિંગ બંધ કરો (માઇક ચાલુ છે...)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={startListening}
                className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5 transition-all"
              >
                <Mic className="w-4 h-4" />
                <span>🎤 ગુજરાતી બોલીને ટાઇપ કરો</span>
              </button>
            )}
          </div>

          {error && (
            <div className="text-[11px] text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-200">
              ⚠️ {error}
            </div>
          )}

          <textarea
            rows={4}
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            placeholder="અહીં ગુજરાતી બોલો અથવા કીબોર્ડથી ટાઇપ કરો..."
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Photos */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <ImageIcon className="w-4 h-4 text-brand-600" />
              <span>અહેવાલ ફોટોગ્રાફ્સ</span>
            </span>
            <button
              onClick={handleAddPhoto}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1 rounded-lg border border-slate-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ ઉમેરો</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {photos.map((p, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video">
                <img src={p} alt="Aheval photo" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Printable Output View */}
      <div className="bg-white p-8 rounded-2xl border border-slate-300 shadow-lg space-y-6 print-container">
        <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
          <div className="text-xs font-bold text-slate-600">{teacher.school.schoolNameGuj} - {teacher.school.village}</div>
          <h1 className="text-xl font-black text-slate-900">{titleGuj}</h1>
          <div className="text-xs text-slate-500 font-semibold">તારીખ: {eventDate}</div>
        </div>

        <div className="space-y-4 text-sm text-slate-800 leading-relaxed font-sans">
          <p className="font-medium text-justify indent-8">{masterContent}</p>
          <p className="font-medium text-justify indent-8">{customText}</p>
        </div>

        {photos.length > 0 && (
          <div className="grid grid-cols-2 gap-4 pt-4">
            {photos.map((p, idx) => (
              <div key={idx} className="border border-slate-300 p-1 rounded-lg">
                <img src={p} alt="Print photo" className="w-full h-40 object-cover rounded" />
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-slate-300 pt-8 mt-12 flex justify-between text-xs font-bold">
          <div>તૈયાર કરનાર: {teacher.nameGuj}</div>
          <div>આચાર્યશ્રી સહી અને સિક્કો</div>
        </div>
      </div>
    </div>
  );
};
