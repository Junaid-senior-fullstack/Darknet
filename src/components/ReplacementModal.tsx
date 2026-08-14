import React, { useState } from 'react';
import { CardItem } from '../types';
import { X, RefreshCw, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { playSuccessChime, playBeep } from '../utils/audio';

interface ReplacementModalProps {
  card: CardItem;
  onClose: () => void;
  onReplaceSuccess: (cardId: string, updatedCard: Partial<CardItem>) => void;
}

export const ReplacementModal: React.FC<ReplacementModalProps> = ({
  card,
  onClose,
  onReplaceSuccess,
}) => {
  const [reason, setReason] = useState('Declined Code 05 - Test Required Replacement');
  const [isReplacing, setIsReplacing] = useState(false);
  const [done, setDone] = useState(false);

  const handleReplacementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReplacing(true);
    playBeep(1100, 0.05);

    // Simulate instant automated card swap
    setTimeout(() => {
      setIsReplacing(false);
      setDone(true);
      playSuccessChime();

      // Generate replacement credentials
      const random4 = () => Math.floor(1000 + Math.random() * 9000);
      const newCardNumber = `${card.cardNumber.slice(0, 4)} ${random4()} ${random4()} ${random4()}`;
      const newCvv = Math.floor(100 + Math.random() * 900).toString();

      setTimeout(() => {
        onReplaceSuccess(card.id, {
          cardNumber: newCardNumber,
          cvv: newCvv,
          replacementTimerEnd: Date.now() + 20 * 3600 * 1000, // Reset 20-hour timer
        });
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-mono">
      <div className="relative max-w-lg w-full bg-black border border-amber-500/80 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(245,158,11,0.25)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-amber-500 hover:text-white hover:bg-amber-950 rounded-xl transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!done ? (
          <>
            {/* Header */}
            <div className="border-b border-amber-900/80 pb-4 mb-5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <RefreshCw className="w-4 h-4 animate-spin" /> 20-HOUR REPLACEMENT MODULE
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                REPLACE CARD: {card.title}
              </h2>
              <p className="text-xs text-amber-500/90 mt-1">
                Current Number: <span className="text-white font-bold">{card.cardNumber}</span>
              </p>
            </div>

            {/* Info Banner */}
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs mb-5 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                Automated replacement is allowed anytime within the active 20-hour window. A fresh card with identical balance (${card.balance}) will be dispatched immediately.
              </span>
            </div>

            {/* Replacement Reason Form */}
            <form onSubmit={handleReplacementSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase mb-1.5">
                  REASON FOR REPLACEMENT REQUEST
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-black border border-amber-800 focus:border-amber-400 rounded-xl px-4 py-3 text-xs text-amber-200 outline-none"
                >
                  <option value="Declined Code 05 - Test Required Replacement">Declined Code 05 - Test Required Replacement</option>
                  <option value="3D Secure Challenge Triggered">3D Secure Challenge Triggered</option>
                  <option value="Zip Code / AVS Mismatch">Zip Code / AVS Mismatch</option>
                  <option value="Merchant Test Blocked">Merchant Test Blocked</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isReplacing}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {isReplacing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> DISPATCHING REPLACEMENT...
                  </>
                ) : (
                  <>
                    GENERATE REPLACEMENT CARD INSTANTLY
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Replacement Done Screen */
          <div className="py-6 text-center flex flex-col items-center justify-center space-y-3">
            <CheckCircle className="w-14 h-14 text-emerald-400 animate-pulse" />
            <h3 className="text-xl font-bold text-white">REPLACEMENT CARD DISPATCHED!</h3>
            <p className="text-xs text-emerald-300">
              Fresh card credentials have been assigned and the 20-hour replacement window timer reset.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
