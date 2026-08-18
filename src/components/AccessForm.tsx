import React, { useState, useEffect } from 'react';
import { UserJobData } from '../types';
import { ShieldCheck, Lock, ArrowRight, UserCheck, Briefcase, Key, Cpu, Terminal, Loader2, AlertTriangle } from 'lucide-react';
import { playAccessGranted, playBeep, playScanLaser } from '../utils/audio';

interface AccessFormProps {
  onSubmit: (data: UserJobData) => void;
}

export const AccessForm: React.FC<AccessFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<UserJobData>({
    agentName: '',
    roleJob: 'Security Analyst / Operator',
    clearanceLevel: 'LEVEL 5 - MATRIX ADMIN',
    accessCode: '',
    sessionKey: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTypingSequence, setIsTypingSequence] = useState(false);
  const [typedLogs, setTypedLogs] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    playBeep(800, 0.02);
    setErrorMessage(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // STRICT SESSION KEY VALIDATION: Must strictly equal "D@rknet5907"
    if (formData.sessionKey.trim() !== 'D@rknet5907') {
      playBeep(400, 0.2, 'sawtooth');
      setErrorMessage('ACCESS DENIED :: INVALID SESSION KEY! Access session key is invalid.');
      return;
    }

    setErrorMessage(null);
    playScanLaser();
    setIsTypingSequence(true);
    setTypedLogs([`[${new Date().toLocaleTimeString()}] INITIATING MATRIX PORTAL CONNECTION...`]);
  };

  // Automated hacker typing animation effect
  useEffect(() => {
    if (!isTypingSequence) return;

    const sequence = [
      `[>] INJECTING OPERATIVE ALIAS :: "${formData.agentName.toUpperCase()}"`,
      `[>] ROLE PROFILE :: "${formData.roleJob.toUpperCase()}"`,
      `[>] CLEARANCE :: ${formData.clearanceLevel}`,
      `[>] ACCESS KEY VALIDATION :: "${formData.accessCode}" [VERIFIED ✓]`,
      `[>] SESSION KEY VALIDATION :: "${formData.sessionKey}" [VERIFIED ✓]`,
      `[>] GENERATING AES-256 SESSION TOKEN...`,
      `[>] ESTABLISHING ENCRYPTED TOR PROXY RELAYS...`,
      `[>] NEURAL HANDSHAKE SUCCESSFUL (99.98% CONFIDENCE)`,
      `[>] ACCESS GRANTED :: REDIRECTING TO VIRTUAL CARDS TERMINAL...`,
    ];

    if (currentLineIndex < sequence.length) {
      const timer = setTimeout(() => {
        playBeep(1000 + currentLineIndex * 100, 0.03, 'square');
        setTypedLogs((prev) => [...prev, sequence[currentLineIndex]]);
        setCurrentLineIndex((prev) => prev + 1);
      }, 350);

      return () => clearTimeout(timer);
    } else {
      // Sequence completed -> Redirect to Landing Page Portal
      const redirectTimer = setTimeout(() => {
        playAccessGranted();
        onSubmit(formData);
      }, 700);

      return () => clearTimeout(redirectTimer);
    }
  }, [isTypingSequence, currentLineIndex, formData, onSubmit]);

  return (
    <div className="min-h-screen bg-black text-emerald-400 font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#052e16_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

      {/* Main Form Container */}
      <div className="max-w-xl w-full bg-emerald-950/20 border border-emerald-500/50 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(16,185,129,0.25)] relative z-10">
        
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-emerald-800/60 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-900/60 border border-emerald-500/60 text-emerald-400">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                OPERATIVE CLEARANCE FORM
              </h2>
              <p className="text-xs text-emerald-500/90">Enter job profile credentials to access terminal portal.</p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-[10px] font-bold bg-emerald-900/80 text-emerald-300 px-2.5 py-1 rounded border border-emerald-500/50 uppercase">
            STATUS: AUTHENTICATED
          </span>
        </div>

        {/* Form OR Hacker Terminal Typing Animation View */}
        {!isTypingSequence ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error Banner when session key validation fails */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-300 text-xs font-mono flex items-start gap-2.5 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-shake">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold uppercase tracking-wider block text-rose-200">VALIDATION ERROR</span>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Agent Alias / Name */}
            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase mb-1.5 flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Operative Alias / Name
              </label>
              <input
                type="text"
                name="agentName"
                required
                value={formData.agentName}
                onChange={handleChange}
                placeholder="e.g. Agent Phoenix, John Doe..."
                className="w-full bg-black/80 border border-emerald-700/60 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-4 py-3 text-sm text-emerald-200 placeholder-emerald-800 outline-none transition-all"
              />
            </div>

            {/* Job / Role Profile */}
            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase mb-1.5 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" /> Job Profile / Position Data
              </label>
              <input
                type="text"
                name="roleJob"
                required
                value={formData.roleJob}
                onChange={handleChange}
                placeholder="e.g. Lead Network Auditor, Crypto Analyst..."
                className="w-full bg-black/80 border border-emerald-700/60 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-4 py-3 text-sm text-emerald-200 placeholder-emerald-800 outline-none transition-all"
              />
            </div>

            {/* Clearance Level */}
            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase mb-1.5 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" /> System Clearance Level
              </label>
              <select
                name="clearanceLevel"
                value={formData.clearanceLevel}
                onChange={handleChange}
                className="w-full bg-black/80 border border-emerald-700/60 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-4 py-3 text-sm text-emerald-200 outline-none transition-all"
              >
                <option value="LEVEL 5 - MATRIX ADMIN">LEVEL 5 - MATRIX ADMIN (FULL ACCESS)</option>
                <option value="LEVEL 4 - CYBER OPERATIVE">LEVEL 4 - CYBER OPERATIVE</option>
                <option value="LEVEL 3 - NETWORK AUDITOR">LEVEL 3 - NETWORK AUDITOR</option>
                <option value="SPECIAL ASSIGNMENT">SPECIAL ASSIGNMENT PASS</option>
              </select>
            </div>

            {/* Passcode / Identifier */}
            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase mb-1.5 flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-emerald-400" /> Security Access Key
              </label>
              <input
                type="text"
                name="accessCode"
                required
                value={formData.accessCode}
                onChange={handleChange}
                placeholder="Enter access passcode..."
                className="w-full bg-black/80 border border-emerald-700/60 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-4 py-3 text-sm text-emerald-200 placeholder-emerald-800 outline-none transition-all font-mono tracking-widest"
              />
            </div>

            {/* Session Key */}
            <div>
              <label className="block text-xs font-bold text-emerald-300 uppercase mb-1.5 flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-emerald-400" /> Session Key *
              </label>
              <input
                type="password"
                name="sessionKey"
                required
                value={formData.sessionKey}
                onChange={handleChange}
                placeholder="Enter session key..."
                className={`w-full bg-black/80 border rounded-xl px-4 py-3 text-sm font-mono tracking-widest outline-none transition-all ${
                  errorMessage ? 'border-rose-500 text-rose-300' : 'border-emerald-700/60 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-emerald-200'
                }`}
              />
            </div>

            {/* Verification Banner */}
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-[11px] text-emerald-400/90 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Data will be encrypted with ephemeral 24-hour portal session token.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              INITIALIZE TERMINAL PORTAL <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* HACKER TYPING ANIMATION SCREEN */
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2 text-xs font-bold text-emerald-300">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" /> MATRIX TERMINAL EXECUTION...
              </span>
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
            </div>

            {/* Console Log Area */}
            <div className="p-4 bg-black/90 border border-emerald-800/80 rounded-xl h-64 overflow-y-auto space-y-2 text-xs font-mono shadow-inner">
              {typedLogs.map((log, index) => (
                <div key={index} className="text-emerald-400 animate-fade-in flex items-center gap-1.5">
                  <span className="text-emerald-300">{log}</span>
                </div>
              ))}
              <div className="flex items-center gap-1 text-emerald-400">
                <span className="inline-block w-2.5 h-4 bg-emerald-400 animate-pulse"></span>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800 text-[11px] text-emerald-400 text-center">
              ENCRYPTING PAYLOAD & CONNECTING TO CARDS PORTAL...
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-emerald-900/60 text-center text-[10px] text-emerald-600 flex items-center justify-center gap-2">
          <Terminal className="w-3 h-3 text-emerald-500" /> MATRIX PORTAL GATEWAY v9.4 // SESSION EXPIRATION 4h ACTIVE
        </div>
      </div>
    </div>
  );
};
