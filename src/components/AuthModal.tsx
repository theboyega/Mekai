import React, { useState, useEffect } from 'react';
import { X, ArrowRight, CheckCircle2, KeyRound, AlertCircle, User } from 'lucide-react';
import { MekaiLogo } from './MekaiLogo';
import { isValidAccessCode, formatAccessCodeInput } from '../data/accessCodes';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'signup' | 'login';
  initialMode?: 'signup' | 'login';
  onAuthenticated?: (code: string, name?: string) => void;
  activeCode?: string | null;
}

export function AuthModal({
  isOpen,
  onClose,
  mode: controlledMode,
  initialMode = 'signup',
  onAuthenticated,
  activeCode = null,
}: AuthModalProps) {
  const [currentMode, setCurrentMode] = useState<'signup' | 'login'>(controlledMode || initialMode);
  // Two-step flow: 'code' first, then 'name' after code is authenticated
  const [step, setStep] = useState<'code' | 'name'>('code');
  const [accessCode, setAccessCode] = useState('');
  const [technicianName, setTechnicianName] = useState(() => {
    try {
      return localStorage.getItem('mekai_technician_name') || '';
    } catch {
      return '';
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [verifiedCode, setVerifiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (controlledMode) {
      setCurrentMode(controlledMode);
    }
  }, [controlledMode]);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setStep('code');
      if (controlledMode === 'login' && activeCode) {
        setAccessCode(activeCode);
      } else {
        setAccessCode('');
      }
    }
  }, [isOpen, activeCode, controlledMode]);

  if (!isOpen) return null;

  const activeMode = controlledMode || currentMode;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatAccessCodeInput(raw);
    setAccessCode(formatted);
    if (error) setError(null);
  };

  // Step 1: Validate code first
  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = accessCode.trim().toUpperCase();

    if (!cleanCode) {
      setError('Please enter a workshop access code.');
      return;
    }

    if (!isValidAccessCode(cleanCode)) {
      setError('Invalid access code. Please verify your 12-character invitation code.');
      return;
    }

    // Success: Code authenticated! Advance to Step 2 (Name setup)
    setError(null);
    setVerifiedCode(cleanCode);
    setStep('name');
  };

  // Step 2: Name submitted -> Open App
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = verifiedCode || accessCode.trim().toUpperCase();
    const finalName = technicianName.trim() || 'Adeyemi Tomiwa';

    try {
      localStorage.setItem('mekai_technician_name', finalName);
    } catch {
      // ignore
    }

    if (onAuthenticated && code) {
      onAuthenticated(code, finalName);
    }
  };

  const handleClose = () => {
    setError(null);
    setAccessCode('');
    setStep('code');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all"
    >
      <div className="w-full max-w-lg bg-[#121515] border border-[#252C2C] rounded-[24px] p-6 sm:p-8 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#181D1D] border border-[#2A3333] flex items-center justify-center text-[#8F9999] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'name' ? (
          /* ──────── STEP 2: NAME ASKED AFTER CODE AUTHENTICATED BEFORE APP OPENS ──────── */
          <div className="space-y-6 animate-fadeIn">
            {/* Authenticated Code Badge */}
            <div className="p-3.5 rounded-2xl bg-[#141C19] border border-[#22332B] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#A3B18A]/20 border border-[#A3B18A]/40 flex items-center justify-center text-[#A3B18A] shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#A3B18A] font-heading">
                    Access Code Verified
                  </div>
                  <div className="font-mono text-sm font-semibold text-white tracking-wider">
                    {verifiedCode}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep('code')}
                className="text-xs text-[#8A9A78] hover:text-white underline transition-colors"
              >
                Change code
              </button>
            </div>

            <div>
              <MekaiLogo iconSize={26} textSize="text-lg tracking-wider" />
              <h3 id="auth-modal-title" className="text-2xl font-extrabold text-[#A3B18A] mt-4 tracking-tight font-heading">
                What is your name?
              </h3>
              <p className="text-xs sm:text-sm text-[#8F9999] mt-1.5 leading-relaxed">
                Enter your name so it displays on your personal diagnostic dashboard and workshop reports.
              </p>
            </div>

            <form onSubmit={handleNameSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="technician-name-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#9EA8A8] mb-2 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-[#A3B18A]" />
                  <span>Technician / Specialist Name</span>
                </label>

                <input
                  id="technician-name-input"
                  type="text"
                  autoFocus
                  required
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  placeholder="e.g. Adeyemi Tomiwa"
                  className="w-full bg-[#181D1D] border border-[#2B3333] focus:border-[#A3B18A] focus:outline-none rounded-xl px-4 py-3.5 text-base text-white placeholder-[#525D5D] transition-colors"
                />
              </div>

              <button
                id="submit-technician-name-btn"
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-[0.99] text-[#0E1111] font-bold text-sm font-heading transition-all duration-200 flex items-center justify-center gap-2 group shadow-md"
              >
                <span>Enter Workshop</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        ) : (
          /* ──────── STEP 1: INPUT WORKSHOP ACCESS CODE FIRST ──────── */
          <div>
            <div className="mb-6">
              <MekaiLogo iconSize={26} textSize="text-lg tracking-wider" />
              <h3 id="auth-modal-title" className="text-2xl font-extrabold text-[#A3B18A] mt-4 tracking-tight">
                {activeMode === 'signup' ? 'Activate Workshop Access' : 'Technician Login'}
              </h3>
              <p className="text-xs sm:text-sm text-[#8F9999] mt-1.5 leading-relaxed">
                Mekai is currently in exclusive preview for automotive technicians. Enter your 12-character workshop access code to continue.
              </p>
            </div>

            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="access-code-input"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#9EA8A8] flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#A3B18A]" />
                    <span>Workshop Access Code</span>
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="access-code-input"
                    type="text"
                    maxLength={13}
                    required
                    autoFocus
                    value={accessCode}
                    onChange={handleInputChange}
                    placeholder="CST-XXXX-XXXX"
                    className={`w-full bg-[#181D1D] border ${
                      error ? 'border-red-500/80 focus:border-red-500' : 'border-[#2B3333] focus:border-[#A3B18A]'
                    } focus:outline-none rounded-xl px-4 py-3.5 text-base font-mono tracking-widest text-white placeholder-[#525D5D] transition-colors`}
                  />
                  {accessCode && isValidAccessCode(accessCode) && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A3B18A]">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </div>


                {error && (
                  <div className="flex items-center gap-1.5 text-xs text-red-400 mt-2 bg-red-950/30 border border-red-800/40 p-2.5 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <button
                id="submit-access-code-btn"
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-[0.99] text-[#0E1111] font-bold text-sm font-heading transition-all duration-200 flex items-center justify-center gap-2 group shadow-md"
              >
                <span>{activeMode === 'signup' ? 'Validate & authenticate access' : 'Authenticate technician'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#1F2525] flex items-center justify-between text-xs text-[#7A8585]">
              <span>
                {activeMode === 'signup' ? 'Existing workshop key? ' : 'New workshop license? '}
                <button
                  type="button"
                  onClick={() => setCurrentMode(activeMode === 'signup' ? 'login' : 'signup')}
                  className="text-[#A3B18A] hover:underline font-semibold ml-1"
                >
                  {activeMode === 'signup' ? 'Log in' : 'Activate code'}
                </button>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
