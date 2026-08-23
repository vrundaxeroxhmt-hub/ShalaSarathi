import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CommunityPostType, 
  TeacherUploadedTemplate, 
  SubFeatureType 
} from '../../types';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Share2,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FolderDown,
  Users,
  Building,
  GraduationCap,
  Layers,
  Tag,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  Eye,
  Printer,
  Download,
  Trash2,
  Globe,
  Lock,
  Calendar,
  MessageSquare,
  FileSpreadsheet,
  Check,
  RotateCcw,
  ExternalLink,
  Award
} from 'lucide-react';
import { UploadedTemplatePreviewModal } from './UploadedTemplatePreviewModal';

interface UploadResourceViewProps {
  onBack?: () => void;
}

export const UploadResourceView: React.FC<UploadResourceViewProps> = ({ onBack }) => {
  const { 
    teacherProfile, 
    schoolProfile, 
    addUploadedTemplate, 
    addCommunityPost, 
    uploadedTemplates,
    communityPosts,
    setActiveTab, 
    setActiveSubFeature 
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab mode: File Upload vs Digital Builder
  const [creationMode, setCreationMode] = useState<'file' | 'builder'>('file');

  // File Upload states
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'image'>('pdf');
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(0);
  const [fileSizeFormatted, setFileSizeFormatted] = useState<string>('');

  // General Form states
  const [title, setTitle] = useState('');
  const [resourceType, setResourceType] = useState<CommunityPostType>('lessonPlan');
  const [standard, setStandard] = useState('ધોરણ ૭');
  const [subject, setSubject] = useState('ગણિત');
  const [medium, setMedium] = useState('ગુજરાતી');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('#પાઠઆયોજન, #ગણિત, #ધોરણ૭');
  
  // Community Sharing Controls
  const [shareWithCommunity, setShareWithCommunity] = useState<boolean>(true);
  const [communityNote, setCommunityNote] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'school'>('public');

  // Digital Builder Structured Fields
  const [builderChapter, setBuilderChapter] = useState('પ્રકરણ ૧: પૂર્ણાંક સંખ્યાઓ');
  const [builderLOs, setBuilderLOs] = useState('M701: પૂર્ણાંક સંખ્યાઓના ગુણધર્મો સમજે છે અને વ્યવહારિક કોયડા ઉકેલે છે.');
  const [builderActivities, setBuilderActivities] = useState('૧. સંખ્યારેખા પર ધન અને ઋણ પૂર્ણાંકોનું નિરૂપણ કરાવવું.\n૨. જૂથમાં ગણતરીની રમત અને વ્યવહારિક ઉદાહરણો.');
  const [builderAssessment, setBuilderAssessment] = useState('૧. પૂર્ણાંક સંખ્યાઓના સરવાળા અને ગુણાકારના નિયમો ચકાસવા.\n૨. પાઠ્યપુસ્તકના સ્વાધ્યાય ૧.૧ ના દાખલા.');
  const [builderHomework, setBuilderHomework] = useState('દરરોજ ૫ દાખલા ગણવા અને સૂત્રો યાદ રાખવા.');

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    title: string;
    templateId?: string;
    sharedToCommunity: boolean;
  } | null>(null);

  // Preview modal for recently uploaded templates
  const [previewTemplate, setPreviewTemplate] = useState<TeacherUploadedTemplate | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const processFile = (file: File) => {
    setErrorMsg(null);
    const validPdfTypes = ['application/pdf'];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];

    const isPdf = validPdfTypes.includes(file.type) || file.name.toLowerCase().endsWith('.pdf');
    const isImage = validImageTypes.includes(file.type) || /\.(png|jpe?g|webp|svg|gif)$/i.test(file.name);

    if (!isPdf && !isImage) {
      setErrorMsg('કૃપા કરીને માત્ર PDF દસ્તાવેજ અથવા ઇમેજ ફાઇલ (PNG, JPG, WEBP) અપલોડ કરો.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('ફાઈલનું કદ ૮ MB કરતાં ઓછું હોવું જરૂરી છે.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFilePreviewUrl(result);
      setSelectedFile(file);
      setFileType(isPdf ? 'pdf' : 'image');
      setFileSizeBytes(file.size);
      setFileSizeFormatted(formatFileSize(file.size));

      if (!title.trim()) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]+/g, ' ')
          .trim();
        setTitle(cleanName);
      }
    };

    reader.onerror = () => {
      setErrorMsg('ફાઈલ વાંચવામાં ક્ષતિ આવી. કૃપા કરીને ફરી પ્રયાસ કરો.');
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

  // Sample Load Presets for quick generation
  const handleLoadSample = (sampleType: 'math_lp' | 'science_lp' | 'smc_resolution' | 'gujarati_plan') => {
    setCreationMode('builder');
    if (sampleType === 'math_lp') {
      setTitle('ધોરણ ૭ ગણિત: ત્રિકોણ અને તેના ગુણધર્મો દૈનિક પાઠ આયોજન');
      setResourceType('lessonPlan');
      setStandard('ધોરણ ૭');
      setSubject('ગણિત');
      setDescription('અધ્યયન નિષ્પત્તિ M708 આધારિત ત્રિકોણના ખૂણાઓના સરવાળાનો ગુણધર્મ અને પ્રવૃત્તિમય શિક્ષણ.');
      setTagsInput('#ગણિત, #પાઠઆયોજન, #ધોરણ૭, #LO');
      setBuilderChapter('પ્રકરણ ૬: ત્રિકોણ અને તેના ગુણધર્મો');
      setBuilderLOs('M708: ત્રિકોણના ત્રણેય ખૂણાઓનો સરવાળો ૧૮૦° થાય છે તે પ્રાયોગિક રીતે સાબિત કરે છે.');
      setBuilderActivities('૧. કાગળના કટિંગ દ્વારા ત્રિકોણના ત્રણ ખૂણા કાપીને ૧૮૦° રેખા પર ગોઠવવાની પ્રવૃત્તિ.\n૨. જિઓબોર્ડ અને રબર બેન્ડ વડે વિવિધ ત્રિકોણનું નિર્માણ.');
      setBuilderAssessment('૧. ત્રિકોણના બે ખૂણા ૫૦° અને ૭૦° હોય તો ત્રીજો ખૂણો શોધો.\n૨. કાટકોણ ત્રિકોણના ગુણધર્મો ચકાસો.');
      setBuilderHomework('પાઠ્યપુસ્તકના પાના નં. ૧૨૪ પરના પ્રયત્ન કરો ના ૪ દાખલા ગણવા.');
    } else if (sampleType === 'science_lp') {
      setTitle('ધોરણ ૮ વિજ્ઞાન: પ્રકાશ અને પરાવર્તનના નિયમો પ્રાયોગિક આયોજન');
      setResourceType('lessonPlan');
      setStandard('ધોરણ ૮');
      setSubject('વિજ્ઞાન');
      setDescription('સમતલ અરીસા વડે પ્રકાશનું પરાવર્તન અને આપાતકોણ-પરાવર્તનકોણ ચકાસણી પ્રયોગ આયોજન.');
      setTagsInput('#વિજ્ઞાન, #પ્રયોગ, #ધોરણ૮, #પ્રકાશ');
      setBuilderChapter('પ્રકરણ ૧૬: પ્રકાશ');
      setBuilderLOs('SC812: પ્રકાશના પરાવર્તનના નિયમો (આપાતકોણ = પરાવર્તનકોણ) પ્રયોગ દ્વારા તારવે છે.');
      setBuilderActivities('૧. સમતલ અરીસો, લેસર ટોર્ચ અને સફેદ કાગળની મદદથી આપાતકિરણ અને પરાવર્તિત કિરણનું નિરીક્ષણ.\n૨. ખૂણા માપક સાધન વડે આપાતકોણ અને પરાવર્તનકોણના માપની નોંધણી.');
      setBuilderAssessment('૧. આપાતકોણ ૪૫° હોય તો પરાવર્તનકોણ કેટલો થશે?\n૨. નિયમિત અને અનિયમિત પરાવર્તન વચ્ચેનો ભેદ સ્પષ્ટ કરો.');
      setBuilderHomework('ઘરે સમતલ અરીસામાં પ્રતિબિંબના લક્ષણો નોંધી લાવવા.');
    } else if (sampleType === 'smc_resolution') {
      setTitle('શાળા વ્યવસ્થાપન સમિતિ (SMC) માસિક બેઠક ઠરાવ નમૂનો');
      setResourceType('letter');
      setStandard('તમામ ધોરણ');
      setSubject('શાળા વહીવટ & SMC');
      setDescription('શાળા કમ્પોઝીટ ગ્રાન્ટ વપરાશ, મધ્યાહન ભોજન ગુણવત્તા અને શાળા સ્વચ્છતા અંગેની SMC સભાનો ઠરાવ.');
      setTagsInput('#SMC, #ઠરાવ, #શાળાવહીવટ, #ગ્રાન્ટ');
      setBuilderChapter('SMC માસિક બેઠક ઠરાવ નં. ૫');
      setBuilderLOs('શાળા વિકાસ અને શૈક્ષણિક ગુણવત્તા સુધારણા ઠરાવ.');
      setBuilderActivities('૧. કમ્પોઝીટ ગ્રાન્ટમાંથી પેપર, ઝેરોક્ષ અને સ્પોર્ટ્સ સાધનો ખરીદવા સર્વાનુમતે મંજૂરી.\n૨. PM પોષણ ભોજનની ગુણવત્તા ચકાસણી માટે વાલી સમિતિની રચના.');
      setBuilderAssessment('ઠરાવનું પાલન અને ખર્ચ વાઉચરોનું ઓડિટ આગામી માસ સુધી પૂર્ણ કરવું.');
      setBuilderHomework('તમામ સભ્યોની સહીઓ મેળવી રજિસ્ટરમાં નોંધ લેવી.');
    } else if (sampleType === 'gujarati_plan') {
      setTitle('ધોરણ ૬ ગુજરાતી: કાવ્યગાન & ભાષા સજ્જતા પાઠ આયોજન');
      setResourceType('lessonPlan');
      setStandard('ધોરણ ૬');
      setSubject('ગુજરાતી');
      setDescription('કાવ્યનું રાગયુક્ત શ્રવણ-ગાન, શબ્દાર્થ અને વિશેષણ વ્યાકરણ અધ્યયન આયોજન.');
      setTagsInput('#ગુજરાતી, #કાવ્યગાન, #ધોરણ૬, #વ્યાકરણ');
      setBuilderChapter('કાવ્ય: હિન્દમાતાને સંબોધન');
      setBuilderLOs('G602: કાવ્યનું આરોહ-અવરોહ સાથે ભાવવાહી ગાન કરે છે અને સારાંશ રજૂ કરે છે.');
      setBuilderActivities('૧. શિક્ષક દ્વારા આદર્શ કાવ્યગાન અને ત્યારબાદ સમૂહગાન.\n૨. કાવ્યમાં વપરાયેલા વિરોધી અને સમાનાર્થી શબ્દોની યાદી બનાવડાવવી.');
      setBuilderAssessment('૧. કાવ્યના આધારે દેશભક્તિ અને એકતા અંગેના પ્રશ્નો.\n૨. ગુણવાચક વિશેષણ ઓળખો.');
      setBuilderHomework('કાવ્યની પ્રથમ ૮ પંક્તિઓ સુંદર અક્ષરે લખી યાદ કરવી.');
    }
  };

  // Convert digital builder data into structured printable text
  const generateBuilderContent = (): string => {
    return `=== ${title} ===
વિષય: ${subject} | ${standard} | માધ્યમ: ${medium}
શાળા: ${schoolProfile.schoolName} (${schoolProfile.village}, ${schoolProfile.district})
શિક્ષક: ${teacherProfile.name} (${teacherProfile.role})
તારીખ: ${new Date().toLocaleDateString('gu-IN')}

[૧. એકમ / વિષયાંગ]
${builderChapter}

[૨. અધ્યયન નિષ્પત્તિઓ (Learning Outcomes)]
${builderLOs}

[૩. શૈક્ષણિક પ્રક્રિયા & TLM પ્રવૃત્તિઓ]
${builderActivities}

[૪. મૂલ્યાંકન & પ્રશ્નોત્તરી (Assessment)]
${builderAssessment}

[૫. પુનરાવર્તન & ગૃહકાર્ય]
${builderHomework}

વિશેષ નોંધ: ${description || 'ગુજરાત પ્રાથમિક શાળા શિક્ષણ પદ્ધતિ અનુસાર તૈયાર કરેલ.'}
`;
  };

  // Map CommunityPostType to TeacherUploadedTemplate Category
  const mapPostTypeToTemplateCategory = (type: CommunityPostType): TeacherUploadedTemplate['category'] => {
    switch (type) {
      case 'lessonPlan': return 'lesson_plan';
      case 'worksheet':
      case 'questionPaper': return 'exam_evaluation';
      case 'patrak':
      case 'letter':
      case 'paripatra': return 'admin_register';
      case 'activity': return 'fln_remedial';
      default: return 'custom';
    }
  };

  const mapPostTypeToLabel = (type: CommunityPostType): string => {
    switch (type) {
      case 'lessonPlan': return 'પાઠ આયોજન (Lesson Plan)';
      case 'worksheet': return 'વર્કશીટ / સ્વાધ્યાય';
      case 'questionPaper': return 'પ્રશ્નપત્ર / એકમ કસોટી';
      case 'patrak': return 'પત્રક / રજિસ્ટર નમૂનો';
      case 'letter': return 'શાળા દસ્તાવેજ / અરજી / ઠરાવ';
      case 'paripatra': return 'પરિપત્ર / સરકારી ગાઇડલાઇન';
      case 'activity': return 'શૈક્ષણિક પ્રવૃત્તિ (TLM)';
      default: return 'શૈક્ષણિક સંસાધન';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('કૃપા કરીને સંસાધનનું શીર્ષક / નામ દાખલ કરો.');
      return;
    }

    if (creationMode === 'file' && (!selectedFile || !filePreviewUrl)) {
      setErrorMsg('કૃપા કરીને અપલોડ કરવા માટે PDF અથવા ઇમેજ ફાઇલ પસંદ કરો.');
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray = tagsInput
        .split(',')
        .map(t => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      if (tagsArray.length === 0) {
        tagsArray.push(subject, standard, 'શૈક્ષણિક સાધન');
      }

      let generatedDataUrl = filePreviewUrl;
      let finalFileName = selectedFile ? selectedFile.name : `${title.replace(/\s+/g, '_')}.txt`;
      let finalFileSize = fileSizeFormatted || '૫૦ KB';
      let finalFileSizeBytes = fileSizeBytes || 50000;
      let finalFileType: 'pdf' | 'image' = fileType;

      // If in builder mode, create a text data URL representation
      if (creationMode === 'builder') {
        const textPayload = generateBuilderContent();
        const base64Data = btoa(unescape(encodeURIComponent(textPayload)));
        generatedDataUrl = `data:text/plain;charset=utf-8;base64,${base64Data}`;
        finalFileName = `${title.replace(/\s+/g, '_')}_LessonPlan.txt`;
        finalFileSize = `${(textPayload.length / 1024).toFixed(1)} KB`;
        finalFileSizeBytes = textPayload.length;
        finalFileType = 'pdf'; // marked as document
      }

      // 1. Save to Teacher's Uploaded Templates / Resources
      const templateData: Omit<TeacherUploadedTemplate, 'id' | 'uploadedAt'> = {
        title: title.trim(),
        description: description.trim() || `${mapPostTypeToLabel(resourceType)} - ${standard}`,
        category: mapPostTypeToTemplateCategory(resourceType),
        categoryLabel: mapPostTypeToLabel(resourceType),
        standard,
        subject: subject.trim() || 'સામાન્ય',
        fileType: finalFileType,
        mimeType: selectedFile ? selectedFile.type : 'text/plain',
        fileName: finalFileName,
        fileSize: finalFileSize,
        fileSizeBytes: finalFileSizeBytes,
        dataUrl: generatedDataUrl || '',
        uploadedBy: teacherProfile.name || 'શિક્ષક શ્રી',
        tags: tagsArray,
        isFavorite: false
      };

      addUploadedTemplate(templateData);

      // 2. If Share with Community is enabled, publish to Community feed!
      if (shareWithCommunity) {
        const structuredSnippet = creationMode === 'builder' ? generateBuilderContent() : (description || title);
        
        addCommunityPost({
          creatorName: teacherProfile.name || 'શિક્ષક શ્રી',
          creatorRole: teacherProfile.role || 'સહાયક શિક્ષક',
          creatorSchool: teacherProfile.schoolName || schoolProfile.schoolName,
          creatorDistrict: teacherProfile.district || schoolProfile.district,
          type: resourceType,
          title: title.trim(),
          description: communityNote ? `${description}\n\n[શિક્ષક નોંધ]: ${communityNote}` : description,
          standard,
          subject,
          medium,
          tags: tagsArray,
          fileSnippet: finalFileName,
          resourceContent: structuredSnippet
        });
      }

      setIsSubmitting(false);
      setSuccessData({
        title: title.trim(),
        sharedToCommunity: shareWithCommunity
      });

    } catch (err: any) {
      console.error('Error uploading resource:', err);
      setErrorMsg('સંસાધન અપલોડ કરવામાં ક્ષતિ આવી. કૃપા કરીને ફરી પ્રયાસ કરો.');
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setTitle('');
    setDescription('');
    setCommunityNote('');
    setSuccessData(null);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between no-print">
        <button
          type="button"
          onClick={() => {
            if (onBack) onBack();
            else setActiveSubFeature('work-hub');
          }}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-amber-600" />
          <span>પાછા શાળા કાર્ય સહાયકમાં જાઓ</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveSubFeature('downloadable-resources')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <FolderDown className="w-3.5 h-3.5" />
            <span>સાધન ભંડાર જુઓ ({uploadedTemplates.length + 8})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('community')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>શિક્ષક સમુદાય ફીડ</span>
          </button>
        </div>
      </div>

      {/* Main Feature Hero Header */}
      <div className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-white border border-white/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>શિક્ષક સંસાધન ભંડાર & કમ્યુનિટી શેરિંગ</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              નવું શૈક્ષણિક સંસાધન અપલોડ કરો & શેર કરો
            </h1>
            
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              તમારા બનાવેલા પાઠ આયોજન (Lesson Plans), વર્કશીટ્સ, એકમ કસોટી પ્રશ્નપત્રો, પત્રકો અને શાળા દસ્તાવેજો અપલોડ કરો અને ગુજરાતના હજારો શિક્ષકો સાથે એક જ ક્લિકમાં શેર કરો.
            </p>
          </div>

          {/* Teacher Badge Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shrink-0 min-w-[240px] text-xs space-y-1.5">
            <div className="flex items-center space-x-2 text-white font-bold">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>શેરિંગ પ્રોફાઇલ:</span>
            </div>
            <p className="text-white font-extrabold text-sm">{teacherProfile.name || 'શિક્ષક શ્રી'}</p>
            <p className="text-rose-100 text-[11px] truncate">{schoolProfile.schoolName || teacherProfile.schoolName}</p>
            <p className="text-rose-200 text-[10px]">{teacherProfile.district} • {teacherProfile.role}</p>
          </div>
        </div>
      </div>

      {/* Success View Banner (if submitted) */}
      {successData && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 shadow-sm space-y-4 animate-in zoom-in-95">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-emerald-950">
                  સંસાધન સફળતાપૂર્વક સાચવવામાં આવ્યું! 🎉
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  <strong>"{successData.title}"</strong> તમારા સાધન ભંડારમાં સંગ્રહિત થઈ ગયું છે.
                  {successData.sharedToCommunity && ' અને ગુજરાત શિક્ષક સમુદાય ફીડમાં લાઈવ પ્રકાશિત થયું છે!'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetForm}
              className="p-1.5 text-emerald-700 hover:text-emerald-900 rounded-lg hover:bg-emerald-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-emerald-200">
            {successData.sharedToCommunity && (
              <button
                type="button"
                onClick={() => setActiveTab('community')}
                className="inline-flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>કમ્યુનિટી ફીડમાં પોસ્ટ જુઓ</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveSubFeature('downloadable-resources')}
              className="inline-flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <FolderDown className="w-4 h-4" />
              <span>સાધન ભંડારમાં જુઓ</span>
            </button>

            <button
              type="button"
              onClick={handleResetForm}
              className="inline-flex items-center space-x-1.5 bg-white hover:bg-emerald-100/50 text-emerald-900 border border-emerald-300 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>બીજું સંસાધન અપલોડ કરો</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Upload Form Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
        
        {/* Creation Mode Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              સંસાધન નિર્માણ & અપલોડ પદ્ધતિ પસંદ કરો
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              તમારી પાસે રહેલી PDF/ઇમેજ ફાઇલ અપલોડ કરો અથવા ઓનલાઇન ડિજિટલ ફોર્મ દ્વારા પાઠ આયોજન તૈયાર કરો.
            </p>
          </div>

          <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold self-start">
            <button
              type="button"
              onClick={() => setCreationMode('file')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all ${
                creationMode === 'file'
                  ? 'bg-white text-slate-900 shadow-xs font-bold text-rose-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>૧. ફાઇલ અપલોડ (PDF / Image)</span>
            </button>

            <button
              type="button"
              onClick={() => setCreationMode('builder')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all ${
                creationMode === 'builder'
                  ? 'bg-white text-slate-900 shadow-xs font-bold text-amber-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>૨. ડિજિટલ પાઠ આયોજન બિલ્ડર</span>
            </button>
          </div>
        </div>

        {/* Quick Sample Presets Bar */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>ઝડપી સેમ્પલ ટેમ્પ્લેટ્સ (Quick Load):</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleLoadSample('math_lp')}
              className="bg-white hover:bg-amber-100 text-slate-800 hover:text-amber-900 border border-amber-300 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              📐 ગણિત પાઠ આયોજન
            </button>

            <button
              type="button"
              onClick={() => handleLoadSample('science_lp')}
              className="bg-white hover:bg-amber-100 text-slate-800 hover:text-amber-900 border border-amber-300 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              🔬 વિજ્ઞાન પ્રયોગ આયોજન
            </button>

            <button
              type="button"
              onClick={() => handleLoadSample('gujarati_plan')}
              className="bg-white hover:bg-amber-100 text-slate-800 hover:text-amber-900 border border-amber-300 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              📖 ગુજરાતી કાવ્ય આયોજન
            </button>

            <button
              type="button"
              onClick={() => handleLoadSample('smc_resolution')}
              className="bg-white hover:bg-amber-100 text-slate-800 hover:text-amber-900 border border-amber-300 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              🏛️ SMC બેઠક ઠરાવ
            </button>
          </div>
        </div>

        {/* Form Error Banner */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ================================================================= */}
          {/* 1. FILE UPLOAD DROPZONE (If in file mode) */}
          {/* ================================================================= */}
          {creationMode === 'file' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                દસ્તાવેજ અથવા પાઠ આયોજન ફાઇલ (PDF / Image): <span className="text-rose-500">*</span>
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
                  className={`border-2 border-dashed rounded-3xl p-6 sm:p-9 text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-rose-500 bg-rose-50/50 scale-[0.99]'
                      : 'border-slate-300 hover:border-rose-400 bg-slate-50/70 hover:bg-rose-50/20'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                    <Upload className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">
                    અહીં તમારી PDF અથવા સ્કેન કરેલ દસ્તાવેજ ફાઇલ ડ્રેગ કરો
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    અથવા તમારા કમ્પ્યુટર/મોબાઇલમાંથી પસંદ કરવા ક્લિક કરો. સપોર્ટેડ: <strong className="text-slate-700">PDF, JPG, PNG, WEBP</strong> (મહત્તમ ૮ MB)
                  </p>
                  <div className="mt-3.5 inline-flex items-center space-x-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    <span>શિક્ષક સમુદાયમાં તુરંત ડાઉનલોડેબલ બનશે</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                        {fileSizeFormatted} • {fileType.toUpperCase()} દસ્તાવેજ
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
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
          )}

          {/* ================================================================= */}
          {/* 2. DIGITAL LESSON PLAN & DOCUMENT BUILDER (If in builder mode) */}
          {/* ================================================================= */}
          {creationMode === 'builder' && (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    ડિજિટલ પાઠ આયોજન / દસ્તાવેજ વિગતો (Structured Sections)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">A4 ફોર્મેટ સુસંગત</span>
              </div>

              {/* Unit / Chapter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ૧. એકમ / પ્રકરણ / વિષયાંગ (Unit & Chapter):
                </label>
                <input
                  type="text"
                  value={builderChapter}
                  onChange={e => setBuilderChapter(e.target.value)}
                  placeholder="દા.ત. પ્રકરણ ૪: સાદા સમીકરણ અથવા કાવ્ય ૫"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Learning Outcomes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ૨. અધ્યયન નિષ્પત્તિઓ (Learning Outcomes / LOs):
                </label>
                <textarea
                  rows={2}
                  value={builderLOs}
                  onChange={e => setBuilderLOs(e.target.value)}
                  placeholder="દા.ત. M704: સમીકરણનો ઉકેલ શોધે છે અને ચકાસણી કરે છે..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* TLM & Classroom Activities */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ૩. શૈક્ષણિક પ્રક્રિયા & TLM પ્રવૃત્તિઓ (Teaching Activities):
                </label>
                <textarea
                  rows={3}
                  value={builderActivities}
                  onChange={e => setBuilderActivities(e.target.value)}
                  placeholder="વર્ગખંડમાં કરાવવાની પ્રવૃત્તિઓ, જૂથ કાર્ય, મૂર્ત સાધન સામગ્રી..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Assessment Questions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ૪. મૂલ્યાંકન પ્રશ્નોત્તરી (Assessment):
                  </label>
                  <textarea
                    rows={2}
                    value={builderAssessment}
                    onChange={e => setBuilderAssessment(e.target.value)}
                    placeholder="મૂલ્યાંકન માટેના પ્રશ્નો..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ૫. પુનરાવર્તન / ગૃહકાર્ય (Homework):
                  </label>
                  <textarea
                    rows={2}
                    value={builderHomework}
                    onChange={e => setBuilderHomework(e.target.value)}
                    placeholder="વિદ્યાર્થીઓ માટે ગૃહકાર્ય અથવા નબળા વિદ્યાર્થી માટે સુધારણા..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* 3. CORE RESOURCE METADATA */}
          {/* ================================================================= */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            
            {/* Title Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                સંસાધનનું શીર્ષક / નામ (Title): <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="દા.ત. ધોરણ ૭ ગણિત ત્રિકોણ અને તેના ગુણધર્મો પાઠ આયોજન"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all"
              />
            </div>

            {/* Classification: Type, Standard, Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  સાધનનો પ્રકાર (Type):
                </label>
                <select
                  value={resourceType}
                  onChange={e => setResourceType(e.target.value as CommunityPostType)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-600"
                >
                  <option value="lessonPlan">પાઠ આયોજન (Lesson Plan)</option>
                  <option value="worksheet">વર્કશીટ / સ્વાધ્યાય (Worksheet)</option>
                  <option value="questionPaper">પ્રશ્નપત્ર / એકમ કસોટી</option>
                  <option value="patrak">પત્રક / રજિસ્ટર નમૂનો</option>
                  <option value="letter">શાળા દસ્તાવેજ / પરિપત્ર / ઠરાવ</option>
                  <option value="activity">પ્રવૃત્તિ / FLN સાધન</option>
                  <option value="resource">અન્ય ઉપયોગી સાધન</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ધોરણ (Standard):
                </label>
                <select
                  value={standard}
                  onChange={e => setStandard(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-600"
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  વિષય (Subject):
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="દા.ત. ગણિત, વિજ્ઞાન, સા.વિ."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-rose-600"
                />
              </div>
            </div>

            {/* Description & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  સંક્ષિપ્ત વર્ણન અથવા હેતુ:
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="આ સંસાધન કયા હેતુ માટે અને ક્યારે ઉપયોગી થશે તેની વિગત..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 resize-none"
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
                  placeholder="#પાઠઆયોજન, #ગણિત, #ધોરણ૭"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-rose-600 mb-2"
                />
                <p className="text-[11px] text-slate-400">
                  ટૅગ્સ દ્વારા અન્ય શિક્ષકો સરળતાથી કમ્યુનિટીમાં તમારું મટીરીયલ સર્ચ કરી શકશે.
                </p>
              </div>
            </div>

          </div>

          {/* ================================================================= */}
          {/* 4. COMMUNITY SHARING CONTROLS (ગુજરાત શિક્ષક સમુદાય શેરિંગ) */}
          {/* ================================================================= */}
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border border-amber-200 rounded-3xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <span>ગુજરાત શિક્ષક સમુદાય (Community) માં લાઈવ શેર કરો</span>
                    <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      સમુદાય સહયોગ
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    આ સંસાધન સમગ્ર ગુજરાતના પ્રાથમિક શિક્ષકો સાથે કમ્યુનિટી ફીડમાં શેર કરવામાં આવશે.
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <label className="inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={shareWithCommunity}
                  onChange={e => setShareWithCommunity(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                <span className="ms-2.5 text-xs font-bold text-slate-800">
                  {shareWithCommunity ? 'શેરિંગ સક્રિય ✅' : 'માત્ર ખાનગી'}
                </span>
              </label>
            </div>

            {/* Note to Community */}
            {shareWithCommunity && (
              <div className="pt-2 border-t border-amber-200/80 space-y-2">
                <label className="block text-xs font-semibold text-amber-950">
                  સાથી શિક્ષકો માટે સંદેશ અથવા વિશેષ સૂચન (વૈકલ્પિક):
                </label>
                <input
                  type="text"
                  value={communityNote}
                  onChange={e => setCommunityNote(e.target.value)}
                  placeholder="દા.ત. આ પાઠ આયોજન સત્ર ૧ ના એકમ ૨ માટે ઉત્તમ પરિણામ આપે છે..."
                  className="w-full px-3.5 py-2 bg-white border border-amber-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
                <div className="flex items-center space-x-2 text-[11px] text-amber-800">
                  <Globe className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>પ્રકાશક તરીકે: <strong>{teacherProfile.name}</strong> ({schoolProfile.schoolName}, {teacherProfile.district}) દર્શાવવામાં આવશે.</span>
                </div>
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* 5. FORM SUBMISSION ACTIONS */}
          {/* ================================================================= */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                if (onBack) onBack();
                else setActiveSubFeature('work-hub');
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-colors cursor-pointer text-center"
            >
              રદ કરો
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || (creationMode === 'file' && !selectedFile)}
              className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:from-rose-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              id="submit-resource-btn"
            >
              {isSubmitting ? (
                <span>સાધન સાચવી રહ્યાં છીએ...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {shareWithCommunity ? 'સાધન સાચવો & કમ્યુનિટીમાં શેર કરો' : 'સાધન મારા ભંડારમાં સાચવો'}
                  </span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

      {/* ===================================================================== */}
      {/* 6. RECENTLY UPLOADED & COMMUNITY SHARED RESOURCES GALLERY */}
      {/* ===================================================================== */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <FolderDown className="w-5 h-5 text-rose-600" />
              <span>મારા અપલોડ કરેલા સંસાધનો & ટેમ્પ્લેટ્સ ({uploadedTemplates.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              તમારા દ્વારા લોકલ સ્ટોરેજમાં સેવ થયેલા અને કમ્યુનિટી સાથે શેર કરેલા દસ્તાવેજો
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveSubFeature('downloadable-resources')}
            className="inline-flex items-center space-x-1 text-xs font-bold text-rose-700 hover:text-rose-800 self-start sm:self-center"
          >
            <span>સંપૂર્ણ સાધન ભંડાર જુઓ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {uploadedTemplates.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
            <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">હજુ સુધી કોઈ સંસાધન અપલોડ થયેલ નથી</p>
            <p className="text-[11px] text-slate-400 mt-0.5">ઉપરના ફોર્મ દ્વારા તમારું પ્રથમ પાઠ આયોજન કે દસ્તાવેજ અપલોડ કરો.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {uploadedTemplates.slice(0, 6).map(tpl => (
              <div
                key={tpl.id}
                className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl p-4 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {tpl.categoryLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {tpl.fileSize}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                    {tpl.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 mt-1">
                    {tpl.standard} • {tpl.subject}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {tpl.uploadedAt}
                  </span>

                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(tpl)}
                      className="p-1 text-slate-600 hover:text-slate-900 rounded-md hover:bg-white transition-colors"
                      title="પ્રિવ્યૂ જુઓ"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = tpl.dataUrl;
                        a.download = tpl.fileName || `${tpl.title}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }}
                      className="p-1 text-rose-600 hover:text-rose-800 rounded-md hover:bg-white transition-colors"
                      title="ડાઉનલોડ કરો"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal for Uploaded Template */}
      {previewTemplate && (
        <UploadedTemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}

    </div>
  );
};
