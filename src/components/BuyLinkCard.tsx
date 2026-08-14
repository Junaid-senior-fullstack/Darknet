import React, { useState, useEffect } from 'react';
import { PurchasedLinkItem } from '../types';
import { Link as LinkIcon, DollarSign, Clock, Mail, ShieldCheck, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { playBeep } from '../utils/audio';

interface BuyLinkCardProps {
  purchasedLink: PurchasedLinkItem | null;
  onOpenBuyModal: () => void;
}

export const BuyLinkCard: React.FC<BuyLinkCardProps> = ({ purchasedLink, onOpenBuyModal }) => {
  const [timeLeft, setTimeLeft] = useState<number>(12 * 3600); // 12h in seconds

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (purchasedLink && purchasedLink.activationTimerEnd) {
      timer = setInterval(() => {
        const remaining = Math.max(0, Math.floor((purchasedLink.activationTimerEnd - Date.now()) / 1000));
        setTimeLeft(remaining);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [purchasedLink]);

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative rounded-2xl p-6 border transition-all duration-300 font-mono shadow-xl ${
      purchasedLink
        ? 'bg-gradient-to-r from-emerald-950 via-black to-emerald-950 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.35)]'
        : 'bg-black/90 border-emerald-500/70 hover:border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
    }`}>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left Side: Title & Description */}
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-900/80 border border-emerald-500/80 rounded-xl text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
              <LinkIcon className="w-5 h-5 text-emerald-400 animate-pulse" />
            </span>
            <span className="text-xs font-bold text-white uppercase tracking-widest bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-600/60">
              DIRECT ACCESS LINK SERVICE ($200)
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            BUY DIRECT PORTAL LINK
          </h2>
          
          <p className="text-xs text-emerald-400/90 leading-relaxed">
            Acquire a dedicated direct access link ($200). Upon crypto payment confirmation, an automated <strong className="text-white underline decoration-emerald-500">12-Hour Activation Timer</strong> starts, and the link will be dispatched directly to your email address.
          </p>
        </div>

        {/* Right Side: Action OR Active Timer */}
        <div className="w-full md:w-auto flex-shrink-0">
          {!purchasedLink ? (
            <button
              onClick={() => {
                playBeep(1000, 0.04);
                onOpenBuyModal();
              }}
              className="w-full md:w-auto py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 border border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Zap className="w-4 h-4 fill-black" /> APPLY NOW ($200 LINK SERVICE)
            </button>
          ) : (
            /* Active 12-Hour Timer Display */
            <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-400 text-emerald-300 space-y-2 shadow-inner w-full md:w-80">
              <div className="flex items-center justify-between text-xs font-bold border-b border-emerald-800 pb-2">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <Clock className="w-4 h-4 text-emerald-400 animate-spin" /> LINK ACTIVATION TIMER
                </span>
                <span className="text-xs bg-emerald-900 px-2 py-0.5 rounded border border-emerald-500 text-white">
                  {formatTimer(timeLeft)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-200 pt-1">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="truncate">Target Email: <strong className="text-white">{purchasedLink.email}</strong></span>
              </div>

              <div className="p-2 bg-black/80 rounded-lg border border-emerald-800 text-[10px] text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Link will be active within 12 hours and dispatched to your email.</span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
