import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MonthlyLessonPlan, DownloadableResource, TeacherUploadedTemplate } from '../../types';
import {
  X,
  Printer,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  FileText,
  Copy,
  Check,
  Search,
  BookOpen,
  Calendar,
  CheckCircle2,
  Layers,
  ChevronDown,
  ChevronRight,
  Sparkles,
  School,
  User,
  Sliders,
  Eye,
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';

export type PreviewDocType = 
  | { type: 'monthly_plan'; plan: MonthlyLessonPlan }
  | { type: 'downloadable_resource'; resource: DownloadableResource }
  | { type: 'uploaded_template'; template: TeacherUploadedTemplate }
  | { type: 'custom_pdf'; title: string; url: string; category?: string };

interface PdfDocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoc?: PreviewDocType;
}

/**
 * Generates an inspection-compliant, formatted A4 HTML document string for a MonthlyLessonPlan
 */
export function generateMonthlyPlanHtml(
  plan: MonthlyLessonPlan,
  schoolName: string,
  teacherName: string,
  taluka: string = 'ગાંધીનગર',
  district: string = 'ગાંધીનગર',
  udise: string = '24070100101',
  zoom: number = 1
): string {
  const totalSubtasks = plan.dailyActivities.reduce((acc, act) => acc + act.subTasks.length, 0);
  const completedSubtasks = plan.dailyActivities.reduce(
    (acc, act) => acc + act.subTasks.filter(t => t.isCompleted).length,
    0
  );
  const completionPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return `<!DOCTYPE html>
<html lang="gu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${plan.subject} - ${plan.month} પાઠ આયોજન પત્રક</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Gujarati:wght@400;500;600;700;800&display=swap');
    
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Noto Sans Gujarati', 'Plus Jakarta Sans', sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      line-height: 1.45;
      font-size: 11px;
      padding: 20px;
      display: flex;
      justify-content: center;
      transform: scale(${zoom});
      transform-origin: top center;
      transition: transform 0.15s ease-out;
    }
    
    .page-container {
      width: 210mm;
      min-height: 297mm;
      background: #ffffff;
      padding: 14mm 14mm;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      margin: 0 auto;
    }

    @media print {
      body {
        background: transparent;
        padding: 0;
        transform: none !important;
      }
      .page-container {
        width: 100%;
        min-height: auto;
        padding: 0;
        box-shadow: none;
        border: none;
      }
      .no-print {
        display: none !important;
      }
    }

    /* Header */
    .header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 10px;
      margin-bottom: 12px;
    }
    .gov-tag {
      font-size: 10px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .school-title {
      font-size: 17px;
      font-weight: 800;
      color: #0f172a;
      margin: 2px 0;
    }
    .doc-subtitle {
      font-size: 13px;
      font-weight: 700;
      color: #1e3a8a;
      background: #eff6ff;
      display: inline-block;
      padding: 2px 12px;
      border-radius: 4px;
      margin: 3px 0;
      border: 1px solid #bfdbfe;
    }
    .meta-line {
      font-size: 10px;
      color: #334155;
      margin-top: 4px;
    }

    /* Grid Info Table */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px;
      margin-bottom: 12px;
      font-size: 10.5px;
    }
    .info-item span.label {
      color: #64748b;
      display: block;
      font-size: 9.5px;
    }
    .info-item span.value {
      font-weight: 700;
      color: #0f172a;
    }

    /* Units & LO Box */
    .lo-box {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 10px;
      margin-bottom: 12px;
      background: #ffffff;
    }
    .lo-title {
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 3px;
    }
    .lo-list {
      padding-left: 16px;
      color: #334155;
      font-size: 10.5px;
    }

    /* Daily Activity Table */
    .section-heading {
      font-size: 11.5px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    table.activity-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin-bottom: 16px;
    }
    table.activity-table th {
      background: #e2e8f0;
      color: #0f172a;
      font-weight: 700;
      border: 1px solid #94a3b8;
      padding: 5px 6px;
      text-align: center;
    }
    table.activity-table td {
      border: 1px solid #94a3b8;
      padding: 5px 6px;
      vertical-align: top;
    }
    .col-day {
      width: 50px;
      text-align: center;
      background: #f8fafc;
      font-weight: 700;
    }
    .col-topic {
      width: 90px;
    }
    .col-activity {
      width: auto;
    }
    .col-tasks {
      width: 160px;
      background: #fafafa;
    }
    .col-status {
      width: 65px;
      text-align: center;
    }

    .badge-status {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 700;
    }
    .status-completed { background: #dcfce7; color: #166534; }
    .status-progress { background: #fef3c7; color: #92400e; }
    .status-planned { background: #f1f5f9; color: #475569; }

    .subtask-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 2px;
      line-height: 1.3;
    }
    .subtask-item span.icon {
      margin-right: 4px;
      font-weight: bold;
    }
    .subtask-done {
      text-decoration: line-through;
      color: #64748b;
    }

    /* Verification Signatures */
    .signature-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 24px;
      padding-top: 14px;
      border-top: 1px solid #94a3b8;
      text-align: center;
      page-break-inside: avoid;
    }
    .sig-space {
      height: 38px;
    }
    .sig-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 10px;
    }
    .sig-sub {
      font-size: 9px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <!-- Header -->
    <div class="header">
      <div class="gov-tag">ગુજરાત સરકાર • શિક્ષણ વિભાગ • GCERT પાઠ્યક્રમ આધારિત</div>
      <div class="school-title">${schoolName || 'શ્રી પ્રાથમિક શાળા'}</div>
      <div class="doc-subtitle">માસિક પાઠ આયોજન & દૈનિક વર્ગખંડ પ્રવૃત્તિ વિભાજન પત્રક</div>
      <div class="meta-line">
        તાલુકો: <strong>${taluka}</strong> | જિલ્લો: <strong>${district}</strong> | UDISE કોડ: <strong>${udise}</strong>
      </div>
    </div>

    <!-- Info Grid -->
    <div class="info-grid">
      <div class="info-item">
        <span class="label">ધોરણ અને વર્ગ:</span>
        <span class="value">${plan.standard} (${plan.division})</span>
      </div>
      <div class="info-item">
        <span class="label">વિષય:</span>
        <span class="value">${plan.subject}</span>
      </div>
      <div class="info-item">
        <span class="label">માસ & શૈક્ષણિક વર્ષ:</span>
        <span class="value">${plan.month} (${plan.academicYear})</span>
      </div>
      <div class="info-item">
        <span class="label">પ્રગતિ & પૂર્ણતા:</span>
        <span class="value" style="color: #15803d;">${completionPercentage}% (${completedSubtasks}/${totalSubtasks} કાર્યો)</span>
      </div>
    </div>

    <!-- Units & LOs -->
    <div class="lo-box">
      <div class="lo-title">📖 સમાવિષ્ટ એકમો / પ્રકરણો: <span style="font-weight: normal; color: #334155;">${plan.unitsCovered.join(' • ')}</span></div>
      ${plan.targetLearningOutcomes.length > 0 ? `
        <div style="margin-top: 4px;">
          <div style="font-weight: 700; color: #0f172a; margin-bottom: 2px;">🎯 લક્ષિત અધ્યયન નિષ્પત્તિઓ (Learning Outcomes):</div>
          <ul class="lo-list">
            ${plan.targetLearningOutcomes.map(lo => `<li>${lo}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>

    <!-- Daily Activities Table -->
    <div class="section-heading">દૈનિક તાસવાર વર્ગખંડ પ્રવૃત્તિઓ અને પેટા-કાર્યો ચેકલિસ્ટ:</div>
    <table class="activity-table">
      <thead>
        <tr>
          <th class="col-day">દિવસ / તાસ</th>
          <th class="col-topic">તારીખ & મુદ્દો</th>
          <th class="col-activity">અધ્યયન-અધ્યાપન પ્રક્રિયા & TLM</th>
          <th class="col-tasks">પેટા-કાર્યો ચેકલિસ્ટ (Sub-Tasks)</th>
          <th class="col-status">સ્થિતિ</th>
        </tr>
      </thead>
      <tbody>
        ${plan.dailyActivities.map(act => `
          <tr>
            <td class="col-day">
              <div>દિવસ ${act.dayNumber}</div>
              <div style="font-size: 8.5px; color: #64748b; font-weight: normal;">તાસ ${act.periodNumber}</div>
            </td>
            <td class="col-topic">
              <div style="font-size: 8.5px; color: #64748b;">${act.date}</div>
              <div style="font-weight: 700; color: #0f172a; margin-top: 2px;">${act.topic}</div>
              ${act.learningOutcome ? `<div style="font-size: 8.5px; color: #1e40af; background: #eff6ff; padding: 2px; border-radius: 2px; margin-top: 2px;">${act.learningOutcome}</div>` : ''}
            </td>
            <td class="col-activity">
              <div>${act.teachingActivity}</div>
              ${act.tlmUsed ? `<div style="margin-top: 4px; font-size: 8.5px; color: #475569;"><strong>TLM:</strong> ${act.tlmUsed}</div>` : ''}
              ${act.homework ? `<div style="margin-top: 2px; font-size: 8.5px; color: #475569;"><strong>ગૃહકાર્ય:</strong> ${act.homework}</div>` : ''}
            </td>
            <td class="col-tasks">
              ${act.subTasks.map(st => `
                <div class="subtask-item ${st.isCompleted ? 'subtask-done' : ''}">
                  <span class="icon">${st.isCompleted ? '☑' : '☐'}</span>
                  <span>${st.taskTitle}</span>
                </div>
              `).join('')}
            </td>
            <td class="col-status">
              <span class="badge-status ${
                act.status === 'પૂર્ણ' ? 'status-completed' :
                act.status === 'ચાલુ' ? 'status-progress' : 'status-planned'
              }">
                ${act.status}
              </span>
              ${act.teacherNotes ? `<div style="font-size: 8px; color: #64748b; margin-top: 3px; font-style: italic;">${act.teacherNotes}</div>` : ''}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Verification Signatures -->
    <div class="signature-grid">
      <div>
        <div class="sig-space"></div>
        <div class="sig-title">વિષય શિક્ષકની સહી</div>
        <div class="sig-sub">(${teacherName || plan.teacherName})</div>
      </div>
      <div>
        <div class="sig-space"></div>
        <div class="sig-title">આચાર્યશ્રીની સહી & સિક્કો</div>
        <div class="sig-sub">(શાળા મહોર સાથે)</div>
      </div>
      <div>
        <div class="sig-space"></div>
        <div class="sig-title">CRC / BRC કો-ઓર્ડિનેટર સહી</div>
        <div class="sig-sub">(તપાસણી શેરો & તારીખ)</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generates an inspection-compliant A4 HTML string for a DownloadableResource
 */
export function generateResourceHtml(
  res: DownloadableResource,
  schoolName: string,
  teacherName: string,
  taluka: string = 'ગાંધીનગર',
  district: string = 'ગાંધીનગર',
  zoom: number = 1
): string {
  return `<!DOCTYPE html>
<html lang="gu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${res.gujaratiTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Gujarati:wght@400;500;600;700;800&display=swap');
    @page { size: A4 portrait; margin: 10mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Noto Sans Gujarati', 'Plus Jakarta Sans', sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      line-height: 1.5;
      font-size: 11px;
      padding: 20px;
      display: flex;
      justify-content: center;
      transform: scale(${zoom});
      transform-origin: top center;
    }
    .page-container {
      width: 210mm;
      min-height: 297mm;
      background: #ffffff;
      padding: 14mm;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid #cbd5e1;
      border-radius: 4px;
    }
    @media print {
      body { background: transparent; padding: 0; transform: none !important; }
      .page-container { width: 100%; min-height: auto; padding: 0; box-shadow: none; border: none; }
    }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 14px; }
    .school-title { font-size: 18px; font-weight: 800; text-transform: uppercase; }
    .doc-subtitle { font-size: 13px; font-weight: 700; color: #854d0e; background: #fefce8; border: 1px solid #fef08a; display: inline-block; padding: 2px 12px; border-radius: 4px; margin-top: 4px; }
    .meta-bar { display: flex; justify-content: space-between; font-size: 10px; color: #475569; margin-top: 6px; }
    .instruction-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; margin-bottom: 14px; }
    .instruction-title { font-weight: 700; color: #0f172a; margin-bottom: 4px; }
    .section-card { border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; margin-bottom: 12px; }
    .section-title { font-weight: 700; font-size: 12px; color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px; }
    table.res-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10px; }
    table.res-table th { background: #f1f5f9; border: 1px solid #94a3b8; padding: 5px; font-weight: 700; }
    table.res-table td { border: 1px solid #94a3b8; padding: 5px; }
    .signature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 30px; padding-top: 14px; border-top: 1px solid #94a3b8; text-align: center; }
    .sig-space { height: 40px; }
    .sig-title { font-weight: 700; font-size: 10px; }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="header">
      <div class="school-title">${schoolName}</div>
      <div style="font-size: 10px; color: #64748b;">તાલુકો: ${taluka} | જિલ્લો: ${district}</div>
      <div class="doc-subtitle">${res.contentStructure.header}</div>
      ${res.contentStructure.subHeader ? `<div style="font-size: 11px; font-weight: 600; color: #334155; margin-top: 3px;">${res.contentStructure.subHeader}</div>` : ''}
      <div class="meta-bar">
        <span>તારીખ: ${new Date().toLocaleDateString('gu-IN')}</span>
        <span>શિક્ષક / સંયોજક: ${teacherName}</span>
        <span>કેટેગરી: ${res.categoryLabel}</span>
      </div>
    </div>

    ${res.contentStructure.instructions && res.contentStructure.instructions.length > 0 ? `
      <div class="instruction-box">
        <div class="instruction-title">📌 માર્ગદર્શિકા & ઉપયોગની રીત:</div>
        <ul style="padding-left: 16px; space-y: 2px;">
          ${res.contentStructure.instructions.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>
    ` : ''}

    ${res.contentStructure.sections ? res.contentStructure.sections.map(sec => `
      <div class="section-card">
        <div class="section-title">${sec.title}</div>
        <ul style="padding-left: 18px; space-y: 3px;">
          ${sec.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `).join('') : ''}

    ${res.contentStructure.columns && res.contentStructure.sampleRows ? `
      <table class="res-table">
        <thead>
          <tr>
            ${res.contentStructure.columns.map(col => `<th>${col}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${res.contentStructure.sampleRows.map(row => `
            <tr>
              ${row.map(cell => `<td>${cell}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}

    ${res.contentStructure.notes ? `
      <div style="margin-top: 12px; font-size: 9.5px; color: #64748b; font-style: italic;">
        * ${res.contentStructure.notes}
      </div>
    ` : ''}

    <div class="signature-grid">
      <div>
        <div class="sig-space"></div>
        <div class="sig-title">વિષય શિક્ષક / વર્ગ શિક્ષક</div>
        <div style="font-size: 9px; color: #64748b;">(${teacherName})</div>
      </div>
      <div>
        <div class="sig-space"></div>
        <div class="sig-title">આચાર્યશ્રીની સહી & સિક્કો</div>
        <div style="font-size: 9px; color: #64748b;">(શાળા મહોર)</div>
      </div>
      <div>
        <div class="sig-space"></div>
        <div class="sig-title">સી.આર.સી. કો-ઓર્ડિનેટર</div>
        <div style="font-size: 9px; color: #64748b;">(તપાસણી શેરો)</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export const PdfDocumentViewerModal: React.FC<PdfDocumentViewerModalProps> = ({
  isOpen,
  onClose,
  initialDoc
}) => {
  const { schoolProfile, teacherProfile, monthlyLessonPlans, uploadedTemplates } = useApp();

  // Document selection
  const [currentDoc, setCurrentDoc] = useState<PreviewDocType>(
    initialDoc || {
      type: 'monthly_plan',
      plan: monthlyLessonPlans[0]
    }
  );

  // Customization fields
  const [customSchoolName, setCustomSchoolName] = useState<string>(
    schoolProfile.schoolName || 'શ્રી પ્રાથમિક શાળા'
  );
  const [customTeacherName, setCustomTeacherName] = useState<string>(
    teacherProfile.name || 'શિક્ષક શ્રી'
  );
  const [customUdise, setCustomUdise] = useState<string>(
    schoolProfile.udiseCode || '24070100101'
  );
  const [isCustomizeOpen, setIsCustomizeOpen] = useState<boolean>(false);

  // Viewer Controls
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedStatus, setCopiedStatus] = useState<boolean>(false);
  const [renderMode, setRenderMode] = useState<'iframe' | 'object'>('iframe');

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const objectRef = useRef<HTMLObjectElement>(null);

  // Keep synced with initialDoc prop if changed
  useEffect(() => {
    if (initialDoc) {
      setCurrentDoc(initialDoc);
    }
  }, [initialDoc]);

  // Determine doc title & type
  const docMetadata = useMemo(() => {
    if (currentDoc.type === 'monthly_plan') {
      return {
        title: `${currentDoc.plan.subject} - ${currentDoc.plan.month} પાઠ આયોજન`,
        subtitle: `${currentDoc.plan.standard} (${currentDoc.plan.division}) • ${currentDoc.plan.dailyActivities.length} દિવસો આયોજિત`,
        category: 'માસિક પાઠ આયોજન (Lesson Plan)',
        isPdfFile: false,
        fileFormat: 'PDF / A4'
      };
    } else if (currentDoc.type === 'downloadable_resource') {
      return {
        title: currentDoc.resource.gujaratiTitle,
        subtitle: `${currentDoc.resource.categoryLabel} • ${currentDoc.resource.standard}`,
        category: currentDoc.resource.categoryLabel,
        isPdfFile: currentDoc.resource.fileFormat === 'PDF',
        fileFormat: currentDoc.resource.fileFormat
      };
    } else if (currentDoc.type === 'uploaded_template') {
      const isPdf = currentDoc.template.fileType === 'pdf' || currentDoc.template.fileName.toLowerCase().endsWith('.pdf');
      return {
        title: currentDoc.template.title,
        subtitle: `${currentDoc.template.standard} • ${currentDoc.template.subject} • ${currentDoc.template.fileName}`,
        category: currentDoc.template.categoryLabel,
        isPdfFile: isPdf,
        fileFormat: isPdf ? 'PDF' : 'IMAGE',
        dataUrl: currentDoc.template.dataUrl
      };
    } else {
      return {
        title: currentDoc.title,
        subtitle: 'PDF Document Preview',
        category: currentDoc.category || 'PDF સાધન',
        isPdfFile: true,
        fileFormat: 'PDF',
        dataUrl: currentDoc.url
      };
    }
  }, [currentDoc]);

  // HTML content generation for Lesson Plans and Resources
  const htmlContent = useMemo(() => {
    if (currentDoc.type === 'monthly_plan') {
      return generateMonthlyPlanHtml(
        currentDoc.plan,
        customSchoolName,
        customTeacherName,
        schoolProfile.taluka,
        schoolProfile.district,
        customUdise,
        zoomLevel
      );
    } else if (currentDoc.type === 'downloadable_resource') {
      return generateResourceHtml(
        currentDoc.resource,
        customSchoolName,
        customTeacherName,
        schoolProfile.taluka,
        schoolProfile.district,
        zoomLevel
      );
    }
    return '';
  }, [currentDoc, customSchoolName, customTeacherName, customUdise, schoolProfile, zoomLevel]);

  if (!isOpen) return null;

  // Print handler
  const handlePrint = () => {
    if (docMetadata.isPdfFile && 'dataUrl' in docMetadata && docMetadata.dataUrl) {
      const printWin = window.open(docMetadata.dataUrl);
      if (printWin) {
        printWin.addEventListener('load', () => {
          printWin.print();
        });
      } else {
        window.print();
      }
    } else if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.focus();
        iframeRef.current.contentWindow.print();
      } catch {
        window.print();
      }
    } else {
      window.print();
    }
  };

  // Direct Download handler
  const handleDownload = () => {
    if (docMetadata.isPdfFile && 'dataUrl' in docMetadata && docMetadata.dataUrl) {
      const a = document.createElement('a');
      a.href = docMetadata.dataUrl;
      a.download = `${docMetadata.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Create a printable blob for the generated HTML
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${docMetadata.title.replace(/\s+/g, '_')}_A4.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Copy Plain Text Content
  const handleCopyText = () => {
    if (currentDoc.type === 'monthly_plan') {
      const p = currentDoc.plan;
      let text = `શાળા: ${customSchoolName}\nવિષય: ${p.subject} (${p.standard})\nમાસ: ${p.month} ${p.academicYear}\n\n`;
      text += `સમાવિષ્ટ એકમો: ${p.unitsCovered.join(', ')}\n\n`;
      text += `દૈનિક પ્રવૃત્તિઓ:\n`;
      p.dailyActivities.forEach(a => {
        text += `• દિવસ ${a.dayNumber} (${a.date}): ${a.topic} [${a.status}]\n`;
        text += `  પ્રવૃત્તિ: ${a.teachingActivity}\n`;
        if (a.subTasks.length > 0) {
          text += `  કાર્યો: ${a.subTasks.map(t => `${t.isCompleted ? '[✓]' : '[ ]'} ${t.taskTitle}`).join(', ')}\n`;
        }
      });
      navigator.clipboard.writeText(text);
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 2000);
    } else if (currentDoc.type === 'downloadable_resource') {
      const r = currentDoc.resource;
      let text = `${customSchoolName}\n${r.contentStructure.header}\n\n`;
      r.contentStructure.instructions?.forEach(i => text += `${i}\n`);
      navigator.clipboard.writeText(text);
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 2000);
    }
  };

  // Zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.5));
  const handleZoomReset = () => setZoomLevel(1);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in ${
      isFullscreen ? 'p-0' : ''
    }`}>
      <div className={`bg-slate-900 text-white rounded-3xl w-full flex flex-col shadow-2xl border border-slate-700 overflow-hidden transition-all duration-200 ${
        isFullscreen ? 'h-screen rounded-none max-w-none' : 'max-w-6xl max-h-[96vh] h-[92vh]'
      }`}>

        {/* TOP TOOLBAR */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* Document Title & Category Badge */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30">
                  {docMetadata.category}
                </span>
                <span className="text-[11px] text-slate-400 font-medium truncate hidden sm:inline">
                  {docMetadata.subtitle}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate mt-0.5">
                {docMetadata.title}
              </h2>
            </div>
          </div>

          {/* Quick Document Switcher Dropdown */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                value={
                  currentDoc.type === 'monthly_plan' ? `mp-${currentDoc.plan.id}` :
                  currentDoc.type === 'downloadable_resource' ? `dr-${currentDoc.resource.id}` :
                  currentDoc.type === 'uploaded_template' ? `ut-${currentDoc.template.id}` : 'custom'
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.startsWith('mp-')) {
                    const planId = val.replace('mp-', '');
                    const found = monthlyLessonPlans.find(p => p.id === planId);
                    if (found) setCurrentDoc({ type: 'monthly_plan', plan: found });
                  } else if (val.startsWith('ut-')) {
                    const tId = val.replace('ut-', '');
                    const found = uploadedTemplates.find(t => t.id === tId);
                    if (found) setCurrentDoc({ type: 'uploaded_template', template: found });
                  }
                }}
                className="bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer max-w-[180px] sm:max-w-[240px] truncate"
              >
                <optgroup label="માસિક પાઠ આયોજન (Lesson Plans)">
                  {monthlyLessonPlans.map(p => (
                    <option key={p.id} value={`mp-${p.id}`}>
                      {p.standard} {p.subject} ({p.month})
                    </option>
                  ))}
                </optgroup>
                {uploadedTemplates.length > 0 && (
                  <optgroup label="મારા અપલોડ કરેલા ટેમ્પ્લેટ્સ (My Uploads)">
                    {uploadedTemplates.map(t => (
                      <option key={t.id} value={`ut-${t.id}`}>
                        {t.title} ({t.subject})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            {/* Customization Toggle */}
            <button
              type="button"
              onClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer border ${
                isCustomizeOpen
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="શાળા અને શિક્ષક નામ કસ્ટમાઇઝ કરો"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden md:inline">કસ્ટમાઇઝ</span>
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1 text-slate-300">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                className="p-1 hover:text-white rounded hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                title="ઝૂમ આઉટ (-)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleZoomReset}
                className="px-2 text-[11px] font-mono font-bold hover:text-white cursor-pointer"
                title="રીસેટ ઝૂમ (૧૦૦%)"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2.0}
                className="p-1 hover:text-white rounded hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                title="ઝૂમ ઇન (+)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Copy Plain Text */}
            <button
              type="button"
              onClick={handleCopyText}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
              title="ટેક્સ્ટ કોપી કરો"
            >
              {copiedStatus ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden lg:inline">{copiedStatus ? 'કોપી થયું!' : 'કોપી'}</span>
            </button>

            {/* Print Action */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
              title="A4 પ્રિન્ટ કરો"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">A4 પ્રિન્ટ</span>
            </button>

            {/* Download Action */}
            <button
              type="button"
              onClick={handleDownload}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
              title="દસ્તાવેજ ડાઉનલોડ કરો"
            >
              <Download className="w-4 h-4" />
              <span>ડાઉનલોડ</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              title={isFullscreen ? 'સામાન્ય સ્ક્રીન' : 'ફૂલ સ્ક્રીન'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Modal */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              title="બંધ કરો"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CUSTOMIZATION BAR (COLLAPSIBLE) */}
        {isCustomizeOpen && (
          <div className="bg-slate-800/95 border-b border-slate-700 p-3 sm:px-6 flex flex-wrap items-center gap-3 text-xs animate-in slide-in-from-top-2">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-slate-400 font-semibold mb-1 text-[11px] flex items-center space-x-1">
                <School className="w-3.5 h-3.5 text-amber-400" />
                <span>શાળાનું નામ (School Name on Header):</span>
              </label>
              <input
                type="text"
                value={customSchoolName}
                onChange={e => setCustomSchoolName(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex-1 min-w-[180px]">
              <label className="block text-slate-400 font-semibold mb-1 text-[11px] flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>શિક્ષકનું નામ (Teacher Name):</span>
              </label>
              <input
                type="text"
                value={customTeacherName}
                onChange={e => setCustomTeacherName(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="w-32">
              <label className="block text-slate-400 font-semibold mb-1 text-[11px]">UDISE કોડ:</label>
              <input
                type="text"
                value={customUdise}
                onChange={e => setCustomUdise(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="self-end pb-0.5">
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-1.5 rounded-lg flex items-center space-x-1">
                <Check className="w-3 h-3" />
                <span>લાઈવ પ્રિવ્યૂ સક્રિય</span>
              </span>
            </div>
          </div>
        )}

        {/* EMBEDDED VIEWER CANVAS (IFRAME & OBJECT TAG IMPLEMENTATION) */}
        <div className="flex-1 bg-slate-950 p-2 sm:p-4 overflow-auto flex flex-col items-center justify-start relative">
          
          {docMetadata.isPdfFile && 'dataUrl' in docMetadata && docMetadata.dataUrl ? (
            /* Direct PDF rendering using <object> tag with <iframe> fallback */
            <div className="w-full h-full max-w-5xl bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
              <object
                ref={objectRef}
                data={docMetadata.dataUrl}
                type="application/pdf"
                className="w-full flex-1 rounded-2xl"
              >
                <iframe
                  ref={iframeRef}
                  src={docMetadata.dataUrl}
                  title={docMetadata.title}
                  className="w-full h-full border-0 rounded-2xl"
                >
                  <div className="p-8 text-center space-y-4 my-auto bg-slate-900 text-slate-300">
                    <FileText className="w-12 h-12 text-rose-500 mx-auto" />
                    <h3 className="text-base font-bold text-white">PDF પ્રિવ્યૂ</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      બ્રાઉઝરમાં સીધો પ્રિવ્યૂ ન દેખાય તો નીચેના બટનથી PDF ડાઉનલોડ કરો અથવા નવા ટેબમાં ખોલો.
                    </p>
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5"
                      >
                        <Download className="w-4 h-4" />
                        <span>PDF ડાઉનલોડ</span>
                      </button>
                      <a
                        href={docMetadata.dataUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-slate-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>નવા ટેબમાં ખોલો</span>
                      </a>
                    </div>
                  </div>
                </iframe>
              </object>
            </div>
          ) : (
            /* Inspection-Ready Formatted A4 Document embedded via <iframe> srcDoc */
            <div className="w-full h-full max-w-5xl flex flex-col items-center">
              <iframe
                ref={iframeRef}
                srcDoc={htmlContent}
                title={docMetadata.title}
                className="w-full flex-1 bg-white rounded-2xl shadow-2xl border border-slate-800"
                style={{
                  minHeight: '520px'
                }}
              />
            </div>
          )}
        </div>

        {/* FOOTER BAR */}
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>A4 પ્રિન્ટ & PDF વેરિફિકેશન ફોર્મેટ રેડી</span>
            </span>
            <span>•</span>
            <span>શૈક્ષણિક વર્ષ: {schoolProfile.academicYear || '૨૦૨૫-૨૬'}</span>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-slate-500">ઝૂમ: {Math.round(zoomLevel * 100)}%</span>
            <span>•</span>
            <button
              type="button"
              onClick={handlePrint}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              પ્રિન્ટ ડાયલોગ ખોલો
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
