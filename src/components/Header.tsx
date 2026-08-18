import React from 'react';
import { UserJobData } from '../types';
import { Terminal, Clock, ShieldAlert, Volume2, VolumeX, RotateCcw, Cpu } from 'lucide-react';

interface HeaderProps {
  userData: UserJobData | null;
  portalTimeRemaining: number; // in seconds (starts at 14400 = 4h)
  isMuted: boolean;
  onToggleMute: () => void;
  onResetSession: () => void;
  onApplyNow?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userData,
  portalTimeRemaining,
  isMuted,
  onToggleMute,
  onResetSession,
  onApplyNow,
}) => {
  // Format seconds to HH:MM:SS or MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isWarning = portalTimeRemaining <= 300; // less than 5 minutes left

  return (
    <header className="sticky top-0 z-40 bg-black/90 border-b border-emerald-800/80 backdrop-blur-md px-4 py-3 text-emerald-400 font-mono shadow-[0_4px_20px_rgba(16,185,129,0.15)]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-950 border border-emerald-500/60 rounded-xl shadow-[0_0_12px_rgba(16,185,129,0.4)]">
              <Terminal className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg text-white tracking-wider">CYBERCARD</span>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-300 font-extrabold px-2 py-0.5 rounded border border-emerald-600/60 uppercase">
                  v9.4 TERMINAL
                </span>
              </div>
              <p className="text-[10px] text-emerald-500 hidden sm:block">
                OPERATIVE: {userData?.agentName || 'GUEST_OPERATOR'} | {userData?.clearanceLevel || 'LEVEL 5'}
              </p>
            </div>
          </div>

          {/* Mobile Sound & Reset */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onToggleMute}
              className="p-1.5 rounded-lg border border-emerald-800/80 bg-emerald-950/60 text-emerald-400 hover:border-emerald-500"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onResetSession}
              className="p-1.5 rounded-lg border border-emerald-800/80 bg-emerald-950/60 text-emerald-400 hover:border-emerald-500"
              title="Reset Terminal Session"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center System Status */}
        <div className="hidden md:flex items-center gap-4 text-xs text-emerald-400/80 bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-900">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            NODE: DARKNET-US-EAST
          </span>
          <span className="text-emerald-800">|</span>
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" /> ENCRYPTION: AES-256-GCM
          </span>
        </div>

        {/* Right Session Timer & Action Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          
          {/* 15-Min Session Timer */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-xs sm:text-sm tracking-wider shadow-md transition-all ${
              isWarning
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-emerald-950/80 border-emerald-500/70 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
            }`}
          >
            <Clock className={`w-4 h-4 ${isWarning ? 'text-rose-400' : 'text-emerald-400'}`} />
            <div className="flex flex-col text-right">
              <span className="text-[9px] uppercase tracking-widest text-emerald-400/70 opacity-80 leading-3">PORTAL SESSION</span>
              <span>{formatTime(portalTimeRemaining)}</span>
            </div>
          </div>

          {/* Apply Now Button & Desktop Controls */}
          <div className="flex items-center gap-2">
            {onApplyNow && (
              <button
                onClick={onApplyNow}
                className="py-1.5 px-3 sm:px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-200 border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center gap-1.5 cursor-pointer active:scale-98 animate-pulse"
              >
                APPLY NOW
              </button>
            )}

            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onToggleMute}
                className="p-2 rounded-xl border border-emerald-800/80 bg-emerald-950/60 text-emerald-400 hover:border-emerald-500 hover:bg-emerald-900/60 transition-all cursor-pointer"
                title={isMuted ? 'Unmute Audio Effects' : 'Mute Audio Effects'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
              <button
                onClick={onResetSession}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-800/80 bg-emerald-950/60 text-emerald-300 hover:border-emerald-500 hover:bg-emerald-900/60 transition-all text-xs font-bold cursor-pointer"
                title="Reset Flow"
              >
                <RotateCcw className="w-3.5 h-3.5" /> RESTART
              </button>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
