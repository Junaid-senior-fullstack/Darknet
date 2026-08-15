import React from 'react';
import { CardItem } from '../types';
import { X, CheckCircle2, Mail, Clock, Sparkles, ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';
import { playSuccessChime } from '../utils/audio';

interface CardPurchaseNoticeModalProps {
  card: CardItem;
  userEmail?: string;
  onClose: () => void;
  onConfirm: (cardId: string) => void;
}

export const CardPurchaseNoticeModal: React.FC<CardPurchaseNoticeModalProps> = ({
  card,
  userEmail,
  onClose,
  onConfirm,
}) => {
  React.useEffect(() => {
    playSuccessChime();
  }, []);

  const handleConfirm = () => {
    onConfirm(card.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-mono">
      <div className="relative max-w-lg w-full bg-gradient-to-b from-emerald-950/90 via-black to-emerald-950/60 border border-emerald-400/80 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.35)] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-emerald-400 hover:text-white hover:bg-emerald-900/60 rounded-xl transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-400/50 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/60 text-emerald-300 text-[10px] font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-3 h-3 text-emerald-400" /> CARD PURCHASE SUCCESSFUL
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
            CONGRATULATIONS!
          </h2>
          <p className="text-xs text-emerald-400 mt-1">
            You have successfully purchased <span className="text-white font-bold">{card.title}</span> (${card.balance.toLocaleString()} Balance).
          </p>
        </div>

        {/* Notice Card Details Box */}
        <div className="space-y-3 mb-6">
          
          {/* Card Summary Badge */}
          <div className="p-4 rounded-xl bg-black/80 border border-emerald-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white uppercase block">{card.tier}</span>
                <span className="text-[10px] text-emerald-400">Card Price: ${card.price} USD</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-600">
              ${card.balance.toLocaleString()} BAL
            </span>
          </div>

          {/* Email Delivery Banner (Key requirement) */}
          <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-300 space-y-2 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <Mail className="w-4 h-4 text-emerald-400" /> EMAIL DISPATCH NOTICE
            </div>
            <p className="text-xs text-emerald-200 leading-relaxed">
              Congratulations! You have purchased this card. The details for <strong className="text-white">this card</strong> and your <strong className="text-white">previous card</strong> will be sent to your email address {userEmail ? <span className="text-emerald-400 font-bold">({userEmail})</span> : ''} within <span className="text-white font-bold underline decoration-emerald-400">2 hours</span>.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold pt-1 border-t border-emerald-800/80">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> ESTIMATED DELIVERY: WITHIN 2 HOURS
            </div>
          </div>

          {/* Guarantee Security Note */}
          <div className="p-3 rounded-lg bg-black/60 border border-emerald-900 text-[11px] text-emerald-400/80 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Includes 20-Hour Replacement Guarantee automatically attached.</span>
          </div>

        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 border border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          CONFIRM & VIEW CARD DETAILS <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
