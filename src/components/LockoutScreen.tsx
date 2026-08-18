import React, { useState, useEffect } from 'react';
import { ShieldAlert, Clock, RotateCcw, Lock, Terminal, Cpu } from 'lucide-react';
import { playBeep } from '../utils/audio';

interface LockoutScreenProps {
  onReset: () => void;
}

export const LockoutScreen: React.FC<LockoutScreenProps> = ({ onReset }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(24 * 3600); // 24 hours in seconds

  useEffect(() => {
    playBeep(400, 0.3, 'sawtooth');
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const format24h = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black text-rose-500 font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Red Alert CRT Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#450a0a_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none"></div>

      <div className="max-w-xl w-full bg-rose-950/20 border border-rose-600/70 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_50px_rgba(244,63,94,0.3)] text-center relative z-10">
        
        {/* Warning Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-950 border border-rose-500/80 flex items-center justify-center mb-5 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse">
          <Lock className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950 border border-rose-800 text-[10px] font-bold uppercase tracking-widest text-rose-300 mb-3">
          <ShieldAlert className="w-3.5 h-3.5" /> 4-HOUR SESSION TERMINATED
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
          24-HOUR SECURITY LOCKOUT ACTIVE
        </h1>
        <p className="text-xs sm:text-sm text-rose-300/80 max-w-md mx-auto mb-6">
          The 4-hour portal operational window has expired. Terminal connection locked for safety protocol.
        </p>

        {/* 24-Hour Countdown Display */}
        <div className="p-5 rounded-xl bg-black/90 border border-rose-700/80 mb-6 shadow-inner">
          <span className="text-[10px] uppercase tracking-widest text-rose-400 block mb-1">LOCKOUT REMAINING TIME</span>
          <div className="text-3xl sm:text-4xl font-bold tracking-widest text-white font-mono drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]">
            {format24h(secondsLeft)}
          </div>
        </div>

        {/* Reset / Restore Button */}
        <button
          onClick={() => {
            playBeep(900, 0.05);
            onReset();
          }}
          className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 border border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <RotateCcw className="w-4 h-4" /> REFRESH & RE-INITIALIZE TERMINAL
        </button>

        <p className="text-[10px] text-emerald-500/80 mt-3">
          (Browser refresh / clicking button restores session as requested)
        </p>

      </div>
    </div>
  );
};
