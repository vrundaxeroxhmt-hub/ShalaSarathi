import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeacherUploadedTemplate } from '../../types';
import { ResourceReviewsSection, StarRatingBadge } from './ResourceReviewsSection';
import {
  X,
  Printer,
  Download,
  Trash2,
  Bookmark,
  FileText,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ExternalLink,
  Check,
  Calendar,
  Layers,
  GraduationCap,
  Sparkles,
  Info,
  Star,
  MessageSquare
} from 'lucide-react';

interface UploadedTemplatePreviewModalProps {
  template: TeacherUploadedTemplate | null;
  onClose: () => void;
}

export const UploadedTemplatePreviewModal: React.FC<UploadedTemplatePreviewModalProps> = ({
  template,
  onClose
}) => {
  const { deleteUploadedTemplate, toggleFavoriteTemplate } = useApp();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'reviews'>('preview');

  if (!template) return null;

  const isPdf = template.fileType === 'pdf' || template.mimeType === 'application/pdf' || template.fileName.toLowerCase().endsWith('.pdf');

  const handlePrint = () => {
    if (isPdf) {
      // For PDF data URLs, open a print window or trigger print
      const printWindow = window.open(template.dataUrl);
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.print();
        });
      } else {
        window.print();
      }
    } else {
      // Create a print iframe or popup for high-res image printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${template.title} - પ્રિન્ટ</title>
              <style>
                @page { size: A4 portrait; margin: 10mm; }
                body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: #fff; }
                img { max-width: 100%; height: auto; object-fit: contain; }
              </style>
            </head>
            <body>
              <img src="${template.dataUrl}" onload="window.print();window.close();" />
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        window.print();
      }
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = template.dataUrl;
    a.download = template.fileName || `${template.title.replace(/\s+/g, '_')}.${template.fileType === 'pdf' ? 'pdf' : 'png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = () => {
    deleteUploadedTemplate(template.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 my-auto">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shrink-0 shadow-xs ${
              isPdf ? 'bg-rose-600' : 'bg-blue-600'
            }`}>
              {isPdf ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  {template.categoryLabel}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {template.standard} • {template.subject}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate mt-0.5">
                {template.title}
              </h2>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => toggleFavoriteTemplate(template.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                template.isFavorite
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
              }`}
              title={template.isFavorite ? 'મનપસંદ યાદીમાં છે' : 'મનપસંદ કરો'}
            >
              <Bookmark className={`w-4 h-4 ${template.isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
              title="A4 પ્રિન્ટ કરો"
            >
              <Printer className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">A4 પ્રિન્ટ</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
              title="ડાઉનલોડ કરો"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">ડાઉનલોડ</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center px-4 sm:px-6 bg-slate-50 border-b border-slate-200 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'border-rose-600 text-rose-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>ટેમ્પ્લેટ પ્રિવ્યૂ & પ્રિન્ટ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-amber-600 text-amber-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>શિક્ષક સમીક્ષાઓ & રેટિંગ</span>
          </button>
        </div>

        {/* Viewer Content Area */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 bg-slate-100 flex flex-col items-center min-h-[420px]">
          {activeTab === 'reviews' ? (
            <div className="w-full max-w-3xl my-auto">
              <ResourceReviewsSection
                resourceId={template.id}
                resourceTitle={template.title}
                baseRating={5.0}
                baseReviewCount={2}
              />
            </div>
          ) : isPdf ? (
            <div className="w-full h-[60vh] bg-white rounded-2xl shadow-inner border border-slate-300 overflow-hidden flex flex-col">
              <object
                data={template.dataUrl}
                type="application/pdf"
                className="w-full h-full"
              >
                <div className="p-8 text-center space-y-3 my-auto">
                  <FileText className="w-12 h-12 text-rose-600 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">PDF પ્રિવ્યૂ</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    તમારા બ્રાઉઝરમાં સીધો પ્રિવ્યૂ લોડ ન થઈ શક્યો હોય તો નીચે બટન પર ક્લિક કરીને ફાઇલ ડાઉનલોડ અથવા પ્રિન્ટ કરો.
                  </p>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-rose-700 cursor-pointer"
                  >
                    PDF ડાઉનલોડ કરો ({template.fileSize})
                  </button>
                </div>
              </object>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center space-y-3">
              {/* Image Toolbar */}
              <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-xs border border-slate-200 px-3 py-1.5 rounded-2xl shadow-2xs">
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                  className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-lg cursor-pointer"
                  title="ઝૂમ આઉટ"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold text-slate-600 px-1">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.25))}
                  className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-lg cursor-pointer"
                  title="ઝૂમ ઇન"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-300 mx-1" />
                <button
                  type="button"
                  onClick={() => setRotation(prev => (prev + 90) % 360)}
                  className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-lg cursor-pointer"
                  title="ફેરવો (Rotate)"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoomLevel(1);
                    setRotation(0);
                  }}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 px-1 cursor-pointer"
                >
                  રીસેટ
                </button>
              </div>

              {/* High-res Image Display Container */}
              <div className="max-h-[58vh] overflow-auto rounded-2xl bg-white p-4 shadow-sm border border-slate-200 flex items-center justify-center w-full">
                <img
                  src={template.dataUrl}
                  alt={template.title}
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.2s ease-out'
                  }}
                  className="max-h-[52vh] max-w-full object-contain rounded-lg shadow-2xs"
                />
              </div>
            </div>
          )}

          {/* Template Details Summary Bar */}
          <div className="w-full mt-3 bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">ફાઇલ નામ & કદ:</span>
              <span className="font-bold text-slate-800 truncate block font-mono">{template.fileName} ({template.fileSize})</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">અપલોડ તારીખ:</span>
              <span className="font-bold text-slate-800">{template.uploadedAt}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">શિક્ષક / શાળા:</span>
              <span className="font-bold text-slate-800">{template.uploadedBy || 'ભાવિનકુમાર એમ. પરમાર'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">ટૅગ્સ:</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {template.tags.map((t, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {template.description && (
            <div className="w-full mt-2 bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 flex items-center space-x-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{template.description}</span>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 flex items-center justify-between bg-white">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>ટેમ્પ્લેટ કાઢી નાખો</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl">
              <span className="text-xs font-bold text-rose-800">ખરેખર ડિલીટ કરવું છે?</span>
              <button
                type="button"
                onClick={handleDelete}
                className="px-2 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 cursor-pointer"
              >
                હા, ડિલીટ
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300 cursor-pointer"
              >
                ના
              </button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              બંધ કરો
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>A4 પ્રિન્ટ કરો</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
