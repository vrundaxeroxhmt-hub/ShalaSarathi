import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { TeacherUploadedTemplate, CommunityPostType } from '../../types';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertCircle,
  FolderDown,
  Sparkles,
  Tag,
  BookOpen,
  Info,
  Share2,
  Globe
} from 'lucide-react';

interface CustomTemplateUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newTemplate: TeacherUploadedTemplate) => void;
}

export const CustomTemplateUploaderModal: React.FC<CustomTemplateUploaderModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { addUploadedTemplate, addCommunityPost, teacherProfile, schoolProfile } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'image'>('pdf');
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(0);
  const [fileSizeFormatted, setFileSizeFormatted] = useState<string>('');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TeacherUploadedTemplate['category']>('classroom_template');
  const [standard, setStandard] = useState('તમામ ધોરણ');
  const [subject, setSubject] = useState('સામાન્ય');
  const [tagsInput, setTagsInput] = useState('વર્ગખંડ, ટેમ્પ્લેટ, A4');
  const [shareWithCommunity, setShareWithCommunity] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getCategoryLabel = (cat: TeacherUploadedTemplate['category']): string => {
    switch (cat) {
      case 'lesson_plan': return 'પાઠ આયોજન (Lesson Plan)';
      case 'classroom_template': return 'વર્ગખંડ ટેમ્પ્લેટ્સ (Classroom)';
      case 'admin_register': return 'વહીવટી રજિસ્ટર & SMC';
      case 'fln_remedial': return 'FLN & સુધારણા કાર્ય';
      case 'exam_evaluation': return 'કસોટી & મૂલ્યાંકન';
      default: return 'કસ્ટમ ટેમ્પ્લેટ';
    }
  };

  const processFile = (file: File) => {
    setErrorMsg(null);
    const validPdfTypes = ['application/pdf'];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];

    const isPdf = validPdfTypes.includes(file.type) || file.name.toLowerCase().endsWith('.pdf');
    const isImage = validImageTypes.includes(file.type) || /\.(png|jpe?g|webp|svg|gif)$/i.test(file.name);

    if (!isPdf && !isImage) {
      setErrorMsg('કૃપા કરીને માત્ર PDF દસ્તાવેજ અથવા ઇમેજ ફાઇલ (PNG, JPG, JPEG, WEBP) અપલોડ કરો.');
      return;
    }

    // Size check (max 8MB for smooth local storage performance)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('ફાઈલનું કદ ૮ MB કરતાં ઓછું હોવું જરૂરી છે.');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFilePreviewUrl(result);
      setSelectedFile(file);
      setFileType(isPdf ? 'pdf' : 'image');
      setFileSizeBytes(file.size);
      setFileSizeFormatted(formatFileSize(file.size));

      // Auto-suggest title if empty
      if (!title.trim()) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]+/g, ' ')
          .trim();
        setTitle(cleanName);
      }
      setIsProcessing(false);
    };

    reader.onerror = () => {
      setErrorMsg('ફાઈલ વાંચવામાં ક્ષતિ આવી. કૃપા કરીને ફરી પ્રયાસ કરો.');
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !filePreviewUrl) {
      setErrorMsg('કૃપા કરીને ટેમ્પ્લેટ ફાઇલ પસંદ કરો.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('કૃપા કરીને ટેમ્પ્લેટનું શીર્ષક / નામ દાખલ કરો.');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    if (tagsArray.length === 0) {
      tagsArray.push('ટેમ્પ્લેટ', fileType.toUpperCase());
    }

    const templateData: Omit<TeacherUploadedTemplate, 'id' | 'uploadedAt'> = {
      title: title.trim(),
      description: description.trim() || `${getCategoryLabel(category)} - ${standard}`,
      category,
      categoryLabel: getCategoryLabel(category),
      standard,
      subject: subject.trim() || 'સામાન્ય',
      fileType,
      mimeType: selectedFile.type || (fileType === 'pdf' ? 'application/pdf' : 'image/jpeg'),
      fileName: selectedFile.name,
      fileSize: fileSizeFormatted,
      fileSizeBytes,
      dataUrl: filePreviewUrl,
      uploadedBy: teacherProfile.name || 'શિક્ષક શ્રી',
      tags: tagsArray,
      isFavorite: false
    };

    addUploadedTemplate(templateData);

    // If community sharing is enabled, publish to community feed
    if (shareWithCommunity) {
      let mappedType: CommunityPostType = 'resource';
      if (category === 'lesson_plan') mappedType = 'lessonPlan';
      else if (category === 'exam_evaluation') mappedType = 'worksheet';
      else if (category === 'admin_register') mappedType = 'patrak';
      else if (category === 'fln_remedial') mappedType = 'activity';

      addCommunityPost({
        creatorName: teacherProfile.name || 'શિક્ષક શ્રી',
        creatorRole: teacherProfile.role || 'સહાયક શિક્ષક',
        creatorSchool: teacherProfile.schoolName || schoolProfile.schoolName,
        creatorDistrict: teacherProfile.district || schoolProfile.district,
        type: mappedType,
        title: title.trim(),
        description: description.trim() || `${getCategoryLabel(category)} - ${standard}`,
        standard,
        subject: subject.trim() || 'સામાન્ય',
        medium: 'ગુજરાતી',
        tags: tagsArray,
        fileSnippet: selectedFile.name,
        resourceContent: description.trim()
      });
    }

    if (onSuccess) {
      onSuccess({
        ...templateData,
        id: `tpl-${Date.now()}`,
        uploadedAt: new Date().toLocaleDateString('gu-IN')
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 my-auto max-h-[94vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-rose-50 to-amber-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                નવું ક્લાસરૂમ ટેમ્પ્લેટ અપલોડ કરો
              </h2>
              <p className="text-xs text-slate-600">
                PDF અથવા ઇમેજ ફાઇલ લોકલ સ્ટોરેજમાં સેવ કરી ઝડપી એક્સેસ મેળવો
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Upload Dropzone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              ટેમ્પ્લેટ ફાઇલ પસંદ કરો (PDF અથવા Image): <span className="text-rose-500">*</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-rose-500 bg-rose-50/50 scale-[0.99]'
                    : 'border-slate-300 hover:border-rose-400 bg-slate-50/70 hover:bg-rose-50/20'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Upload className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  અહીં ફાઇલ ડ્રેગ કરો અથવા બ્રાઉઝ કરવા ક્લિક કરો
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  સપોર્ટેડ ફોર્મેટ્સ: <strong className="text-slate-700">PDF, JPG, PNG, WEBP</strong> (મહત્તમ ૮ MB)
                </p>
                <div className="mt-3 inline-flex items-center space-x-1.5 bg-white border border-slate-200 px-3 py-1 rounded-full text-[11px] font-bold text-slate-600 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-rose-500" />
                  <span>ઓફલાઇન & લોકલ બ્રાઉઝર સ્ટોરેજ</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                    fileType === 'pdf' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {fileType === 'pdf' ? <FileText className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {fileSizeFormatted} • {fileType.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    બદલો
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setFilePreviewUrl(null);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    title="દૂર કરો"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Title Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ટેમ્પ્લેટનું નામ / શીર્ષક: <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="દા.ત. ધોરણ ૭ વિજ્ઞાન પ્રોજેક્ટ પત્રક અથવા ગણિત વર્કશીટ"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all"
            />
          </div>

          {/* Category & Standard Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                કેટેગરી:
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TeacherUploadedTemplate['category'])}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-600"
              >
                <option value="classroom_template">વર્ગખંડ ટેમ્પ્લેટ્સ (Classroom)</option>
                <option value="lesson_plan">પાઠ આયોજન (Lesson Plans)</option>
                <option value="admin_register">વહીવટી રજિસ્ટર & SMC</option>
                <option value="fln_remedial">FLN & સુધારણા કાર્ય</option>
                <option value="exam_evaluation">કસોટી & મૂલ્યાંકન</option>
                <option value="custom">અન્ય / સામાન્ય</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ધોરણ (Standard):
              </label>
              <select
                value={standard}
                onChange={e => setStandard(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-600"
              >
                <option value="તમામ ધોરણ">તમામ ધોરણ (All Standards)</option>
                <option value="ધોરણ ૧-૫">ધોરણ ૧-૫ (Primary)</option>
                <option value="ધોરણ ૬-૮">ધોરણ ૬-૮ (Upper Primary)</option>
                <option value="ધોરણ ૧">ધોરણ ૧</option>
                <option value="ધોરણ ૨">ધોરણ ૨</option>
                <option value="ધોરણ ૩">ધોરણ ૩</option>
                <option value="ધોરણ ૪">ધોરણ ૪</option>
                <option value="ધોરણ ૫">ધોરણ ૫</option>
                <option value="ધોરણ ૬">ધોરણ ૬</option>
                <option value="ધોરણ ૭">ધોરણ ૭</option>
                <option value="ધોરણ ૮">ધોરણ ૮</option>
              </select>
            </div>
          </div>

          {/* Subject & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                વિષય (Subject):
              </label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="દા.ત. ગણિત, વિજ્ઞાન, ગુજરાતી, અંગ્રેજી"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ટૅગ્સ (અલ્પવિરામથી અલગ કરો):
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="દા.ત. વર્કશીટ, કસોટી, પ્રિન્ટ"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              />
            </div>
          </div>

          {/* Description & Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              વર્ણન અથવા વિશેષ નોંધ:
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="ટેમ્પ્લેટ ક્યારે અને કેવી રીતે વાપરવું તે અંગેની નોંધ..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 resize-none"
            />
          </div>

          {/* Community Sharing Switch */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shrink-0">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  શિક્ષક કમ્યુનિટીમાં લાઈવ શેર કરો
                </p>
                <p className="text-[11px] text-slate-500">
                  ગુજરાત શિક્ષક સમુદાય ફીડમાં આ સાધન પ્રકાશિત થશે
                </p>
              </div>
            </div>

            <label className="inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={shareWithCommunity}
                onChange={e => setShareWithCommunity(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {/* Info note */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 flex items-start space-x-2 text-[11px] text-amber-900">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              આ ટેમ્પ્લેટ તમારા બ્રાઉઝરના સુરક્ષિત લોકલ સ્ટોરેજમાં સંગ્રહિત થશે જેથી ઇન્ટરનેટ વિના પણ ગમે ત્યારે પ્રિન્ટ કે ડાઉનલોડ કરી શકાય.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              રદ કરો
            </button>

            <button
              type="submit"
              disabled={!selectedFile || !title.trim() || isProcessing}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isProcessing ? 'પ્રોસેસિંગ...' : 'ટેમ્પ્લેટ સાચવો'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
