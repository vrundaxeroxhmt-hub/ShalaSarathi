import React, { useRef } from 'react';
import { Camera, Plus, Trash2, RefreshCw, Image as ImageIcon } from 'lucide-react';

interface Props {
  photos: string[];
  onChangePhotos: (photos: string[]) => void;
}

export const PatrakPhotoBlock: React.FC<Props> = ({ photos, onChangePhotos }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddSample = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&auto=format&fit=crop&q=80'
    ];
    const nextPhoto = samplePhotos[photos.length % samplePhotos.length];
    onChangePhotos([...photos, nextPhoto]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChangePhotos([...photos, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (index: number) => {
    onChangePhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4 font-sans">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-brand-600" />
          <span>પત્રક પ્રવૃત્તિ ફોટોગ્રાફ્સ (Attach Photographs)</span>
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow flex items-center gap-1"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>કેમેરા / ગેલેરી</span>
          </button>
          <button
            type="button"
            onClick={handleAddSample}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ ફોટો ઉમેરો (+ Add Photo)</span>
          </button>
        </div>
      </div>

      {photos.length === 0 ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center text-xs text-slate-500 bg-white hover:border-brand-500 cursor-pointer transition-colors space-y-1"
        >
          <ImageIcon className="w-8 h-8 mx-auto text-slate-400" />
          <div className="font-bold text-slate-700">+ ફોટો ઉમેરો / Click to attach photos</div>
          <div className="text-[10px] text-slate-400">ગેલેરી અથવા કેમેરામાંથી સ્માર્ટફોન વડે ફોટો અપલોડ કરો</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {photos.map((url, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-300 aspect-video shadow-sm bg-slate-900">
              <img src={url} alt={`Patrak Photo ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 bg-rose-600 text-white rounded-lg shadow hover:bg-rose-700"
                  title="ડિલીટ કરો"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <span className="absolute bottom-1 left-1 bg-slate-950/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                ફોટો {idx + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
