import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, KeyRound, AlertCircle, User } from 'lucide-react';
import { MekaiLogo, MekaiSpinner } from '../components/MekaiLogo';
import { isValidAccessCode, isRevokedAccessCode, formatAccessCodeInput } from '../data/accessCodes';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  mode?: 'signup' | 'login';
  onBack?: () => void;
  onAuthenticated?: (code: string, name?: string) => void;
  onCodeVerified?: (code: string) => void;
  activeCode?: string | null;
}

export function AuthPage({
  mode: controlledMode,
  onBack,
  onAuthenticated,
  onCodeVerified,
  activeCode: propActiveCode,
}: AuthPageProps) {
  const router = useRouter();
  const auth = useAuth();

  const queryMode = (router.searchParams.get('mode') as 'signup' | 'login') || 'signup';
  const resolvedMode = controlledMode || queryMode;
  const activeCode = propActiveCode !== undefined ? propActiveCode : auth.activeCode;

  const [currentMode, setCurrentMode] = useState<'signup' | 'login'>(resolvedMode);
  // Two-step flow: 'code' first, then 'name' after code is authenticated
  const [step, setStep] = useState<'code' | 'name'>('code');
  const [accessCode, setAccessCode] = useState('');
  const [technicianName, setTechnicianName] = useState(() => {
    try {
      return localStorage.getItem('mekai_technician_name') || auth.technicianName || '';
    } catch {
      return auth.technicianName || '';
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [verifiedCode, setVerifiedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated and visiting auth page without explicit props, redirect to dashboard
  useEffect(() => {
    if (auth.isAuthenticated && !onAuthenticated) {
      const prompt = router.searchParams.get('prompt');
      const target = prompt ? `/dashboard?prompt=${encodeURIComponent(prompt)}` : '/dashboard';
      router.navigate(target, { replace: true });
    }
  }, [auth.isAuthenticated, onAuthenticated, router]);

  useEffect(() => {
    setCurrentMode(resolvedMode);
    setError(null);
    setStep('code');
    if (resolvedMode === 'login' && activeCode) {
      setAccessCode(activeCode);
    } else {
      setAccessCode('');
    }
  }, [resolvedMode, activeCode]);

  const handleReturnHome = () => {
    if (onBack) {
      onBack();
    } else {
      router.navigate('/');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatAccessCodeInput(raw);
    setAccessCode(formatted);
    if (isRevokedAccessCode(formatted)) {
      setError('Access revoked');
    } else if (error) {
      setError(null);
    }
  };

  // Step 1: Validate code first
  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = accessCode.trim().toUpperCase();

    if (!cleanCode) {
      setError('Please enter a workshop access code.');
      return;
    }

    if (isRevokedAccessCode(cleanCode)) {
      setError('Access revoked');
      return;
    }

    if (!isValidAccessCode(cleanCode)) {
      setError('Invalid access code. Please verify your 12-character invitation code.');
      return;
    }

    // Success: Code authenticated! Persist immediately and advance to Step 2 (Name setup)
    try {
      localStorage.setItem('mekai_workshop_code', cleanCode);
    } catch {
      // ignore
    }
    onCodeVerified?.(cleanCode);
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setVerifiedCode(cleanCode);
      setStep('name');
    }, 350);
  };

  // Step 2: Name submitted -> Open App
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = verifiedCode || accessCode.trim().toUpperCase();
    const finalName = technicianName.trim() || 'Adeyemi Tomiwa';

    try {
      if (code) {
        localStorage.setItem('mekai_workshop_code', code);
      }
      localStorage.setItem('mekai_technician_name', finalName);
    } catch {
      // ignore
    }

    if (code) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        if (onAuthenticated) {
          onAuthenticated(code, finalName);
        } else {
          auth.login(code, finalName);
          const prompt = router.searchParams.get('prompt');
          const target = prompt ? `/dashboard?prompt=${encodeURIComponent(prompt)}` : '/dashboard';
          router.navigate(target);
        }
      }, 350);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1111] text-white font-sans selection:bg-[#A3B18A]/30 selection:text-white flex flex-col items-center justify-between relative overflow-x-clip text-center">
      {/* Main Centered Auth Card with Logo and Heading at the Top of the Card */}
      <main className="flex-1 w-full flex flex-col items-center justify-center p-4 sm:p-6 pt-10 sm:pt-14">
        <div className="w-full max-w-lg flex flex-col items-center text-center mx-auto">
          {/* Logo positioned at the top */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleReturnHome();
            }}
            className="group inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3B18A] rounded-lg shrink-0 leading-none cursor-pointer mb-6 sm:mb-7"
            aria-label="Mekai Homepage"
          >
            <MekaiLogo iconSize={44} showText={false} />
          </a>

          {/* Page Heading directly under the logo (outside the card) */}
          <h1
            id="auth-page-title"
            className={`text-xl sm:text-2xl font-extrabold text-[#A3B18A] tracking-tight font-heading text-center ${
              step === 'name' ? 'mb-6 sm:mb-8' : 'mb-2'
            }`}
          >
            {step === 'name'
              ? 'What is your name?'
              : currentMode === 'signup'
              ? 'Sign up'
              : 'Sign in'}
          </h1>

          {step !== 'name' && (
            <p className="text-xs sm:text-sm text-[#8F9999] leading-relaxed text-center max-w-md mx-auto mb-6 sm:mb-8">
              {currentMode === 'signup'
                ? 'Enter your 12-character workshop code to sign up.'
                : 'Enter your 12-character workshop code to sign in.'}
            </p>
          )}

          <div className="w-full bg-[#121515] border border-[#252C2C] rounded-[24px] p-6 sm:p-8 shadow-2xl relative text-white text-center animate-fadeIn">
            {step === 'name' ? (
              /* ──────── STEP 2: NAME ASKED AFTER CODE AUTHENTICATED BEFORE APP OPENS ──────── */
              <div className="space-y-6 animate-fadeIn flex flex-col items-center text-center">
                {/* Authenticated Code Badge */}
                <div className="w-full p-4 rounded-2xl bg-[#141C19] border border-[#22332B] flex flex-col items-center justify-center gap-2 text-center">
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#A3B18A]/20 border border-[#A3B18A]/40 flex items-center justify-center text-[#A3B18A] shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#A3B18A] font-heading">
                      Access Code Verified
                    </div>
                  </div>
                  <div className="font-mono text-sm font-semibold text-white tracking-wider">
                    {verifiedCode}
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('code')}
                    className="text-xs text-[#8A9A78] hover:text-white underline transition-colors cursor-pointer"
                  >
                    Change code
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-[#8F9999] leading-relaxed text-center max-w-md mx-auto">
                  Enter your name so it displays on your personal diagnostic dashboard and workshop reports.
                </p>

                <form onSubmit={handleNameSubmit} className="w-full space-y-5">
                  <div className="w-full text-left">
                    <label
                      htmlFor="technician-name-input"
                      className="text-xs font-semibold uppercase tracking-wider text-[#9EA8A8] mb-2 flex items-center justify-start gap-1.5 text-left"
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
                      className="w-full bg-[#181D1D] border border-[#2B3333] focus:border-[#A3B18A] focus:outline-none rounded-xl px-4 py-3.5 text-base text-white text-left placeholder-[#525D5D] transition-colors"
                    />
                  </div>

                  <button
                    id="submit-technician-name-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-[0.99] disabled:opacity-90 text-[#0E1111] font-bold text-sm font-heading transition-all duration-200 flex items-center justify-center gap-2 group shadow-md cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <MekaiSpinner size={18} color="#0E1111" />
                        <span>Opening Workshop...</span>
                      </>
                    ) : (
                      <>
                        <span>Enter Workshop</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* ──────── STEP 1: INPUT WORKSHOP ACCESS CODE FIRST ──────── */
              <div className="flex flex-col items-center text-center">
                <div className="w-full mb-6 text-left">
                  <p className="text-xs sm:text-sm text-[#8F9999] leading-relaxed text-left">
                    <span className="font-semibold text-[#A3B18A]">Disclaimer:</span> Beta preview slots share a limited daily test window. If limits are reached, please check back after the reset cycle.
                  </p>
                </div>

                <form onSubmit={handleCodeSubmit} className="w-full space-y-4">
                  <div className="w-full text-left">
                    <div className="flex items-center justify-start mb-2 w-full">
                      <label
                        htmlFor="access-code-input"
                        className="text-xs font-semibold uppercase tracking-wider text-[#9EA8A8] flex items-center justify-start gap-1.5 text-left"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-[#A3B18A]" />
                        <span>Workshop Access Code</span>
                      </label>
                    </div>

                    <div className="relative w-full">
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
                        } focus:outline-none rounded-xl px-4 py-3.5 text-base font-mono tracking-widest text-white text-left placeholder-[#525D5D] transition-colors`}
                      />
                      {accessCode && isValidAccessCode(accessCode) && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A3B18A]">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {error && (
                      <div className="w-full flex items-center justify-center gap-1.5 text-xs text-red-400 mt-2 bg-red-950/30 border border-red-800/40 p-2.5 rounded-lg text-center">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}
                  </div>

                  <button
                    id="submit-access-code-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-[0.99] disabled:opacity-90 text-[#0E1111] font-bold text-sm font-heading transition-all duration-200 flex items-center justify-center gap-2 group shadow-md cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <MekaiSpinner size={18} color="#0E1111" />
                        <span>Verifying Access...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {currentMode === 'signup' ? 'Sign up' : 'Sign in'}
                        </span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                <div className="w-full mt-6 pt-5 border-t border-[#1F2525] flex items-center justify-center text-center text-xs text-[#7A8585]">
                  <span>
                    {currentMode === 'signup' ? 'Already have an account? ' : 'Need an account? '}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentMode(currentMode === 'signup' ? 'login' : 'signup');
                        setError(null);
                      }}
                      className="text-[#A3B18A] hover:underline font-semibold ml-1 cursor-pointer"
                    >
                      {currentMode === 'signup' ? 'Sign in' : 'Sign up'}
                    </button>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Subtle Copyright Directly Below the Auth Card */}
          <footer className="w-full mt-6 sm:mt-8 text-center text-xs text-[#5A6565]">
            © {new Date().getFullYear()} Cestcore Limited. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
}
