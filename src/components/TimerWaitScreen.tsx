import React from 'react';
import { UserJobData } from '../types';
import { Clock, Lock, Terminal, Cpu, Sparkles, ShieldCheck, RotateCcw } from 'lucide-react';

interface TimerWaitScreenProps {
  userData: UserJobData | null;
  timeRemaining: number; // in seconds
  onResetSession: () => void;
}

export const TimerWaitScreen: React.FC<TimerWaitScreenProps> = ({
  userData,
  timeRemaining,
  onResetSession,
}) => {
  // Format seconds into HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate percentage of 4 hours passed (14400 seconds total)
  const totalSeconds = 4 * 3600;
  const elapsed = Math.max(0, totalSeconds - timeRemaining);
  const progressPercent = Math.min(100, Math.max(0, Math.floor((elapsed / totalSeconds) * 100)));

  return (
    <div className="min-h-screen bg-black text-emerald-400 font-mono flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-emerald-900 selection:text-white">
      {/* Background Matrix Radial / CRT Grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#064e3b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-950/20 to-black pointer-events-none" />

      {/* Main Big Popup Container */}
      <div className="max-w-2xl w-full bg-gradient-to-b from-emerald-950/40 via-black to-emerald-950/30 border border-emerald-500/60 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-[0_0_60px_rgba(16,185,129,0.25)] text-center relative z-10 space-y-6">
        
        {/* Top Header Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-xs font-extrabold uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse">
          <Sparkles className="w-4 h-4 text-emerald-400" /> MATRIX PORTAL ACCESS LOCK
        </div>

        {/* Lock Animation Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-black border-2 border-emerald-500/80 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
          <Lock className="w-10 h-10 animate-pulse text-emerald-400" />
          <div className="absolute -inset-1 rounded-2xl border border-emerald-500/30 animate-ping pointer-events-none" />
        </div>

        {/* User Operative Info Badge (if available) */}
        {userData && (
          <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-emerald-950/80 px-4 py-2 rounded-xl border border-emerald-800 text-xs text-emerald-300">
            <span>OPERATIVE: <strong className="text-white">{userData.agentName}</strong></span>
            <span className="text-emerald-700">|</span>
            <span>ROLE: <strong className="text-emerald-400">{userData.roleJob}</strong></span>
          </div>
        )}

        {/* BIG TIMER DISPLAY */}
        <div className="p-6 sm:p-8 rounded-2xl bg-black/90 border-2 border-emerald-500/70 shadow-[inset_0_0_30px_rgba(16,185,129,0.2)] space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-400/80 uppercase tracking-widest">
            <Clock className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
            PORTAL UNLOCK COUNTDOWN
          </div>

          <div className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-widest font-mono drop-shadow-[0_0_20px_rgba(16,185,129,0.9)]">
            {formatTime(timeRemaining)}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-emerald-950 rounded-full h-3 border border-emerald-800/80 p-0.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-emerald-500 font-bold tracking-wider">
            <span>VERIFICATION PROGRESS</span>
            <span>{progressPercent}% COMPLETED</span>
          </div>
        </div>

        {/* English Instructions & Notice Box */}
        <div className="p-5 rounded-2xl bg-emerald-950/50 border border-emerald-800/80 text-left space-y-2 shadow-inner">
          <div className="flex items-center gap-2 text-xs font-extrabold text-white uppercase tracking-wider">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" /> SYSTEM ACCESS NOTICE
          </div>
          <p className="text-xs sm:text-sm text-emerald-300/90 leading-relaxed font-sans">
            Once the timer completes, you will be able to access the portal automatically. Please keep this screen open or return after the 4-hour countdown finishes to view active terminal cards and marketplace features.
          </p>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-3 text-[11px]">
          <div className="p-2.5 rounded-xl bg-black/80 border border-emerald-900 text-emerald-400 flex items-center justify-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" /> STATUS: ACCESS PENDING
          </div>
          <div className="p-2.5 rounded-xl bg-black/80 border border-emerald-900 text-emerald-400 flex items-center justify-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" /> ENCRYPTION: AES-256
          </div>
        </div>

        {/* Reset / Re-initialize Option */}
        <div className="pt-2">
          <button
            onClick={onResetSession}
            className="text-xs text-emerald-500 hover:text-emerald-300 underline underline-offset-4 flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Re-enter Form Information
          </button>
        </div>

      </div>
    </div>
  );
};
