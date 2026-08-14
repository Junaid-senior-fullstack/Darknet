import React from 'react';
import { X, ShieldCheck, Mail, ArrowRight, ExternalLink, KeyRound, CheckCircle } from 'lucide-react';
import { playBeep } from '../utils/audio';

interface ApplyNoticeModalProps {
  onClose: () => void;
  onProceed: () => void;
}

export const ApplyNoticeModal: React.FC<ApplyNoticeModalProps> = ({ onClose, onProceed }) => {
  const handleProceed = () => {
    playBeep(1100, 0.05);
    onProceed();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-mono">
      <div className="relative max-w-lg w-full bg-black border border-emerald-500/80 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.35)] animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-emerald-500 hover:text-white hover:bg-emerald-950 rounded-xl transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-emerald-800/80 pb-4 mb-5">
          <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-xl text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <KeyRound className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-900/60 px-2.5 py-0.5 rounded border border-emerald-600/60">
              DARKNET ACCESS PORTAL
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
              DARKNET PORTAL APPLICATION
            </h2>
          </div>
        </div>

        {/* English Core Announcement / Notice */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/90 via-black to-emerald-950/90 border border-emerald-500/70 shadow-inner space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>APPLICATION GUIDELINES & DIRECT DISPATCH</span>
            </div>
            
            <p className="text-xs text-white leading-relaxed font-sans sm:font-mono">
              You can apply from any active Darknet portal. We will share the direct access link and account passwords directly to your Gmail address.
            </p>

            <div className="pt-2 border-t border-emerald-900/80 flex items-center gap-2 text-[11px] text-emerald-400">
              <Mail className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Dispatch Guarantee: Active within <strong>12 Hours</strong> via Gmail.</span>
            </div>
          </div>

          {/* Key Perks */}
          <div className="space-y-2 text-xs text-emerald-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Includes 12-Hour direct portal link & credentials dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Instant crypto checkout and automated access key generation ($200 USD)</span>
            </div>
          </div>
        </div>

        {/* Action Button: OK -> PROCEED TO PAYMENT */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-1/3 py-3 rounded-xl border border-emerald-800 text-emerald-400 hover:bg-emerald-950 text-xs font-bold uppercase transition-all cursor-pointer"
          >
            CANCEL
          </button>
          
          <button
            onClick={handleProceed}
            className="w-full sm:w-2/3 py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 border border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            OK - PROCEED TO PAYMENT <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
