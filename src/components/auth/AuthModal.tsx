import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LogIn, 
  UserPlus, 
  Lock, 
  Mail, 
  User, 
  X, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap, 
  School,
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { 
    signInWithEmail, 
    signUpWithEmail, 
    signInQuickGuest, 
    showToast 
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signInWithEmail(email.trim(), password);
        showToast('સફળતાપૂર્વક સાઇન ઇન થઈ ગયું! આવકારો 👋');
        onClose();
      } else {
        await signUpWithEmail(email.trim(), password, name.trim());
        showToast('તમારું શિક્ષક એકાઉન્ટ સફળતાપૂર્વક બની ગયું 🎉');
        onClose();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = 'સાઇન ઇન કરવામાં ભૂલ આવી. કૃપા કરીને ફરી પ્રયાસ કરો.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'ઇમેઇલ અથવા પાસવર્ડ ખોટો છે.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'આ ઇમેઇલ પહેલેથી જ નોંધાયેલો છે. કૃપા કરીને સાઇન ઇન કરો.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'પાસવર્ડ ઓછામાં ઓછો ૬ અક્ષરનો હોવો જોઈએ.';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTeacherSignIn = async (presetName: string, presetSchool: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await signInQuickGuest(presetName);
      showToast(`શિક્ષક "${presetName}" તરીકે સફળતાપૂર્વક પ્રવેશ કર્યો! ✅`);
      onClose();
    } catch (err: any) {
      console.error('Quick signin error:', err);
      setErrorMessage('ઝડપી સાઇન ઇન નિષ્ફળ ગયું.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center mx-auto shadow-md mb-3 font-bold text-2xl">
            શ
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {mode === 'signin' ? 'શિક્ષક પોર્ટલ સાઇન ઇન' : 'નવું શિક્ષક એકાઉન્ટ બનાવો'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Firebase Auth સિક્યોર્ડ ક્લાઉડ કનેક્શન
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'signin' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In (સાઇન ઇન)
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'signup' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign Up (રજીસ્ટ્રેશન)
          </button>
        </div>

        {/* Error notice if any */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">શિક્ષકશ્રીનું પૂરું નામ *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="દા.ત. રમેશભાઈ એચ. પટેલ"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">શિક્ષક ઇમેઇલ એડ્રેસ *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@example.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">પાસવર્ડ *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ઓછામાં ઓછા ૬ અક્ષર"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95 disabled:opacity-50 mt-2"
          >
            {mode === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>
              {loading 
                ? 'સાઇન ઇન થઈ રહ્યું છે...' 
                : (mode === 'signin' ? 'સાઇન ઇન કરો' : 'નવું એકાઉન્ટ બનાવો')}
            </span>
          </button>
        </form>

        {/* Quick 1-Click Teacher Demo Sign In */}
        <div className="mt-5 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold text-slate-500">ઝડપી શિક્ષક પ્રવેશ (1-Click Instant Sign In):</span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickTeacherSignIn('ભાવિનકુમાર એમ. પરમાર', 'શ્રી પ્રાથમિક શાળા, હિંમતનગર')}
              className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-left transition-colors"
            >
              <div className="font-bold text-slate-900 text-[11px] truncate">ભાવિન એમ. પરમાર</div>
              <div className="text-[10px] text-amber-800 truncate">ગણિત-વિજ્ઞાન શિક્ષક</div>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickTeacherSignIn('હરેશભાઈ એન. પટેલ', 'મોડલ પ્રાથમિક શાળા, મોડાસા')}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
            >
              <div className="font-bold text-slate-900 text-[11px] truncate">હરેશભાઈ પટેલ</div>
              <div className="text-[10px] text-slate-500 truncate">આચાર્યશ્રી (HTAT)</div>
            </button>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-4 text-center">
          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Firebase Authentication Security Enabled</span>
          </span>
        </div>

      </div>
    </div>
  );
};
