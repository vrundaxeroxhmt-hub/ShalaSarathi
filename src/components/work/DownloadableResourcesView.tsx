import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DownloadableResource, TeacherUploadedTemplate } from '../../types';
import { CustomTemplateUploaderModal } from './CustomTemplateUploaderModal';
import { UploadedTemplatePreviewModal } from './UploadedTemplatePreviewModal';
import { ResourceReviewsSection, StarRatingBadge } from './ResourceReviewsSection';
import { PdfDocumentViewerModal, PreviewDocType } from './PdfDocumentViewerModal';
import {
  Download,
  FileText,
  Search,
  Filter,
  Eye,
  Printer,
  FileSpreadsheet,
  BookOpen,
  Calendar,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
  Layers,
  Copy,
  Check,
  ArrowDownToLine,
  Bookmark,
  Share2,
  Info,
  X,
  FileCheck,
  FolderDown,
  Table,
  Building,
  GraduationCap,
  Upload,
  Plus,
  Image as ImageIcon,
  Trash2,
  Star,
  MessageSquare
} from 'lucide-react';

export const initialDownloadableResources: DownloadableResource[] = [
  // 1. Lesson Plans
  {
    id: 'lp-maths-std-1-5',
    title: 'ગણિત પાયાની સંકલ્પનાઓ & આકાર જ્ઞાન પાઠ આયોજન',
    gujaratiTitle: 'ગણિત દૈનિક પાઠ આયોજન (LO આધારિત)',
    description: 'ધોરણ ૧ થી ૫ માટે સંખ્યાજ્ઞાન, સ્થાનકિંમત, સરવાળા-બાદબાકી અને ભૌમિતિક આકારોનું અધ્યયન નિષ્પત્તિ આધારિત દૈનિક આયોજન.',
    category: 'lesson_plan',
    categoryLabel: 'પાઠ આયોજન',
    standard: 'ધોરણ ૧-૫',
    subject: 'ગણિત',
    fileFormat: 'PDF',
    fileSize: '૨૪૫ KB',
    downloadCount: 342,
    tags: ['ગણિત', 'સંખ્યાજ્ઞાન', 'પાઠ આયોજન', 'LO', 'ધોરણ ૧-૫'],
    isFeatured: true,
    contentStructure: {
      header: 'ગણિત વિષય દૈનિક પાઠ આયોજન - અધ્યયન નિષ્પત્તિ કેન્દ્રિત',
      subHeader: 'પ્રાથમિક શાળા - સત્ર ૧ અને ૨',
      instructions: [
        '૧. વિદ્યાર્થીઓને પ્રત્યક્ષ મૂર્ત વસ્તુઓ (કાંકરા, મણકા, માચીસની સળીઓ) દ્વારા સંખ્યાજ્ઞાન કરાવવું.',
        '૨. જૂથ કાર્ય અને રમતો દ્વારા સરવાળા-બાદબાકીની સંકલ્પના દ્રઢીકરણ કરવી.',
        '૩. નબળા વિદ્યાર્થીઓ માટે વિશિષ્ટ પુનરાવર્તન કાર્ય હાથ ધરવું.'
      ],
      sections: [
        {
          title: 'અધ્યયન નિષ્પત્તિઓ (Learning Outcomes)',
          items: [
            'M101: ૧ થી ૯૯ સુધીની સંખ્યાઓ બોલે છે, વાંચે છે અને સ્થાનકિંમત ઓળખે છે.',
            'M204: બે અંકની સંખ્યાઓના વદી વગરના અને વદીવાળા સરવાળા ગણે છે.',
            'M308: ભૌમિતિક આકારો (ચોરસ, લંબચોરસ, ત્રિકોણ, વર્તુળ) ની ધાર અને ખૂણા ઓળખે છે.'
          ]
        },
        {
          title: 'શૈક્ષણિક પ્રક્રિયા & TLM સાધનો',
          items: [
            'સાધન સામગ્રી: સંખ્યા કાર્ડ્સ, અબેકસ (મણકા ઘોડી), આકાર ચાર્ટ, ફ્લેશ કાર્ડ્સ.',
            'વર્ગખંડ પ્રવૃત્તિ: ગણતરીની રમત, બજાર રમત (ચલણી નોટોની ઓળખ).',
            'મૂલ્યાંકન પદ્ધતિ: રચનાત્મક મૂલ્યાંકન અને અવલોકન નોંધપોથી.'
          ]
        },
        {
          title: 'ગૃહકાર્ય અને વિશેષ પ્રોજેક્ટ',
          items: [
            'ઘરની વસ્તુઓ ગણીને યાદી બનાવવી.',
            'વિવિધ આકારો દોરીને મનપસંદ રંગ પૂરવા.'
          ]
        }
      ],
      notes: 'શાળાના સમયપત્રક મુજબ દર સપ્તાહે ૨ એકમોનું પુનરાવર્તન રાખવું.'
    }
  },
  {
    id: 'lp-science-std-6-8',
    title: 'વિજ્ઞાન & ટેકનોલોજી એકમવાર પ્રાયોગિક પાઠ આયોજન',
    gujaratiTitle: 'વિજ્ઞાન પ્રયોગ આધારિત વાર્ષિક આયોજન',
    description: 'ધોરણ ૬ થી ૮ વિજ્ઞાન માટે પદાર્થોનું અલગીકરણ, સજીવોમાં શ્વસન, વિદ્યુત પરિપથ અને પ્રકાશનું પરાવર્તન પ્રયોગો સાથેનું આયોજન.',
    category: 'lesson_plan',
    categoryLabel: 'પાઠ આયોજન',
    standard: 'ધોરણ ૬-૮',
    subject: 'વિજ્ઞાન',
    fileFormat: 'PDF',
    fileSize: '૩૨૦ KB',
    downloadCount: 289,
    tags: ['વિજ્ઞાન', 'પ્રયોગો', 'ધોરણ ૬-૮', 'વાર્ષિક આયોજન'],
    isFeatured: true,
    contentStructure: {
      header: 'વિજ્ઞાન અને ટેકનોલોજી - પ્રાયોગિક પાઠ આયોજન નમૂનો',
      subHeader: 'ઉચ્ચ પ્રાથમિક વિભાગ (ધોરણ ૬ થી ૮)',
      instructions: [
        '૧. દરેક એકમની શરૂઆત વૈજ્ઞાનિક કોયડા અથવા આશ્ચર્યજનક પ્રશ્નોત્તરીથી કરવી.',
        '૨. પ્રયોગશાળામાં વિદ્યાર્થીઓ જાતે પ્રયોગ કરે તેવી તક આપવી.',
        '૩. વૈજ્ઞાનિક દ્રષ્ટિકોણ અને પર્યાવરણ જાગૃતિ કેળવવી.'
      ],
      sections: [
        {
          title: 'મુખ્ય પ્રયોગો અને પ્રવૃત્તિઓ',
          items: [
            'પ્રયોગ ૧: પદાર્થોના ગુણધર્મો અને અલગીકરણની પદ્ધતિઓ (ગાળણ, બાષ્પીભવન).',
            'પ્રયોગ ૨: સાદા વિદ્યુત પરિપથનું નિર્માણ અને સુવાહક/અવાહક ચકાસણી.',
            'પ્રયોગ ૩: સૂક્ષ્મદર્શક યંત્ર વડે વનસ્પતિ કોષ અને ડુંગળીના પડનું નિરીક્ષણ.'
          ]
        },
        {
          title: 'અધ્યયન નિષ્પત્તિઓ (SC601 to SC812)',
          items: [
            'વૈજ્ઞાનિક પ્રક્રિયાઓનું અર્થઘટન કરે છે અને કારણો રજૂ કરે છે.',
            'પ્રાયોગિક સાધનોની સાચી ગોઠવણી અને સુરક્ષા નિયમોનું પાલન કરે છે.'
          ]
        }
      ],
      notes: 'દર માસના અંતે વિજ્ઞાન ક્વિઝ અને પ્રદર્શનનું આયોજન કરવું.'
    }
  },
  {
    id: 'lp-gujarati-std-1-8',
    title: 'ગુજરાતી ભાષા સજ્જતા, વ્યાકરણ & કાવ્યગાન આયોજન',
    gujaratiTitle: 'ગુજરાતી સાપ્તાહિક પાઠ આયોજન',
    description: 'ધોરણ ૧ થી ૮ માટે શ્રવણ, કથન, વાંચન, લેખન અને વ્યાકરણ (સંજ્ઞા, વિશેષણ, કાળ) નું ક્રમબદ્ધ આયોજન.',
    category: 'lesson_plan',
    categoryLabel: 'પાઠ આયોજન',
    standard: 'તમામ ધોરણ',
    subject: 'ગુજરાતી',
    fileFormat: 'Word',
    fileSize: '૧૯૫ KB',
    downloadCount: 215,
    tags: ['ગુજરાતી', 'ભાષા સજ્જતા', 'વાંચન લેખન', 'વ્યાકરણ'],
    contentStructure: {
      header: 'માતૃભાષા ગુજરાતી - ભાષા સજ્જતા અને સાહિત્યિક આયોજન',
      subHeader: 'પ્રાથમિક અને ઉચ્ચ પ્રાથમિક શાળા',
      instructions: [
        '૧. કાવ્યગાન રાગ સાથે કરાવવું અને વિદ્યાર્થીઓ પાસે મુખપાઠ કરાવવું.',
        '૨. શ્રુતલેખન અને જોડણી સુધારણા પર વિશેષ ભાર મૂકવો.'
      ],
      sections: [
        {
          title: 'ભાષા કૌશલ્યો (LSRW)',
          items: [
            'શ્રવણ & કથન: વાર્તાકથન, વક્તૃત્વ અને પરિસંવાદ.',
            'વાંચન: મુખર વાંચન અને મૌન વાંચન અર્થગ્રહણ સાથે.',
            'લેખન: નિબંધ લેખન, પત્ર લેખન, વિચાર વિસ્તાર અને વાર્તા લેખન.'
          ]
        },
        {
          title: 'વ્યાકરણ ઘટકો',
          items: [
            'શબ્દભંડોળ: સમાનાર્થી, વિરોધી, રૂઢિપ્રયોગો અને કહેવતો.',
            'વાક્ય રચના: કર્તરી, કર્મણી અને ભાવે પ્રયોગો.'
          ]
        }
      ]
    }
  },
  {
    id: 'lp-fln-mission-vidya',
    title: 'FLN (નિપુણ ભારત) - ૪૫ દિવસીય પાયાનું વાંચન-ગણન આયોજન',
    gujaratiTitle: 'FLN & મિશન વિદ્યા સ્પેશિયલ એક્શન પ્લાન',
    description: 'મૂળભૂત સાક્ષરતા અને સંખ્યા જ્ઞાન (FLN) અંતર્ગત નબળા વિદ્યાર્થીઓ માટે પરિણામલક્ષી ઉપચારાત્મક શિક્ષણ મોડેલ.',
    category: 'fln_remedial',
    categoryLabel: 'FLN & સુધારણા',
    standard: 'ધોરણ ૧-૫',
    subject: 'FLN / ઉપચારાત્મક',
    fileFormat: 'PDF',
    fileSize: '૪૧૦ KB',
    downloadCount: 480,
    tags: ['FLN', 'નિપુણ ભારત', 'મિશન વિદ્યા', 'ઉપચારાત્મક', 'વાંચન ગણન'],
    isFeatured: true,
    contentStructure: {
      header: 'FLN (Foundational Literacy and Numeracy) - નિપુણ ભારત મિશન',
      subHeader: '૪૫ દિવસીય ઉપચારાત્મક કાર્યક્રમ માળખું',
      instructions: [
        '૧. પ્રારંભિક નિદાન કસોટી (Baseline Test) લઈને સ્તર ૧, ૨ અને ૩ નક્કી કરવા.',
        '૨. દૈનિક ૧ કલાક ફાળવીને શબ્દ રમતો અને ગણન પદ્ધતિ શીખવવી.'
      ],
      sections: [
        {
          title: 'સાક્ષરતા લક્ષ્યો (Literacy Milestones)',
          items: [
            'સ્તર ૧: મૂળાક્ષરો અને સાદા અક્ષરોની દ્રષ્ટિ ઓળખ.',
            'સ્તર ૨: કાના-માત્રાવાળા શબ્દોનું અસ્ખલિત વાંચન (૩૫-૪૫ શબ્દ પ્રતિ મિનિટ).',
            'સ્તર ૩: ફકરા વાંચન અને પ્રશ્નોત્તરી અર્થગ્રહણ.'
          ]
        },
        {
          title: 'સંખ્યાજ્ઞાન લક્ષ્યો (Numeracy Milestones)',
          items: [
            '૧ થી ૫૦ અને ૫૧ થી ૧૦૦ અંક ઓળખ અને સરખામણી.',
            'સાદી વદી વગરની અને વદીવાળી ગણતરીઓ.',
            'રોજિંદા જીવનમાં નાણાં અને માપનની સમજ.'
          ]
        }
      ],
      notes: 'દર શનિવારે પ્રોગ્રેસ ટ્રેકર શીટમાં મૂલ્યાંકન અપડેટ કરવું.'
    }
  },

  // 2. Classroom Templates
  {
    id: 'tmpl-attendance-roster',
    title: 'માસિક વિદ્યાર્થી દૈનિક હાજરી પત્રક (A4 Printable Roster)',
    gujaratiTitle: 'વિદ્યાર્થી દૈનિક હાજરી રજિસ્ટર નમૂનો',
    description: 'ધોરણ ૧ થી ૮ માટે વિદ્યાર્થીઓના નામ, રોલ નંબર, જાતિ અને માસિક ૩૧ દિવસની હાજરી નોંધવા માટે પ્રિન્ટેબલ નમૂનો.',
    category: 'classroom_template',
    categoryLabel: 'વર્ગખંડ ટેમ્પ્લેટ્સ',
    standard: 'તમામ ધોરણ',
    fileFormat: 'Excel',
    fileSize: '૧૮૦ KB',
    downloadCount: 520,
    tags: ['હાજરી પત્રક', 'રજિસ્ટર', 'A4 પ્રિન્ટ', 'Excel', 'વર્ગખંડ'],
    isFeatured: true,
    contentStructure: {
      header: 'વિદ્યાર્થી માસિક દૈનિક હાજરી પત્રક - વર્ષ ૨૦૨૫-૨૬',
      subHeader: 'ધોરણ: _____ | વર્ગ: _____ | માસ: ____________',
      instructions: [
        '૧. હાજરી માટે (P) અને ગેરહાજરી માટે (A) નોંધ કરવી.',
        '૨. માસના અંતે કુલ ભરેલ દિવસો અને ટકાવારીની ગણતરી કરવી.'
      ],
      columns: ['અ.નં.', 'રોલ નં.', 'વિદ્યાર્થીનું પૂરું નામ', 'જાતિ', '૧', '૨', '૩', '૪', '૫', '...', '૩૧', 'કુલ હાજરી', '%'],
      sampleRows: [
        ['૧', '૧૦૧', 'પટેલ આરવ રાજેશભાઈ', 'કુમાર', 'P', 'P', 'P', 'P', 'P', '...', 'P', '૨૪/૨૫', '૯૬%'],
        ['૨', '૧૦૨', 'શાહ અનન્યા મિતેષભાઈ', 'કન્યા', 'P', 'P', 'P', 'A', 'P', '...', 'P', '૨૩/૨૫', '૯૨%'],
        ['૩', '૧૦૩', 'પરમાર દક્ષ કિરીટભાઈ', 'કુમાર', 'P', 'P', 'P', 'P', 'P', '...', 'P', '૨૫/૨૫', '૧૦૦%'],
        ['૪', '૧૦૪', 'જોષી પ્રાચી વિપુલભાઈ', 'કન્યા', 'P', 'P', 'P', 'P', 'P', '...', 'P', '૨૪/૨૫', '૯૬%']
      ],
      notes: 'A4 લેન્ડસ્કેપ ફોર્મેટમાં પ્રિન્ટ કરવા યોગ્ય.'
    }
  },
  {
    id: 'tmpl-class-timetable',
    title: 'વર્ગખંડ સાપ્તાહિક સમયપત્રક (Weekly Class Timetable A4)',
    gujaratiTitle: 'વર્ગખંડ સમયપત્રક / ટાઈમટેબલ ફોર્મેટ',
    description: 'પ્રાર્થના સભાથી માંડીને ૮ તાસ સુધીનું સાપ્તાહિક વિષય અને શિક્ષક વિતરણ સમયપત્રક.',
    category: 'classroom_template',
    categoryLabel: 'વર્ગખંડ ટેમ્પ્લેટ્સ',
    standard: 'તમામ ધોરણ',
    fileFormat: 'Print',
    fileSize: '૧૫૦ KB',
    downloadCount: 390,
    tags: ['સમયપત્રક', 'ટાઈમટેબલ', 'તાસ આયોજન', 'વર્ગખંડ'],
    contentStructure: {
      header: 'વર્ગખંડ સાપ્તાહિક સમયપત્રક - વર્ષ ૨૦૨૫-૨૬',
      subHeader: 'પ્રાથમિક શાળા | વર્ગ શિક્ષક: _______________',
      instructions: [
        '૧. વર્ગખંડના નોટિસ બોર્ડ પર લગાડવા માટે યોગ્ય.',
        '૨. દરેક તાસના વિષય અને સંબંધિત વિષય શિક્ષકનું નામ દર્શાવવું.'
      ],
      columns: ['વાર / તાસ', 'પ્રાર્થના (૧૦:૩૦-૧૧:૦૦)', 'તાસ ૧', 'તાસ ૨', 'તાસ ૩', 'રિસેસ (૧:૧૫-૧:૪૫)', 'તાસ ૪', 'તાસ ૫', 'તાસ ૬'],
      sampleRows: [
        ['સોમવાર', 'સામૂહિક પ્રાર્થના / યોગ', 'ગુજરાતી', 'ગણિત', 'પર્યાવરણ / વિજ્ઞાન', 'ભોજન', 'અંગ્રેજી', 'સામાજિક વિજ્ઞાન', 'ચિત્ર / રમત'],
        ['મંગળવાર', 'સામૂહિક પ્રાર્થના / સમાચાર', 'ગણિત', 'ગુજરાતી', 'વિજ્ઞાન', 'ભોજન', 'અંગ્રેજી', 'હિન્દી / સંસ્કૃત', 'પુસ્તકાલય'],
        ['બુધવાર', 'સામૂહિક પ્રાર્થના / સુવિચાર', 'વિજ્ઞાન', 'ગણિત', 'સામાજિક વિજ્ઞાન', 'ભોજન', 'ગુજરાતી', 'અંગ્રેજી', 'કમ્પ્યુટર'],
        ['ગુરુવાર', 'સામૂહિક પ્રાર્થના / ક્વિઝ', 'ગણિત', 'ગુજરાતી', 'અંગ્રેજી', 'ભોજન', 'વિજ્ઞાન', 'સામાજિક વિજ્ઞાન', 'સંગીત'],
        ['શુક્રવાર', 'સામૂહિક પ્રાર્થના / બાળસભા', 'સામાજિક વિજ્ઞાન', 'વિજ્ઞાન', 'ગણિત', 'ભોજન', 'ગુજરાતી', 'અંગ્રેજી', 'કાર્યાનુભવ'],
        ['શનિવાર', 'વિશેષ પ્રાર્થના / કસરત', 'ગુજરાતી', 'ગણિત', 'બાળસભા / એકમ કસોટી', '---', '---', '---', '---']
      ]
    }
  },
  {
    id: 'tmpl-homework-tracker',
    title: 'ગૃહકાર્ય અને સ્વાધ્યાય કાર્ય ચકાસણી શીટ (Homework Tracker)',
    gujaratiTitle: 'ગૃહકાર્ય મૂલ્યાંકન & ફોલોઅપ પત્રક',
    description: 'વિદ્યાર્થીઓના દૈનિક હોમવર્ક, પ્રોજેક્ટ કાર્ય અને લેખન નિયમિતતાનું માસિક ટ્રેકિંગ પત્રક.',
    category: 'classroom_template',
    categoryLabel: 'વર્ગખંડ ટેમ્પ્લેટ્સ',
    standard: 'ધોરણ ૩-૮',
    fileFormat: 'Excel',
    fileSize: '૧૬૫ KB',
    downloadCount: 230,
    tags: ['ગૃહકાર્ય', 'હોમવર્ક', 'સ્વાધ્યાય', 'ટ્રેકિંગ'],
    contentStructure: {
      header: 'ગૃહકાર્ય અને સ્વાધ્યાય નિયમિતતા મૂલ્યાંકન પત્રક',
      subHeader: 'વિષય: ____________ | ધોરણ: _____',
      instructions: [
        '૧. નિયમિત ગૃહકાર્ય પૂર્ણ કરનાર માટે (✓), અધૂરું હોય તો (½) અને ન કર્યું હોય તો (✗) ચિહ્ન કરવું.'
      ],
      columns: ['રોલ નં.', 'નામ', 'સોમ', 'મંગળ', 'બુધ', 'ગુરુ', 'શુક્ર', 'શનિ', 'ગ્રેડ', 'વાલી સહી'],
      sampleRows: [
        ['૧', 'પટેલ આરવ', '✓', '✓', '✓', '✓', '✓', '✓', 'A+', '_____'],
        ['૨', 'શાહ અનન્યા', '✓', '✓', '½', '✓', '✓', '✓', 'A', '_____'],
        ['૩', 'પરમાર દક્ષ', '✓', '✓', '✓', '✓', '✓', '✓', 'A+', '_____']
      ]
    }
  },

  // 3. Admin & Registers
  {
    id: 'tmpl-smc-register',
    title: 'SMC માસિક બેઠક કાર્યસૂચિ અને ઠરાવ નોંધણી પત્રક',
    gujaratiTitle: 'SMC મીટિંગ રજિસ્ટર & ઠરાવ ફોર્મેટ',
    description: 'શાળા વ્યવસ્થાપન સમિતિ (SMC) ની માસિક બેઠકનું આયોજન, હાજરી પત્રક અને સત્તાવાર ઠરાવ નોંધણી માળખું.',
    category: 'admin_register',
    categoryLabel: 'વહીવટી રજિસ્ટર',
    standard: 'તમામ ધોરણ',
    fileFormat: 'PDF',
    fileSize: '૨૭૫ KB',
    downloadCount: 410,
    tags: ['SMC', 'સમિતિ', 'ઠરાવ', 'મીટિંગ રજિસ્ટર', 'ઓડિટ'],
    isFeatured: true,
    contentStructure: {
      header: 'શાળા વ્યવસ્થાપન સમિતિ (SMC) માસિક બેઠક ઠરાવ પત્રક',
      subHeader: 'બેઠક ક્રમાંક: _____ | તારીખ: ____________ | સમય: ________',
      instructions: [
        '૧. બેઠકની પૂર્વ જાણ SMC સભ્યોને ઓછામાં ઓછા ૩ દિવસ પહેલાં કરવી.',
        '૨. દરેક ઠરાવ પર અધ્યક્ષ, સચિવ અને હાજર સભ્યોની સહી લેવી.'
      ],
      sections: [
        {
          title: 'બેઠકની મુખ્ય કાર્યસૂચિ (Agenda)',
          items: [
            '૧. ગત માસની બેઠકની કાર્યવાહીનું વાંચન અને બહાલી આપવી.',
            '૨. શાળામાં વિદ્યાર્થીઓની હાજરી અને PM પોષણ (મધ્યાહ્ન ભોજન) ગુણવત્તા સમીક્ષા.',
            '૩. કોમ્પોઝીટ સ્કૂલ ગ્રાન્ટ અને ભૌતિક સુવિધા સમારકામ ખર્ચની ચર્ચા.',
            '૪. શાળા પ્રવેશોત્સવ, કન્યા કેળવણી અને સાંસ્કૃતિક કાર્યક્રમોનું આયોજન.'
          ]
        },
        {
          title: 'પસાર થયેલા ઠરાવો (Resolutions Passed)',
          items: [
            'ઠરાવ ૧: સર્વાનુમતે નક્કી થયા મુજબ શાળાના પીવાના પાણીના ફિલ્ટરનું સમારકામ મંજૂર કરવું.',
            'ઠરાવ ૨: અનિયમિત રહેતા વિદ્યાર્થીઓના વાલીઓનો રૂબરૂ સંપર્ક કરવા સમિતિ સભ્યોને જવાબદારી સોંપવી.'
          ]
        }
      ],
      columns: ['અ.નં.', 'સભ્યનું નામ', 'હોદ્દો', 'મોબાઇલ નંબર', 'સહી'],
      sampleRows: [
        ['૧', 'શ્રી રમેશભાઈ પટેલ', 'અધ્યક્ષ (વાલી)', '9876543210', '__________'],
        ['૨', 'મુખ્ય શિક્ષકશ્રી', 'સચિવ', '9876500000', '__________'],
        ['૩', 'શ્રીમતી ગીતાબેન શાહ', 'મહિલા સભ્ય (વાલી)', '9876511111', '__________'],
        ['૪', 'શ્રી સરપંચશ્રી / પંચાયત સભ્ય', 'સ્થાનિક સત્તામંડળ', '9876522222', '__________']
      ]
    }
  },
  {
    id: 'tmpl-library-register',
    title: 'પુસ્તકાલય પુસ્તક ઇશ્યુ - રીટર્ન રજિસ્ટર (Library Form)',
    gujaratiTitle: 'લાઇબ્રેરી બુક ઇશ્યુ પત્રક',
    description: 'શાળા પુસ્તકાલયના પુસ્તકો વિદ્યાર્થીઓ અને શિક્ષકોને આપવા અને જમા લેવા માટેનું સત્તાવાર રજિસ્ટર.',
    category: 'admin_register',
    categoryLabel: 'વહીવટી રજિસ્ટર',
    standard: 'તમામ ધોરણ',
    fileFormat: 'Excel',
    fileSize: '૧૭૫ KB',
    downloadCount: 195,
    tags: ['પુસ્તકાલય', 'લાઇબ્રેરી', 'વાંચન', 'રજિસ્ટર'],
    contentStructure: {
      header: 'શાળા પુસ્તકાલય પુસ્તક ઇશ્યુ & રીટર્ન રજિસ્ટર',
      subHeader: 'સત્ર: ૨૦૨૫-૨૬',
      instructions: [
        '૧. પુસ્તક ઇશ્યુ કરતી વખતે પુસ્તક ક્રમાંક અને શીર્ષક સાચું લખવું.',
        '૨. નિયત ૭ દિવસમાં પુસ્તક પરત જમા કરાવવું.'
      ],
      columns: ['અ.નં.', 'તારીખ', 'વિદ્યાર્થી / શિક્ષકનું નામ', 'ધોરણ', 'પુસ્તક ક્રમ', 'પુસ્તકનું શીર્ષક', 'ઇશ્યુ તારીખ', 'પરત તારીખ', 'સહી'],
      sampleRows: [
        ['૧', '૧૦/૦૮/૨૦૨૫', 'પટેલ આરવ', 'ધોરણ ૬', 'BK-204', 'ગાંધીજીની સત્યના પ્રયોગો', '૧૦/૦૮', '૧૭/૦૮', '_____'],
        ['૨', '૧૨/૦૮/૨૦૨૫', 'શાહ અનન્યા', 'ધોરણ ૭', 'BK-115', 'વિક્રમ સારાભાઈ જીવન ચરિત્ર', '૧૨/૦૮', '૧૯/૦૮', '_____']
      ]
    }
  },
  {
    id: 'tmpl-parent-tour-consent',
    title: 'શાળા શૈક્ષણિક પ્રવાસ / પર્યટન વાલી સંમતિપત્રક',
    gujaratiTitle: 'પ્રવાસ વાલી સંમતિપત્રક ફોર્મેટ (A4 Print)',
    description: 'એક દિવસીય કે બહુ-દિવસીય શૈક્ષણિક પ્રવાસ માટે વાલી પાસેથી લેવા માટેનું કાનૂની સંમતિપત્રક.',
    category: 'admin_register',
    categoryLabel: 'વહીવટી રજિસ્ટર',
    standard: 'તમામ ધોરણ',
    fileFormat: 'Print',
    fileSize: '૧૪૦ KB',
    downloadCount: 310,
    tags: ['પ્રવાસ', 'પર્યટન', 'સંમતિપત્રક', 'વાલી પત્રક'],
    contentStructure: {
      header: 'શૈક્ષણિક પ્રવાસ / મુલાકાત વાલી સંમતિપત્રક',
      subHeader: 'પ્રાથમિક શાળા પ્રવાસ સમિતિ',
      instructions: [
        '૧. પ્રવાસમાં જોડાતા દરેક બાળકના વાલીની સહી ફરજિયાત લેવી.'
      ],
      sections: [
        {
          title: 'પ્રવાસ વિગત',
          items: [
            'પ્રવાસ સ્થળ: ___________________________',
            'પ્રવાસ તારીખ: ____________ થી ____________',
            'અંદાજિત ખર્ચ (પ્રતિ વિદ્યાર્થી): ₹ _________'
          ]
        },
        {
          title: 'વાલીનું બાંયધરી પત્રક (Consent Declaration)',
          items: [
            'હું નીચે સહી કરનાર વાલી ___________________________ મારા પુત્ર / પુત્રી ___________________________ (ધોરણ: _____) ને શાળા દ્વારા યોજાનાર શૈક્ષણિક પ્રવાસમાં મોકલવા રાજીખુશીથી સંમતિ આપું છું.',
            'પ્રવાસ દરમિયાન મારો પાલ્ય શિક્ષકોની તમામ સૂચનાઓનું ચુસ્ત પાલન કરશે.',
            'વાલીનો મોબાઇલ નંબર: ________________________',
            'વાલીની સહી: ________________________ | તારીખ: ____________'
          ]
        }
      ]
    }
  },
  {
    id: 'tmpl-scholarship-verification',
    title: 'સરકારી શિષ્યવૃત્તિ & ગણવેશ સહાય વિતરણ ચકાસણી પત્રક',
    gujaratiTitle: 'શિષ્યવૃત્તિ & ગણવેશ વિતરણ પત્રક',
    description: 'SC, ST, OBC, EBC અને કન્યા શિષ્યવૃત્તિ તથા મફત ગણવેશ સહાય જમા કરવા માટેનું બેંક લિંક્ડ પત્રક.',
    category: 'admin_register',
    categoryLabel: 'વહીવટી રજિસ્ટર',
    standard: 'તમામ ધોરણ',
    fileFormat: 'Excel',
    fileSize: '૨૧૦ KB',
    downloadCount: 265,
    tags: ['શિષ્યવૃત્તિ', 'ગણવેશ', 'સહાય પત્રક', 'DBT', 'બેંક ખાતું'],
    contentStructure: {
      header: 'વિદ્યાર્થી શિષ્યવૃત્તિ અને ગણવેશ સહાય વિતરણ પત્રક',
      subHeader: 'સત્ર: ૨૦૨૫-૨૬ | DBT / બેંક ખાતામાં જમા',
      instructions: [
        '૧. આધાર લિંક્ડ બેંક ખાતા નંબર અને IFSC કોડ ચકાસીને જ નોંધવું.'
      ],
      columns: ['અ.નં.', 'વિદ્યાર્થીનું નામ', 'જાતિ / કેટેગરી', 'ધોરણ', 'બેંકનું નામ', 'ખાતા નંબર', 'IFSC કોડ', 'સહાય રકમ (₹)', 'વિદ્યાર્થી / વાલી સહી'],
      sampleRows: [
        ['૧', 'પરમાર દક્ષ કિરીટભાઈ', 'SC', 'ધોરણ ૫', 'બેંક ઓફ બરોડા', '123456789012', 'BARB0VILLAG', '૧૦૦૦/-', '__________'],
        ['૨', 'જોષી પ્રાચી વિપુલભાઈ', 'કન્યા', 'ધોરણ ૬', 'સ્ટેટ બેંક ઓફ ઇન્ડિયા', '987654321098', 'SBIN0001234', '૧૨૦૦/-', '__________']
      ]
    }
  }
];

export const DownloadableResourcesView: React.FC = () => {
  const {
    schoolProfile,
    teacherProfile,
    uploadedTemplates,
    toggleFavoriteTemplate,
    deleteUploadedTemplate,
    setActiveTab,
    setActiveSubFeature
  } = useApp();

  const [resources, setResources] = useState<DownloadableResource[]>(initialDownloadableResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStandard, setSelectedStandard] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [previewResource, setPreviewResource] = useState<DownloadableResource | null>(null);
  const [previewUploadedTemplate, setPreviewUploadedTemplate] = useState<TeacherUploadedTemplate | null>(null);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState<PreviewDocType | undefined>(undefined);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customTeacherName, setCustomTeacherName] = useState(teacherProfile.name || 'વર્ગ શિક્ષક');
  const [customSchoolName, setCustomSchoolName] = useState(schoolProfile.schoolName || 'પ્રાથમિક શાળા');
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);
  const [modalActiveTab, setModalActiveTab] = useState<'sheet' | 'reviews'>('sheet');

  // Filtered resources
  const filteredResources = useMemo(() => {
    if (selectedCategory === 'my_uploads') return [];

    return resources.filter(res => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = res.title.toLowerCase().includes(q) || res.gujaratiTitle.toLowerCase().includes(q);
        const matchesDesc = res.description.toLowerCase().includes(q);
        const matchesTags = res.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
      }

      // Category
      if (selectedCategory !== 'all' && res.category !== selectedCategory) {
        if (selectedCategory === 'bookmarked') {
          if (!bookmarkedIds.includes(res.id)) return false;
        } else {
          return false;
        }
      }

      // Standard
      if (selectedStandard !== 'all') {
        if (res.standard !== 'તમામ ધોરણ' && res.standard !== selectedStandard) return false;
      }

      // Subject
      if (selectedSubject !== 'all') {
        if (res.subject && res.subject !== selectedSubject) return false;
      }

      return true;
    });
  }, [resources, searchQuery, selectedCategory, selectedStandard, selectedSubject, bookmarkedIds]);

  // Filtered uploaded templates
  const filteredUploadedTemplates = useMemo(() => {
    return uploadedTemplates.filter(tpl => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tpl.title.toLowerCase().includes(q);
        const matchesDesc = (tpl.description || '').toLowerCase().includes(q);
        const matchesTags = tpl.tags.some(t => t.toLowerCase().includes(q));
        const matchesFilename = tpl.fileName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesTags && !matchesFilename) return false;
      }

      // Category
      if (selectedCategory !== 'all' && selectedCategory !== 'my_uploads') {
        if (selectedCategory === 'bookmarked') {
          if (!tpl.isFavorite) return false;
        } else if (tpl.category !== selectedCategory) {
          return false;
        }
      }

      // Standard
      if (selectedStandard !== 'all') {
        if (tpl.standard !== 'તમામ ધોરણ' && tpl.standard !== selectedStandard) return false;
      }

      // Subject
      if (selectedSubject !== 'all') {
        if (tpl.subject && tpl.subject !== 'સામાન્ય' && tpl.subject !== selectedSubject) return false;
      }

      return true;
    });
  }, [uploadedTemplates, searchQuery, selectedCategory, selectedStandard, selectedSubject]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDownload = (resource: DownloadableResource, format: string) => {
    // Increase download count
    setResources(prev =>
      prev.map(r => (r.id === resource.id ? { ...r, downloadCount: r.downloadCount + 1 } : r))
    );

    // Create file content and trigger browser download
    let content = `${customSchoolName}\n`;
    content += `${resource.contentStructure.header}\n`;
    if (resource.contentStructure.subHeader) content += `${resource.contentStructure.subHeader}\n`;
    content += `શિક્ષક: ${customTeacherName} | તારીખ: ${new Date().toLocaleDateString('gu-IN')}\n\n`;
    content += `વિગત / માર્ગદર્શિકા:\n`;
    resource.contentStructure.instructions.forEach(ins => {
      content += `${ins}\n`;
    });
    content += `\n`;

    if (resource.contentStructure.sections) {
      resource.contentStructure.sections.forEach(sec => {
        content += `[${sec.title}]\n`;
        sec.items.forEach(it => {
          content += ` - ${it}\n`;
        });
        content += `\n`;
      });
    }

    if (resource.contentStructure.columns && resource.contentStructure.sampleRows) {
      content += `કોષ્ટક માળખું:\n`;
      content += resource.contentStructure.columns.join(' | ') + '\n';
      content += '------------------------------------------------------------\n';
      resource.contentStructure.sampleRows.forEach(row => {
        content += row.join(' | ') + '\n';
      });
      content += `\n`;
    }

    if (resource.contentStructure.notes) {
      content += `નોંધ: ${resource.contentStructure.notes}\n`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.gujaratiTitle.replace(/\s+/g, '_')}_${format.toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccessToast(`'${resource.gujaratiTitle}' સફળતાપૂર્વક ડાઉનલોડ થયું!`);
    setTimeout(() => setDownloadSuccessToast(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = (resource: DownloadableResource) => {
    let content = `${customSchoolName}\n${resource.contentStructure.header}\n\n`;
    resource.contentStructure.instructions.forEach(i => content += `${i}\n`);
    if (resource.contentStructure.sections) {
      resource.contentStructure.sections.forEach(s => {
        content += `\n${s.title}:\n` + s.items.map(x => `• ${x}`).join('\n');
      });
    }
    navigator.clipboard.writeText(content);
    setCopiedId(resource.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalDownloadsSum = useMemo(() => {
    return resources.reduce((sum, r) => sum + r.downloadCount, 0);
  }, [resources]);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {downloadSuccessToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-900/90 text-white border border-emerald-500 px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-semibold animate-fade-in backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-orange-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center space-x-2 bg-amber-500/30 border border-amber-300/30 px-3 py-1 rounded-full text-xs font-bold text-amber-200">
              <FolderDown className="w-3.5 h-3.5" />
              <span>પ્રાથમિક & ઉચ્ચ પ્રાથમિક શાળા સાધન ભંડાર</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              ડાઉનલોડેબલ રિસોર્સિસ & ક્લાસરૂમ ટેમ્પ્લેટ્સ
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              તૈયાર પાઠ આયોજન (Lesson Plans), વર્ગખંડ હાજરી & સમયપત્રક નમૂનાઓ, SMC ઠરાવ પત્રકો અને FLN સાહિત્ય ડાઉનલોડ કરો તેમજ તમારા પોતાના કસ્ટમ PDF / Image ટેમ્પ્લેટ્સ અપલોડ કરી સાચવો.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (resources.length > 0) {
                  setSelectedPdfDoc({ type: 'downloadable_resource', resource: resources[0] });
                }
                setIsPdfViewerOpen(true);
              }}
              className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-lg border border-slate-700 transition-all cursor-pointer transform active:scale-95"
              title="બિલ્ટ-ઇન PDF પ્રિવ્યૂઅરમાં સાધનો જુઓ"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>PDF પ્રિવ્યૂઅર (iframe Viewer)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsUploaderOpen(true)}
              className="px-4 py-3 bg-white hover:bg-amber-50 text-amber-900 font-bold rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all cursor-pointer transform active:scale-95"
            >
              <Upload className="w-4 h-4 text-rose-600" />
              <span>+ ટેમ્પ્લેટ અપલોડ કરો (PDF/Image)</span>
            </button>

            <div className="flex items-center justify-around gap-3 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl">
              <div className="text-center px-2">
                <span className="block text-xl font-black font-mono text-amber-200">{resources.length + uploadedTemplates.length}</span>
                <span className="text-[10px] text-amber-100 font-medium">કુલ સાધનો</span>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center px-2">
                <span className="block text-xl font-black font-mono text-rose-300">{uploadedTemplates.length}</span>
                <span className="text-[10px] text-amber-100 font-medium">મારા અપલોડ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Search & Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search & Top Action */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ટેમ્પ્લેટ, પાઠ આયોજન કે અપલોડેડ ફાઇલનું નામ શોધો..."
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Secondary Dropdown Filters & Upload trigger */}
          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {/* Standard Filter */}
            <select
              value={selectedStandard}
              onChange={e => setSelectedStandard(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-600"
            >
              <option value="all">તમામ ધોરણ (All Standards)</option>
              <option value="ધોરણ ૧-૫">ધોરણ ૧-૫ (Primary)</option>
              <option value="ધોરણ ૬-૮">ધોરણ ૬-૮ (Upper Primary)</option>
              <option value="ધોરણ ૩-૮">ધોરણ ૩-૮</option>
            </select>

            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-600"
            >
              <option value="all">તમામ વિષય (All Subjects)</option>
              <option value="ગણિત">ગણિત (Maths)</option>
              <option value="વિજ્ઞાન">વિજ્ઞાન (Science)</option>
              <option value="ગુજરાતી">ગુજરાતી (Gujarati)</option>
              <option value="FLN / ઉપચારાત્મક">FLN / ઉપચારાત્મક</option>
            </select>

            <button
              type="button"
              onClick={() => setIsUploaderOpen(true)}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-rose-600" />
              <span>અપલોડ</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-slate-100 pb-1 text-xs">
          {[
            { id: 'all', label: 'બધા સાધનો (All)', count: resources.length + uploadedTemplates.length },
            { id: 'my_uploads', label: `મારા અપલોડ્સ (${uploadedTemplates.length})`, count: uploadedTemplates.length, highlight: true },
            { id: 'lesson_plan', label: 'પાઠ આયોજન (Lesson Plans)', count: resources.filter(r => r.category === 'lesson_plan').length + uploadedTemplates.filter(t => t.category === 'lesson_plan').length },
            { id: 'classroom_template', label: 'વર્ગખંડ ટેમ્પ્લેટ્સ (Classroom)', count: resources.filter(r => r.category === 'classroom_template').length + uploadedTemplates.filter(t => t.category === 'classroom_template').length },
            { id: 'admin_register', label: 'વહીવટી રજિસ્ટર (Admin/SMC)', count: resources.filter(r => r.category === 'admin_register').length + uploadedTemplates.filter(t => t.category === 'admin_register').length },
            { id: 'fln_remedial', label: 'FLN & સુધારણા કાર્ય', count: resources.filter(r => r.category === 'fln_remedial').length + uploadedTemplates.filter(t => t.category === 'fln_remedial').length },
            { id: 'bookmarked', label: `સેવ કરેલા (${bookmarkedIds.length + uploadedTemplates.filter(t => t.isFavorite).length})`, count: bookmarkedIds.length + uploadedTemplates.filter(t => t.isFavorite).length }
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedCategory === cat.id
                  ? cat.highlight
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-amber-600 text-white shadow-xs'
                  : cat.highlight
                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.highlight && <Upload className="w-3 h-3 text-rose-500 mr-0.5" />}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Teacher-Uploaded Templates Section */}
      {filteredUploadedTemplates.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-sm font-bold text-slate-900">
                મારા અપલોડ કરેલા વર્ગખંડ ટેમ્પ્લેટ્સ (Teacher Uploaded Documents)
              </h2>
              <span className="text-xs font-mono bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                {filteredUploadedTemplates.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsUploaderOpen(true)}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>બીજું ટેમ્પ્લેટ અપલોડ કરો</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUploadedTemplates.map(tpl => {
              const isPdf = tpl.fileType === 'pdf';
              const isImage = tpl.fileType === 'image';

              return (
                <div
                  key={tpl.id}
                  onClick={() => setPreviewUploadedTemplate(tpl)}
                  className="bg-white border-2 border-rose-100 hover:border-rose-300 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Custom upload badge */}
                  <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                    કસ્ટમ અપલોડ
                  </div>

                  <div>
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isPdf ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {isPdf ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                            {tpl.categoryLabel}
                          </span>
                          <span className="text-xs font-semibold text-slate-700">
                            {tpl.standard} • {tpl.subject}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          toggleFavoriteTemplate(tpl.id);
                        }}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer mr-6 ${
                          tpl.isFavorite
                            ? 'bg-amber-50 border-amber-300 text-amber-600'
                            : 'border-slate-200 text-slate-400 hover:text-slate-600 bg-white'
                        }`}
                        title={tpl.isFavorite ? 'મનપસંદ યાદીમાં છે' : 'મનપસંદ કરો'}
                      >
                        <Bookmark className={`w-4 h-4 ${tpl.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Image Thumbnail Preview if available */}
                    {isImage && (
                      <div className="w-full h-32 bg-slate-50 rounded-xl mb-3 overflow-hidden border border-slate-200 flex items-center justify-center relative">
                        <img
                          src={tpl.dataUrl}
                          alt={tpl.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                          {tpl.fileSize}
                        </span>
                      </div>
                    )}

                    {/* Title and Description */}
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-rose-700 transition-colors leading-snug line-clamp-2">
                      {tpl.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {tpl.description}
                    </p>

                    {/* Tags and Star Rating */}
                    <div className="flex items-center justify-between gap-2 mt-2.5 flex-wrap">
                      <div className="flex flex-wrap gap-1">
                        {tpl.tags.map((tag, idx) => (
                          <span key={idx} className="bg-rose-50 text-rose-700 text-[10px] font-medium px-2 py-0.5 rounded-md border border-rose-100">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <StarRatingBadge
                        resourceId={tpl.id}
                        baseRating={5.0}
                        baseReviewCount={2}
                        onClick={e => {
                          e.stopPropagation();
                          setPreviewUploadedTemplate(tpl);
                        }}
                      />
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-mono">
                      <span>{tpl.uploadedAt}</span>
                      <span>•</span>
                      <span>{tpl.fileSize}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedPdfDoc({ type: 'uploaded_template', template: tpl });
                          setIsPdfViewerOpen(true);
                        }}
                        className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                        title="PDF પ્રિવ્યૂઅરમાં જુઓ"
                      >
                        <Eye className="w-3 h-3 text-amber-700" />
                        <span>PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          deleteUploadedTemplate(tpl.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="ડિલીટ કરો"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setPreviewUploadedTemplate(tpl);
                        }}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-xs transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>ખોલો / પ્રિન્ટ</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Built-in System Resources Header if viewing mixed */}
      {filteredResources.length > 0 && selectedCategory !== 'my_uploads' && (
        <div className="pt-2">
          {filteredUploadedTemplates.length > 0 && (
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>સિસ્ટમ ડાઉનલોડેબલ ફોર્મેટ્સ & પાઠ આયોજનો</span>
            </h2>
          )}

          {/* Resources Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map(res => {
              const isSaved = bookmarkedIds.includes(res.id);
              const isExcel = res.fileFormat === 'Excel';
              const isPdf = res.fileFormat === 'PDF';

              return (
                <div
                  key={res.id}
                  onClick={() => setPreviewResource(res)}
                  className="bg-white border border-slate-200 hover:border-amber-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Card Top Row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isExcel
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPdf
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isExcel ? <FileSpreadsheet className="w-4 h-4" /> : isPdf ? <FileText className="w-4 h-4" /> : <Printer className="w-4 h-4" />}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            {res.categoryLabel}
                          </span>
                          <span className="text-xs font-semibold text-slate-700">
                            {res.standard} {res.subject ? `• ${res.subject}` : ''}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={e => toggleBookmark(res.id, e)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isSaved
                            ? 'bg-amber-50 border-amber-300 text-amber-600'
                            : 'border-slate-200 text-slate-400 hover:text-slate-600 bg-white'
                        }`}
                        title={isSaved ? 'સેવ થયેલું છે' : 'સેવ કરો'}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Title and Description */}
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition-colors leading-snug line-clamp-2">
                      {res.gujaratiTitle}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {res.description}
                    </p>

                    {/* Tags & Star Rating Row */}
                    <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
                      <div className="flex flex-wrap gap-1">
                        {res.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-md">
                            #{tag}
                          </span>
                        ))}
                        {res.tags.length > 2 && (
                          <span className="text-[10px] text-slate-400 self-center">
                            +{res.tags.length - 2}
                          </span>
                        )}
                      </div>

                      <StarRatingBadge
                        resourceId={res.id}
                        baseRating={res.baseRating || 4.9}
                        baseReviewCount={res.baseReviewCount || 20}
                        onClick={e => {
                          e.stopPropagation();
                          setPreviewResource(res);
                          setModalActiveTab('reviews');
                        }}
                      />
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
                      <span className="flex items-center">
                        <Download className="w-3 h-3 mr-1 text-slate-400" />
                        {res.downloadCount}
                      </span>
                      <span>•</span>
                      <span>{res.fileSize}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedPdfDoc({ type: 'downloadable_resource', resource: res });
                          setIsPdfViewerOpen(true);
                        }}
                        className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                        title="PDF પ્રિવ્યૂઅરમાં જુઓ"
                      >
                        <Eye className="w-3 h-3 text-amber-700" />
                        <span>PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setPreviewResource(res);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>જોવો</span>
                      </button>

                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleDownload(res, res.fileFormat);
                        }}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-xs transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>ડાઉનલોડ</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredResources.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">કોઈ સાધન મળ્યું નથી</h3>
          <p className="text-xs text-slate-500">
            શોધ શબ્દ બદલીને જુઓ અથવા કેટેગરી ફિલ્ટર્સ રીસેટ કરો.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedStandard('all');
              setSelectedSubject('all');
            }}
            className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-amber-700"
          >
            બધા ફિલ્ટર્સ સાફ કરો
          </button>
        </div>
      )}

      {/* FULL DOCUMENT PREVIEW & CUSTOMIZER MODAL */}
      {previewResource && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    {previewResource.gujaratiTitle}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {previewResource.categoryLabel} • {previewResource.standard} • ફોર્મેટ: {previewResource.fileFormat}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPdfDoc({ type: 'downloadable_resource', resource: previewResource });
                    setIsPdfViewerOpen(true);
                  }}
                  className="p-2 text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                  title="બિલ્ટ-ઇન PDF પ્રિવ્યૂઅરમાં જુઓ"
                >
                  <Eye className="w-4 h-4 text-amber-700" />
                  <span className="hidden sm:inline">PDF પ્રિવ્યૂઅર</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyText(previewResource)}
                  className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 text-xs font-semibold flex items-center space-x-1"
                  title="ટેક્સ્ટ કોપી કરો"
                >
                  {copiedId === previewResource.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span className="hidden sm:inline">{copiedId === previewResource.id ? 'કોપી થયું!' : 'કોપી'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-2 text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 text-xs font-semibold flex items-center space-x-1"
                  title="પ્રિન્ટ કરો"
                >
                  <Printer className="w-4 h-4 text-amber-700" />
                  <span className="hidden sm:inline">A4 પ્રિન્ટ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewResource(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center px-4 sm:px-6 bg-slate-50 border-b border-slate-200 gap-2">
              <button
                type="button"
                onClick={() => setModalActiveTab('sheet')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  modalActiveTab === 'sheet'
                    ? 'border-amber-600 text-amber-800 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>દસ્તાવેજ પ્રિવ્યૂ & A4 પ્રિન્ટ</span>
              </button>

              <button
                type="button"
                onClick={() => setModalActiveTab('reviews')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  modalActiveTab === 'reviews'
                    ? 'border-amber-600 text-amber-800 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>શિક્ષક સમીક્ષાઓ & રેટિંગ</span>
              </button>
            </div>

            {/* Modal Body & Printable Layout or Reviews */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-100/60">
              
              {modalActiveTab === 'reviews' ? (
                <div className="w-full max-w-3xl mx-auto">
                  <ResourceReviewsSection
                    resourceId={previewResource.id}
                    resourceTitle={previewResource.gujaratiTitle}
                    baseRating={previewResource.baseRating || 4.9}
                    baseReviewCount={previewResource.baseReviewCount || 20}
                  />
                </div>
              ) : (
                <>
                  {/* Live Document Customization Inputs Bar */}
                  <div className="bg-white border border-amber-200/80 p-3.5 rounded-2xl shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">શાળાનું નામ (School Name on Header):</label>
                      <input
                        type="text"
                        value={customSchoolName}
                        onChange={e => setCustomSchoolName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">શિક્ષક / રજૂકર્તાનું નામ (Teacher Name):</label>
                      <input
                        type="text"
                        value={customTeacherName}
                        onChange={e => setCustomTeacherName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Formatted Sheet (Print Ready Look) */}
                  <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 print:border-none print:shadow-none print:p-0">
                    
                    {/* Official Sheet Header */}
                    <div className="text-center pb-4 border-b-2 border-slate-800 space-y-1">
                      <h1 className="text-lg sm:text-xl font-black text-slate-900 uppercase">
                        {customSchoolName}
                      </h1>
                      <p className="text-xs text-slate-600">
                        તાલુકો: {schoolProfile.taluka || 'ગાંધીનગર'} | જિલ્લો: {schoolProfile.district || 'ગાંધીનગર'} | UDISE: {schoolProfile.udiseCode || '24070100101'}
                      </p>
                      <h2 className="text-sm font-bold text-amber-900 bg-amber-50 py-1 px-3 rounded-md inline-block mt-2 border border-amber-200">
                        {previewResource.contentStructure.header}
                      </h2>
                      {previewResource.contentStructure.subHeader && (
                        <p className="text-xs font-semibold text-slate-700">
                          {previewResource.contentStructure.subHeader}
                        </p>
                      )}
                      <div className="flex justify-between text-[11px] text-slate-500 pt-2 font-medium">
                        <span>તારીખ: {new Date().toLocaleDateString('gu-IN')}</span>
                        <span>વર્ગ શિક્ષક: {customTeacherName}</span>
                        <span>શૈક્ષણિક વર્ષ: {schoolProfile.academicYear || '૨૦૨૫-૨૬'}</span>
                      </div>
                    </div>

                    {/* Instructions Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 text-xs text-slate-700">
                      <span className="font-bold text-slate-900 block flex items-center space-x-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-700" />
                        <span>માર્ગદર્શિકા & ઉપયોગની રીત:</span>
                      </span>
                      <ul className="space-y-1 pl-4 list-disc text-[11px]">
                        {previewResource.contentStructure.instructions.map((ins, i) => (
                          <li key={i}>{ins}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Structured Sections (Lesson plan objectives, competencies) */}
                    {previewResource.contentStructure.sections && (
                      <div className="space-y-4">
                        {previewResource.contentStructure.sections.map((sec, i) => (
                          <div key={i} className="border border-slate-200 rounded-xl p-4 space-y-2 bg-white">
                            <h3 className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md inline-block">
                              {sec.title}
                            </h3>
                            <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-700 leading-relaxed">
                              {sec.items.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Table Formats if applicable */}
                    {previewResource.contentStructure.columns && (
                      <div className="space-y-2 overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse border border-slate-300">
                          <thead>
                            <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                              {previewResource.contentStructure.columns.map((col, cIdx) => (
                                <th key={cIdx} className="border border-slate-300 p-2 text-center">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {previewResource.contentStructure.sampleRows?.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50 border-b border-slate-200">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="border border-slate-300 p-2 text-center text-slate-700">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Notes Footer */}
                    {previewResource.contentStructure.notes && (
                      <p className="text-xs text-slate-500 italic pt-2">
                        * નોંધ: {previewResource.contentStructure.notes}
                      </p>
                    )}

                    {/* Signature Row */}
                    <div className="pt-8 flex justify-between items-center text-xs font-bold text-slate-800">
                      <div className="text-center">
                        <p className="border-t border-slate-400 pt-1 w-32">વર્ગ શિક્ષકની સહી</p>
                      </div>
                      <div className="text-center">
                        <p className="border-t border-slate-400 pt-1 w-32">મુખ્ય શિક્ષક / આચાર્ય</p>
                      </div>
                    </div>

                  </div>

                  {/* Feedback invitation box at bottom of printable sheet */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                        <Star className="w-5 h-5 fill-amber-200 text-amber-200" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          આ પાઠ આયોજન / ટેમ્પ્લેટ તમારા વર્ગખંડમાં કેવું રહ્યું?
                        </h4>
                        <p className="text-[11px] text-slate-600">
                          તમારો મૂલ્યવાન પ્રતિભાવ અને સ્ટાર રેટિંગ ગુજરાતના અન્ય શિક્ષકોને ઉપયોગી બનશે.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setModalActiveTab('reviews')}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>રેટિંગ & સમીક્ષાઓ ખોલો</span>
                    </button>
                  </div>
                </>
              )}

            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
              <span className="text-xs text-slate-500">
                A4 સાઇઝમાં સીધું પ્રિન્ટ કરી શકાય તેવું ઓથેન્ટિક ફોર્મેટ
              </span>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setPreviewResource(null)}
                  className="w-1/2 sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  બંધ કરો
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(previewResource, previewResource.fileFormat)}
                  className="w-1/2 sm:w-auto px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{previewResource.fileFormat} ડાઉનલોડ કરો</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Custom Template Uploader Modal */}
      <CustomTemplateUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onSuccess={(template: TeacherUploadedTemplate) => {
          setPreviewUploadedTemplate(template);
        }}
      />

      {/* Uploaded Template Full Preview / Print Modal */}
      <UploadedTemplatePreviewModal
        template={previewUploadedTemplate}
        onClose={() => setPreviewUploadedTemplate(null)}
      />

      {/* Built-in PDF Document Viewer Modal */}
      <PdfDocumentViewerModal
        isOpen={isPdfViewerOpen}
        onClose={() => setIsPdfViewerOpen(false)}
        initialDoc={selectedPdfDoc}
      />

    </div>
  );
};
