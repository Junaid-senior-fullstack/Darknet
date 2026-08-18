import React from 'react';
import { UserJobData } from '../types';
import { Clock, Lock, Terminal, Cpu, Sparkles, ShieldCheck, RotateCcw, AlertTriangle } from 'lucide-react';

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

  // Calculate percentage of 24 hours passed (86,400 seconds total)
  const totalSeconds = 24 * 3600;
  const elapsed = Math.max(0, totalSeconds - timeRemaining);
  const progressPercent = Math.min(100, Math.max(0, Math.floor((elapsed / totalSeconds) * 100)));

  return (
    <div className="min-h-screen bg-black text-emerald-400 font-mono flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-emerald-900 selection:text-white">
      {/* Background Matrix Radial / CRT Grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#064e3b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-950/20 to-black pointer-events-none" />

      {/* Main Big Popup Container */}
      <div className="max-w-2xl w-full bg-gradient-to-b from-emerald-950/40 via-black to-emerald-950/30 border border-amber-500/60 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-[0_0_60px_rgba(245,158,11,0.2)] text-center relative z-10 space-y-6">
        
        {/* Top Maintenance Header Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/60 text-amber-300 text-xs font-extrabold uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse">
          <AlertTriangle className="w-4 h-4 text-amber-400" /> SYSTEM MAINTENANCE IN PROGRESS
        </div>

        {/* Lock / Maintenance Animation Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-black border-2 border-amber-500/80 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
          <Lock className="w-10 h-10 animate-pulse text-amber-400" />
          <div className="absolute -inset-1 rounded-2xl border border-amber-500/30 animate-ping pointer-events-none" />
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
        <div className="p-6 sm:p-8 rounded-2xl bg-black/90 border-2 border-amber-500/70 shadow-[inset_0_0_30px_rgba(245,158,11,0.15)] space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            MAINTENANCE ACCESS COUNTDOWN (24 HOURS TOTAL)
          </div>

          <div className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-widest font-mono drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]">
            {formatTime(timeRemaining)}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-emerald-950 rounded-full h-3 border border-emerald-800/80 p-0.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-amber-400/90 font-bold tracking-wider">
            <span>MAINTENANCE VERIFICATION PROGRESS</span>
            <span>{progressPercent}% COMPLETED</span>
          </div>
        </div>

        {/* English Maintenance & Apology Notice Box */}
        <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/50 text-left space-y-3 shadow-inner">
          <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300 uppercase tracking-wider">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-400" /> SCHEDULED SYSTEM MAINTENANCE NOTICE
          </div>
          
          <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed font-sans">
            We sincerely apologize for the inconvenience. Our technical engineering team is currently executing essential server maintenance, backend infrastructure upgrades, and database optimizations across our network.
          </p>

          <div className="p-3.5 rounded-xl bg-black/70 border border-amber-500/40 text-xs text-amber-300 space-y-1.5 font-sans">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> TIMER EXTENSION ANNOUNCEMENT
            </div>
            <p className="text-xs text-amber-100/90 leading-relaxed">
              To complete the security updates smoothly, the portal access countdown timer has been extended by an additional <strong>20 hours</strong> (total duration: <strong>24 hours</strong>).
            </p>
          </div>

          <p className="text-xs sm:text-sm text-emerald-300/80 leading-relaxed font-sans">
            Please keep this screen open or return after the countdown finishes. Access to the terminal portal and marketplace will unlock automatically as soon as maintenance is complete.
          </p>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-3 text-[11px]">
          <div className="p-2.5 rounded-xl bg-black/80 border border-amber-900/80 text-amber-400 flex items-center justify-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-amber-400" /> STATUS: MAINTENANCE ACTIVE
          </div>
          <div className="p-2.5 rounded-xl bg-black/80 border border-amber-900/80 text-amber-400 flex items-center justify-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" /> ENCRYPTION: AES-256 (UPGRADING)
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
