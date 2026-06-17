import React from 'react';
import { AlertTriangle, LogOut, X } from 'lucide-react';

interface LogoutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutModal({ onConfirm, onCancel }: LogoutModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <LogOut className="w-6 h-6 text-red-400" />
            </div>
            <button 
              onClick={onCancel}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-slate-100 mb-2">Confirm Logout</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Are you sure you want to end your current authenticated session? Active tasks will be preserved in the background orchestration layer.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-lg border border-red-500/30 bg-red-500/10 font-medium text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)]"
            >
              Confirm Logout
            </button>
          </div>
        </div>
        <div className="bg-slate-950/50 px-6 py-3 border-t border-slate-800 flex items-center justify-center gap-2">
           <AlertTriangle className="w-4 h-4 text-amber-500/70" />
           <span className="text-xs text-slate-500 font-medium">Session token will be cryptographically wiped.</span>
        </div>
      </div>
    </div>
  );
}
