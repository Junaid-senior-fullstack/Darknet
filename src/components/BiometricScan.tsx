import React, { useState, useEffect, useRef } from 'react';
import { Fingerprint, ShieldCheck, Cpu, Terminal, AlertTriangle } from 'lucide-react';
import { playScanLaser, playSuccessChime, playBeep } from '../utils/audio';

interface BiometricScanProps {
  onComplete: () => void;
}

type ScanStage = 'IDLE_LEFT' | 'SCANNING_LEFT' | 'DONE_LEFT' | 'IDLE_RIGHT' | 'SCANNING_RIGHT' | 'DONE_RIGHT' | 'VERIFIED';

export const BiometricScan: React.FC<BiometricScanProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<ScanStage>('IDLE_LEFT');
  const [leftProgress, setLeftProgress] = useState(0); // 0 to 100%
  const [rightProgress, setRightProgress] = useState(0); // 0 to 100%
  const [leftTimeRemaining, setLeftTimeRemaining] = useState(4.0);
  const [rightTimeRemaining, setRightTimeRemaining] = useState(4.0);
  const [logMessages, setLogMessages] = useState<string[]>([
    'SYSTEM INITIALIZED :: BIOMETRIC AUTH v4.09',
    'AWAITING LEFT THUMBPRINT VERIFICATION...',
  ]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = (msg: string) => {
    setLogMessages((prev) => [...prev.slice(-6), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Handle Left Thumb Scan (4 Seconds)
  const startLeftScan = () => {
    if (stage !== 'IDLE_LEFT') return;
    setStage('SCANNING_LEFT');
    addLog('INITIATING SCAN: LEFT THUMBPRINT...');
    playScanLaser();

    const startTime = Date.now();
    const duration = 4000; // 4 seconds

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      const remaining = Math.max(0, (duration - elapsed) / 1000);

      setLeftProgress(progress);
      setLeftTimeRemaining(remaining);

      if (Math.floor(elapsed) % 600 < 50) {
        playBeep(900, 0.03);
      }

      if (elapsed >= duration) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setLeftProgress(100);
        setLeftTimeRemaining(0.0);
        setStage('DONE_LEFT');
        addLog('LEFT THUMBPRINT MATCHED (99.84% CONFIDENCE)');
        playSuccessChime();

        // Auto move to Right Thumb after 800ms
        setTimeout(() => {
          setStage('IDLE_RIGHT');
          addLog('AWAITING RIGHT THUMBPRINT VERIFICATION...');
        }, 800);
      }
    }, 50);
  };

  // Handle Right Thumb Scan (4 Seconds)
  const startRightScan = () => {
    if (stage !== 'IDLE_RIGHT') return;
    setStage('SCANNING_RIGHT');
    addLog('INITIATING SCAN: RIGHT THUMBPRINT...');
    playScanLaser();

    const startTime = Date.now();
    const duration = 4000; // 4 seconds

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      const remaining = Math.max(0, (duration - elapsed) / 1000);

      setRightProgress(progress);
      setRightTimeRemaining(remaining);

      if (Math.floor(elapsed) % 600 < 50) {
        playBeep(1100, 0.03);
      }

      if (elapsed >= duration) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setRightProgress(100);
        setRightTimeRemaining(0.0);
        setStage('VERIFIED');
        addLog('RIGHT THUMBPRINT MATCHED (99.91% CONFIDENCE)');
        addLog('BIOMETRIC DUAL-THUMB AUTHENTICATION SUCCESSFUL!');
        playSuccessChime();

        // Trigger complete callback to advance to Job Form screen
        setTimeout(() => {
          onComplete();
        }, 1200);
      }
    }, 50);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-emerald-400 font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-emerald-900 selection:text-emerald-200">
      {/* Matrix CRT Scanline Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#052e16_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-black pointer-events-none"></div>

      {/* Top Banner Header */}
      <div className="max-w-2xl w-full text-center mb-6 z-10">
        <div className="inline-flex items-center gap-2 border border-emerald-500/40 bg-emerald-950/40 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] mb-3">
          <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
          SYSTEM SECURITY LAYER :: BIOMETRIC AUTH v4.09
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]">
          DUAL THUMB VERIFICATION
        </h1>
        <p className="text-emerald-500/80 text-xs sm:text-sm mt-1 max-w-md mx-auto">
          Scan both Left & Right thumbs (4.0s scan per thumb) to calibrate neural encryption keys before system unlock.
        </p>
      </div>

      {/* Main Dual Scanner Container */}
      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 z-10">

        {/* LEFT THUMB SCANNER CARD */}
        <div
          className={`relative border rounded-2xl p-6 bg-emerald-950/20 backdrop-blur-md transition-all duration-300 flex flex-col items-center justify-between ${
            stage === 'SCANNING_LEFT'
              ? 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)] bg-emerald-900/30'
              : stage === 'DONE_LEFT' || stage === 'SCANNING_RIGHT' || stage === 'DONE_RIGHT' || stage === 'VERIFIED'
              ? 'border-emerald-500/60 bg-emerald-950/40'
              : 'border-emerald-800/50 hover:border-emerald-500/60'
          }`}
        >
          {/* Header Badge */}
          <div className="w-full flex items-center justify-between border-b border-emerald-800/40 pb-3 mb-4">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" /> LEFT THUMBPRINT
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold border border-emerald-700/50">
              {stage === 'DONE_LEFT' || stage === 'SCANNING_RIGHT' || stage === 'DONE_RIGHT' || stage === 'VERIFIED' ? 'PASS 100%' : `${leftTimeRemaining.toFixed(1)}s`}
            </span>
          </div>

          {/* Scanner Visual Box */}
          <div className="relative w-40 h-48 sm:w-48 sm:h-52 rounded-xl border border-emerald-500/30 bg-black/80 flex flex-col items-center justify-center overflow-hidden my-2 shadow-inner">
            {/* Grid overlay inside scanner */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#052e16_1px,transparent_1px),linear-gradient(to_bottom,#052e16_1px,transparent_1px)] bg-[size:12px_12px] opacity-60"></div>

            {/* Thumbprint Icon */}
            <Fingerprint
              className={`w-28 h-28 sm:w-32 sm:h-32 transition-all duration-300 ${
                stage === 'SCANNING_LEFT'
                  ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.9)] animate-pulse'
                  : stage === 'DONE_LEFT' || stage === 'SCANNING_RIGHT' || stage === 'DONE_RIGHT' || stage === 'VERIFIED'
                  ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                  : 'text-emerald-800 opacity-60'
              }`}
            />

            {/* Laser Line Animation during left scan */}
            {stage === 'SCANNING_LEFT' && (
              <div className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_15px_#10b981] animate-[bounce_1.2s_infinite]" />
            )}

            {/* Passed Check Icon overlay */}
            {(stage === 'DONE_LEFT' || stage === 'SCANNING_RIGHT' || stage === 'DONE_RIGHT' || stage === 'VERIFIED') && (
              <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2">
                <ShieldCheck className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,1)]" />
                <span className="text-xs font-bold text-white tracking-widest bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-500">
                  VERIFIED (4.0s)
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full mt-4">
            <div className="flex justify-between text-[11px] mb-1 font-semibold text-emerald-300">
              <span>SCAN PROGRESS</span>
              <span>{Math.round(leftProgress)}%</span>
            </div>
            <div className="w-full h-2.5 bg-black/80 rounded-full border border-emerald-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-100 ease-linear shadow-[0_0_10px_#10b981]"
                style={{ width: `${leftProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={startLeftScan}
            disabled={stage !== 'IDLE_LEFT'}
            className={`w-full mt-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 border flex items-center justify-center gap-2 cursor-pointer ${
              stage === 'IDLE_LEFT'
                ? 'bg-emerald-500 text-black border-emerald-400 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-98'
                : stage === 'SCANNING_LEFT'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-600 animate-pulse'
                : 'bg-emerald-950/40 text-emerald-600 border-emerald-900 cursor-not-allowed opacity-60'
            }`}
          >
            {stage === 'IDLE_LEFT' && 'PRESS TO SCAN LEFT THUMB (4.0s)'}
            {stage === 'SCANNING_LEFT' && `SCANNING... (${leftTimeRemaining.toFixed(1)}s)`}
            {(stage === 'DONE_LEFT' || stage === 'SCANNING_RIGHT' || stage === 'DONE_RIGHT' || stage === 'VERIFIED') && 'LEFT THUMB VERIFIED ✓'}
          </button>
        </div>

        {/* RIGHT THUMB SCANNER CARD */}
        <div
          className={`relative border rounded-2xl p-6 bg-emerald-950/20 backdrop-blur-md transition-all duration-300 flex flex-col items-center justify-between ${
            stage === 'SCANNING_RIGHT'
              ? 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)] bg-emerald-900/30'
              : stage === 'VERIFIED'
              ? 'border-emerald-500/60 bg-emerald-950/40'
              : stage === 'IDLE_RIGHT'
              ? 'border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'border-emerald-900/40 opacity-70'
          }`}
        >
          {/* Header Badge */}
          <div className="w-full flex items-center justify-between border-b border-emerald-800/40 pb-3 mb-4">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" /> RIGHT THUMBPRINT
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold border border-emerald-700/50">
              {stage === 'VERIFIED' ? 'PASS 100%' : `${rightTimeRemaining.toFixed(1)}s`}
            </span>
          </div>

          {/* Scanner Visual Box */}
          <div className="relative w-40 h-48 sm:w-48 sm:h-52 rounded-xl border border-emerald-500/30 bg-black/80 flex flex-col items-center justify-center overflow-hidden my-2 shadow-inner">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#052e16_1px,transparent_1px),linear-gradient(to_bottom,#052e16_1px,transparent_1px)] bg-[size:12px_12px] opacity-60"></div>

            {/* Thumbprint Icon */}
            <Fingerprint
              className={`w-28 h-28 sm:w-32 sm:h-32 transition-all duration-300 scale-x-[-1] ${
                stage === 'SCANNING_RIGHT'
                  ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.9)] animate-pulse'
                  : stage === 'VERIFIED'
                  ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                  : 'text-emerald-800 opacity-60'
              }`}
            />

            {/* Laser Line Animation during right scan */}
            {stage === 'SCANNING_RIGHT' && (
              <div className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_15px_#10b981] animate-[bounce_1.2s_infinite]" />
            )}

            {/* Passed Check Icon overlay */}
            {stage === 'VERIFIED' && (
              <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2">
                <ShieldCheck className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,1)]" />
                <span className="text-xs font-bold text-white tracking-widest bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-500">
                  VERIFIED (4.0s)
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full mt-4">
            <div className="flex justify-between text-[11px] mb-1 font-semibold text-emerald-300">
              <span>SCAN PROGRESS</span>
              <span>{Math.round(rightProgress)}%</span>
            </div>
            <div className="w-full h-2.5 bg-black/80 rounded-full border border-emerald-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-100 ease-linear shadow-[0_0_10px_#10b981]"
                style={{ width: `${rightProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={startRightScan}
            disabled={stage !== 'IDLE_RIGHT'}
            className={`w-full mt-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 border flex items-center justify-center gap-2 cursor-pointer ${
              stage === 'IDLE_RIGHT'
                ? 'bg-emerald-500 text-black border-emerald-400 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-98'
                : stage === 'SCANNING_RIGHT'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-600 animate-pulse'
                : stage === 'VERIFIED'
                ? 'bg-emerald-950/40 text-emerald-600 border-emerald-900 cursor-not-allowed'
                : 'bg-emerald-950/20 text-emerald-700 border-emerald-900 cursor-not-allowed opacity-50'
            }`}
          >
            {stage === 'IDLE_RIGHT' && 'PRESS TO SCAN RIGHT THUMB (4.0s)'}
            {stage === 'SCANNING_RIGHT' && `SCANNING... (${rightTimeRemaining.toFixed(1)}s)`}
            {stage === 'VERIFIED' && 'RIGHT THUMB VERIFIED ✓'}
            {stage !== 'IDLE_RIGHT' && stage !== 'SCANNING_RIGHT' && stage !== 'VERIFIED' && 'COMPLETE LEFT SCAN FIRST'}
          </button>
        </div>

      </div>

      {/* Realtime Terminal Console Log Output */}
      <div className="max-w-3xl w-full mt-6 bg-black/90 border border-emerald-800/60 rounded-xl p-4 font-mono text-xs z-10 shadow-lg">
        <div className="flex items-center justify-between border-b border-emerald-900 pb-2 mb-2 text-emerald-500 font-bold">
          <span className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" /> SYSTEM CONSOLE AUDIT LOG
          </span>
          <span className="text-[10px] text-emerald-600">ENCRYPTION: AES-256</span>
        </div>
        <div className="space-y-1 text-emerald-400/90 h-24 overflow-y-auto font-mono text-[11px]">
          {logMessages.map((msg, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-emerald-600">&gt;</span>
              <span>{msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
