import React, { useState, useEffect } from 'react';
import { X, ArrowRight, CheckCircle2, KeyRound, AlertCircle } from 'lucide-react';
import { MekaiLogo } from './MekaiLogo';
import { isValidAccessCode, formatAccessCodeInput } from '../data/accessCodes';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'signup' | 'login';
  initialMode?: 'signup' | 'login';
  onAuthenticated?: (code: string) => void;
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
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verifiedCode, setVerifiedCode] = useState<string | null>(activeCode);

  useEffect(() => {
    if (controlledMode) {
      setCurrentMode(controlledMode);
    }
  }, [controlledMode]);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (activeCode) {
        setVerifiedCode(activeCode);
      }
    }
  }, [isOpen, activeCode]);

  if (!isOpen) return null;

  const activeMode = controlledMode || currentMode;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatAccessCodeInput(raw);
    setAccessCode(formatted);
    if (error) setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    // Success
    setError(null);
    setVerifiedCode(cleanCode);
    if (onAuthenticated) {
      onAuthenticated(cleanCode);
    }
  };

  const handleClose = () => {
    setError(null);
    setAccessCode('');
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

        {verifiedCode ? (
          /* Success Screen */
          <div className="py-6 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#A3B18A]/20 border border-[#A3B18A]/50 flex items-center justify-center text-[#A3B18A] mx-auto shadow-lg">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#A3B18A]">
                Workshop Access Active
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                Access Granted to Mekai
              </h3>
              <p className="text-xs sm:text-sm text-[#8F9999] leading-relaxed max-w-sm mx-auto mt-2">
                Your workshop license is verified and authenticated for real-time acoustic, OBD-II, and computer vision diagnostics.
              </p>
            </div>

            {/* Verified Credentials Card */}
            <div className="bg-[#181D1D] border border-[#252C2C] rounded-2xl p-4 text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#7A8585] uppercase tracking-wider font-semibold">Active Code</span>
                <span className="text-xs text-[#A3B18A] font-bold bg-[#A3B18A]/10 px-2 py-0.5 rounded-full border border-[#A3B18A]/30">
                  Verified Key
                </span>
              </div>
              <div className="font-mono text-base font-bold text-white tracking-wider">
                {verifiedCode}
              </div>
              <div className="text-[11px] text-[#7A8585] pt-2 border-t border-[#222828] flex items-center justify-between">
                <span>Cestcore Workshop Network</span>
                <span>Tier 1 Master Technician</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3.5 rounded-full bg-[#A3B18A] hover:bg-[#92A177] text-[#0E1111] font-semibold text-sm transition-all duration-200 shadow-md"
              >
                Enter Workshop
              </button>
              <button
                type="button"
                onClick={() => {
                  setVerifiedCode(null);
                  setAccessCode('');
                }}
                className="px-5 py-3.5 rounded-full bg-transparent border border-[#2E3636] hover:border-white text-xs font-medium text-[#8F9999] hover:text-white transition-colors"
              >
                Change Code
              </button>
            </div>
          </div>
        ) : (
          /* Access Code Entry Form */
          <div>
            <div className="mb-6">
              <MekaiLogo iconSize={26} textSize="text-lg tracking-wider" />
              <h3 id="auth-modal-title" className="text-2xl font-extrabold text-white mt-4 tracking-tight">
                {activeMode === 'signup' ? 'Activate Workshop Access' : 'Technician Login'}
              </h3>
              <p className="text-xs sm:text-sm text-[#8F9999] mt-1.5 leading-relaxed">
                Mekai is currently in exclusive preview for automotive technicians. Enter your 12-character workshop access code to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                <span>{activeMode === 'signup' ? 'Validate & activate access' : 'Authenticate technician'}</span>
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
