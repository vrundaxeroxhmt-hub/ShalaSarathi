import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CommunityPostType } from '../../types';
import { STANDARDS_LIST, SUBJECTS_LIST, GUJARAT_DISTRICTS } from '../../data/initialData';
import { 
  Upload, 
  X, 
  Sparkles, 
  FileText, 
  CheckCircle, 
  BarChart2, 
  Smile, 
  Image as ImageIcon,
  Plus,
  Trash2,
  Check
} from 'lucide-react';

interface CreatePostModalProps {
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose }) => {
  const { teacherProfile, schoolProfile, teacherGroups, addCommunityPost } = useApp();

  const [postMode, setPostMode] = useState<'resource' | 'statusCard' | 'poll'>('resource');
  const [formData, setFormData] = useState({
    type: 'worksheet' as CommunityPostType,
    title: '',
    description: '',
    standard: 'ધોરણ ૬',
    subject: 'ગણિત',
    medium: 'ગુજરાતી',
    tags: '',
    fileSnippet: '',
    resourceContent: '',
    mediaUrl: '',
    groupId: '',
    bgGradient: 'from-purple-600 via-pink-600 to-rose-500'
  });

  // Poll state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>([
    'પ્રત્યક્ષ TLM / મોડેલ્સ દ્વારા',
    'સ્માર્ટબોર્ડ અને વિડિયોઝ દ્વારા',
    'દૈનિક જીવનના વ્યવહારિક પ્રશ્નો'
  ]);

  const gradients = [
    { label: 'Sunset Glow', class: 'from-purple-600 via-pink-600 to-rose-500' },
    { label: 'Royal Indigo', class: 'from-blue-600 via-indigo-600 to-purple-700' },
    { label: 'Emerald Forest', class: 'from-emerald-600 via-teal-600 to-cyan-600' },
    { label: 'Amber Flame', class: 'from-amber-600 via-orange-500 to-red-600' },
    { label: 'Deep Twilight', class: 'from-slate-900 via-purple-950 to-slate-900' }
  ];

  const postTypes: { id: CommunityPostType; label: string }[] = [
    { id: 'worksheet', label: 'વર્કશીટ (Worksheet)' },
    { id: 'questionPaper', label: 'પ્રશ્નપત્ર (Question Paper)' },
    { id: 'patrak', label: 'પત્રક / ફોર્મેટ (Patrak)' },
    { id: 'lessonPlan', label: 'લેસન પ્લાન / શિક્ષક ડાયરી' },
    { id: 'paripatra', label: 'પરિપત્ર / સરકારી ઠરાવ' },
    { id: 'activity', label: 'શૈક્ષણિક પ્રવૃત્તિ (TLM)' },
    { id: 'letter', label: 'શાળા લેટર / અરજી નમૂનો' },
    { id: 'resource', label: 'અન્ય ઉપયોગી સાધન' }
  ];

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, `વિકલ્પ ${pollOptions.length + 1}`]);
    }
  };

  const handleRemovePollOption = (idx: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== idx));
    }
  };

  const handleUpdatePollOption = (idx: number, val: string) => {
    const updated = [...pollOptions];
    updated[idx] = val;
    setPollOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() && postMode !== 'poll') return;
    if (postMode === 'poll' && !pollQuestion.trim()) return;

    const tagsArray = formData.tags
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [formData.subject, formData.standard];

    const selectedGroup = teacherGroups.find(g => g.id === formData.groupId);

    if (postMode === 'statusCard') {
      addCommunityPost({
        creatorName: teacherProfile.name || 'શિક્ષક મિત્ર',
        creatorRole: teacherProfile.role || 'પ્રાથમિક શિક્ષક',
        creatorSchool: schoolProfile.schoolName || 'શ્રી પ્રાથમિક શાળા',
        creatorDistrict: teacherProfile.district || 'ગાંધીનગર',
        creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        creatorBadge: 'સક્રિય શિક્ષક',
        type: 'statusCard',
        title: formData.title,
        description: formData.description,
        standard: formData.standard,
        subject: formData.subject,
        medium: formData.medium,
        tags: tagsArray,
        bgGradient: formData.bgGradient,
        mediaType: 'textCard',
        groupId: formData.groupId,
        groupName: selectedGroup?.gujaratiName
      });
    } else if (postMode === 'poll') {
      addCommunityPost({
        creatorName: teacherProfile.name || 'શિક્ષક મિત્ર',
        creatorRole: teacherProfile.role || 'પ્રાથમિક શિક્ષક',
        creatorSchool: schoolProfile.schoolName || 'શ્રી પ્રાથમિક શાળા',
        creatorDistrict: teacherProfile.district || 'ગાંધીનગર',
        creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        creatorBadge: 'શિક્ષક સંશોધન પોલ',
        type: 'poll',
        title: `📊 પોલ: ${pollQuestion}`,
        description: formData.description || 'સાથી શિક્ષકો, આપનો કિંમતી મત નોંધાવો:',
        standard: formData.standard,
        subject: formData.subject,
        medium: formData.medium,
        tags: [...tagsArray, 'શિક્ષક પોલ'],
        pollData: {
          question: pollQuestion,
          options: pollOptions.map((opt, i) => ({ id: `opt-${i + 1}`, text: opt, votes: 0 })),
          totalVotes: 0
        },
        groupId: formData.groupId,
        groupName: selectedGroup?.gujaratiName
      });
    } else {
      addCommunityPost({
        creatorName: teacherProfile.name || 'શિક્ષક મિત્ર',
        creatorRole: teacherProfile.role || 'પ્રાથમિક શિક્ષક',
        creatorSchool: schoolProfile.schoolName || 'શ્રી પ્રાથમિક શાળા',
        creatorDistrict: teacherProfile.district || 'ગાંધીનગર',
        creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        type: formData.type,
        title: formData.title,
        description: formData.description,
        standard: formData.standard,
        subject: formData.subject,
        medium: formData.medium,
        tags: tagsArray,
        fileSnippet: formData.fileSnippet || `${formData.title.replace(/\s+/g, '_')}.pdf`,
        resourceContent: formData.resourceContent,
        mediaUrl: formData.mediaUrl,
        mediaType: formData.mediaUrl ? 'image' : 'pdf',
        groupId: formData.groupId,
        groupName: selectedGroup?.gujaratiName
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">કમ્યુનિટીમાં નવી પોસ્ટ બનાવો</h3>
              <p className="text-xs text-slate-500">
                મટીરીયલ, પ્રેરણાદાયી વિચારો કે પોલ ગુજરાતના ૧,૫૦,૦૦૦+ શિક્ષકો સાથે શેર કરો.
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Format Selector Tabs (Facebook Style) */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button
            type="button"
            onClick={() => setPostMode('resource')}
            className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              postMode === 'resource'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>શૈક્ષણિક મટીરીયલ / PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setPostMode('statusCard')}
            className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              postMode === 'statusCard'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>સ્ટેટસ / વિચાર કાર્ડ</span>
          </button>

          <button
            type="button"
            onClick={() => setPostMode('poll')}
            className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              postMode === 'poll'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>શિક્ષક પોલ / સર્વે</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          
          {/* Group Target Selection */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">શિક્ષક ગ્રૂપમાં શેર કરવું છે? (વૈકલ્પિક)</label>
            <select
              value={formData.groupId}
              onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 font-medium"
            >
              <option value="">સાર્વજનિક હોમ ફીડ (તમામ શિક્ષકો માટે)</option>
              {teacherGroups.map(g => (
                <option key={g.id} value={g.id}>👥 {g.gujaratiName}</option>
              ))}
            </select>
          </div>

          {/* Mode 1: Status Card Inputs */}
          {postMode === 'statusCard' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">મુખ્ય સુવિચાર / અનુભવ હેડલાઇન *</label>
                <input
                  type="text"
                  required
                  placeholder="દા.ત. 'શિક્ષક એ દીવો છે જે પોતે બળીને સમગ્ર વર્ગખંડને પ્રકાશ આપે છે.'"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">વિગતવાર વર્ણન (વૈકલ્પિક)</label>
                <textarea
                  rows={2}
                  placeholder="આજના વર્ગખંડનો ખાસ ક્ષણ અથવા અનુભવ..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 font-medium resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">કાર્ડ કલર ગ્રેડિયન્ટ પસંદ કરો</label>
                <div className="grid grid-cols-5 gap-2">
                  {gradients.map((g) => (
                    <button
                      key={g.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, bgGradient: g.class })}
                      className={`h-12 rounded-xl bg-gradient-to-br ${g.class} flex items-center justify-center transition-transform ${
                        formData.bgGradient === g.class ? 'ring-2 ring-offset-2 ring-amber-500 scale-105' : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      {formData.bgGradient === g.class && <Check className="w-5 h-5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Teacher Poll Inputs */}
          {postMode === 'poll' && (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">પોલ પ્રશ્ન / સર્વે ટોપિક *</label>
                <input
                  type="text"
                  required
                  placeholder="દા.ત. નવા સત્રમાં ગણિત શિક્ષણમાં કઈ પદ્ધતિ વધુ અસરકારક રહી?"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-700">મતદાન વિકલ્પો (Options) *</label>
                {pollOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => handleUpdatePollOption(idx, e.target.value)}
                      placeholder={`વિકલ્પ ${idx + 1}`}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePollOption(idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                {pollOptions.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddPollOption}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-amber-700 hover:text-amber-800 pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>વધુ વિકલ્પ ઉમેરો</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mode 3: Resource / Document Inputs */}
          {postMode === 'resource' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">સાધનનો પ્રકાર (Type) *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 font-medium"
                  >
                    {postTypes.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ધોરણ (Standard) *</label>
                  <select
                    value={formData.standard}
                    onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 font-medium"
                  >
                    <option value="તમામ ધોરણ (૧ થી ૮)">તમામ ધોરણ (૧ થી ૮)</option>
                    {STANDARDS_LIST.map(std => (
                      <option key={std} value={std}>{std}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">વિષય (Subject) *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 font-medium"
                  >
                    <option value="બધા વિષયો">બધા વિષયો / સામાન્ય</option>
                    {SUBJECTS_LIST.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">જોડાયેલ ફાઇલનું નામ (PDF/Doc)</label>
                  <input
                    type="text"
                    placeholder="દા.ત. Std7_Science_Worksheet.pdf"
                    value={formData.fileSnippet}
                    onChange={(e) => setFormData({ ...formData, fileSnippet: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">શીર્ષક (Title) *</label>
                <input
                  type="text"
                  required
                  placeholder="દા.ત. ધોરણ ૭ વિજ્ઞાન પ્રથમ સત્રાંત પરીક્ષા સંપૂર્ણ પ્રશ્નપત્ર (૮૦ ગુણ)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">વર્ણન & ઉપયોગીતા (Description)</label>
                <textarea
                  rows={3}
                  placeholder="આ મટીરીયલની વિશેષતાઓ, પ્રકરણો, બ્લૂપ્રિન્ટ કે ઉપયોગી માર્ગદર્શન..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 font-medium resize-none"
                />
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">ટેગ્સ (Tags - અલ્પવિરામથી અલગ કરો)</label>
            <input
              type="text"
              placeholder="દા.ત. પ્રશ્નપત્ર, GCERT, એકમ કસોટી, ધોરણ ૭"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              રદ કરો
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold shadow-xs hover:opacity-95 flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>કમ્યુનિટીમાં પ્રકાશિત કરો 🚀</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
