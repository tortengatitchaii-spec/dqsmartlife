import React from 'react';
import { useDq } from '../context/DqContext';
import { Sparkles, Trophy, CheckCircle2, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDq();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isXp = toast.type === 'xp';
        const isBadge = toast.type === 'badge';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              isBadge
                ? 'bg-amber-950/90 border-amber-600/60 text-amber-100 shadow-amber-950/50'
                : isXp
                ? 'bg-sky-950/90 border-sky-600/60 text-sky-100 shadow-sky-950/50'
                : isSuccess
                ? 'bg-emerald-950/90 border-emerald-600/60 text-emerald-100 shadow-emerald-950/50'
                : 'bg-slate-900/90 border-slate-700/60 text-slate-100'
            }`}
          >
            <div className="p-1.5 rounded-lg bg-black/30 mt-0.5 shrink-0">
              {isBadge && <Trophy className="w-4 h-4 text-amber-400" />}
              {isXp && <Sparkles className="w-4 h-4 text-sky-400" />}
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {!isBadge && !isXp && !isSuccess && <Info className="w-4 h-4 text-slate-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold leading-tight">{toast.title}</p>
              <p className="text-xs opacity-90 mt-0.5 leading-snug">{toast.desc}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
