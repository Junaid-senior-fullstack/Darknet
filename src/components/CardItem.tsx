import React, { useState, useEffect } from 'react';
import { CardItem as CardItemType } from '../types';
import { CreditCard, DollarSign, RefreshCw, ShieldCheck, Copy, Check, Clock, ExternalLink, Key, Cpu, Zap } from 'lucide-react';
import { playBeep } from '../utils/audio';

interface CardItemProps {
  card: CardItemType;
  onBuy: (card: CardItemType) => void;
  onRequestReplacement: (card: CardItemType) => void;
}

export const CardItem: React.FC<CardItemProps> = ({ card, onBuy, onRequestReplacement }) => {
  const [copied, setCopied] = useState(false);
  const [replacementTimeLeft, setReplacementTimeLeft] = useState<number>(20 * 3600); // 20 hours in seconds

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (card.purchased && card.replacementTimerEnd) {
      timer = setInterval(() => {
        const remaining = Math.max(0, Math.floor((card.replacementTimerEnd! - Date.now()) / 1000));
        setReplacementTimeLeft(remaining);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [card.purchased, card.replacementTimerEnd]);

  const formatHours = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyCardDetails = () => {
    const text = `Card Number: ${card.cardNumber}\nExpiry: ${card.expDate}\nCVV: ${card.cvv}\nBalance: $${card.balance}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    playBeep(1200, 0.05);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between font-mono ${
      card.purchased
        ? 'bg-gradient-to-br from-emerald-950/80 via-black to-emerald-950/50 border-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
        : 'bg-black/80 hover:bg-emerald-950/20 border-emerald-800/60 hover:border-emerald-500/70 shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]'
    }`}>
      
      {/* Top Badge Tier & Status */}
      <div className="flex items-center justify-between border-b border-emerald-900/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-900/60 border border-emerald-700/60 text-emerald-400">
            <CreditCard className="w-4 h-4" />
          </span>
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block">{card.tier}</span>
            <span className="text-[10px] text-emerald-500">{card.country}</span>
          </div>
        </div>

        {card.purchased ? (
          <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-500 text-black px-2.5 py-1 rounded-full uppercase shadow-[0_0_10px_#10b981]">
            <ShieldCheck className="w-3.5 h-3.5" /> UNLOCKED
          </span>
        ) : (
          <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-700 uppercase">
            BIN: {card.bin}
          </span>
        )}
      </div>

      {/* Visual Credit Card Graphics */}
      <div className={`relative p-5 rounded-xl border mb-5 overflow-hidden transition-all ${
        card.purchased
          ? 'bg-gradient-to-r from-emerald-900 via-emerald-950 to-black border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
          : 'bg-gradient-to-r from-emerald-950/90 via-black to-emerald-950/40 border-emerald-800/80'
      }`}>
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Cpu className="w-24 h-24 text-emerald-300" />
        </div>

        {/* Card Header Type */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> {card.cardType} CYBER
          </div>
          {/* SIM Chip Icon */}
          <div className="w-8 h-6 bg-gradient-to-br from-amber-300 to-amber-600 rounded-sm border border-amber-200/50 flex items-center justify-center shadow-sm">
            <div className="w-6 h-4 border-t border-b border-amber-900/60"></div>
          </div>
        </div>

        {/* Card Number display */}
        <div className="mb-4">
          <span className="text-[10px] text-emerald-500 uppercase block tracking-widest mb-0.5">CARD NUMBER</span>
          <p className="text-base sm:text-lg font-bold tracking-widest text-white drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]">
            {card.purchased ? card.cardNumber : `${card.cardNumber.slice(0, 9)} **** ****`}
          </p>
        </div>

        {/* Card Expiry & CVV */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[9px] text-emerald-500 uppercase block tracking-wider">EXP DATE</span>
            <span className="text-emerald-200 font-bold">{card.purchased ? card.expDate : '**/**'}</span>
          </div>
          <div>
            <span className="text-[9px] text-emerald-500 uppercase block tracking-wider">CVV CODE</span>
            <span className="text-emerald-200 font-bold">{card.purchased ? card.cvv : '***'}</span>
          </div>
        </div>
      </div>

      {/* Price vs Balance Highlights */}
      <div className="grid grid-cols-2 gap-3 mb-5 p-3 rounded-xl bg-black/70 border border-emerald-900/80">
        <div>
          <span className="text-[10px] text-emerald-500 uppercase block tracking-wider font-semibold">BUY PRICE</span>
          <span className="text-lg font-bold text-emerald-400 flex items-center">
            ${card.price}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-emerald-500 uppercase block tracking-wider font-semibold">CARD BALANCE</span>
          <span className="text-lg font-bold text-emerald-300 flex items-center drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]">
            ${card.balance.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Conditional Content: BEFORE BUY vs AFTER BUY */}
      {!card.purchased ? (
        <button
          onClick={() => {
            playBeep(1000, 0.04);
            onBuy(card);
          }}
          className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <DollarSign className="w-4 h-4" /> BUY CARD FOR ${card.price} (CRYPTO)
        </button>
      ) : (
        <div className="space-y-3">
          
          {/* 20-HOUR REPLACEMENT TIMER BANNER */}
          <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/70 text-emerald-300 flex flex-col gap-1.5 shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Clock className="w-3.5 h-3.5 animate-spin" /> REPLACEMENT GUARANTEE
              </span>
              <span className="text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-600 font-mono">
                {formatHours(replacementTimeLeft)}
              </span>
            </div>
            <p className="text-[10px] text-emerald-400/80">
              Automatic 20-hour window active. Replace if card encounters decline during testing.
            </p>
          </div>

          {/* Action Buttons: Copy Credentials & Request Replacement */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={copyCardDetails}
              className="py-2.5 px-3 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-600 text-emerald-300 font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
              {copied ? 'COPIED!' : 'COPY DATA'}
            </button>

            <button
              onClick={() => onRequestReplacement(card)}
              className="py-2.5 px-3 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/80 text-amber-300 font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.2)]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> REPLACE CARD
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
