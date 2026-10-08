import { useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { AlertCircle, ArrowLeft, Home, FileText, Activity, HelpCircle } from 'lucide-react';

export function NotFoundPage() {
  const { navigate } = useRouter();

  useEffect(() => {
    document.title = 'Mekai | Not Found';
  }, []);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-16 sm:py-24 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#D97706]/10 border border-[#D97706]/20 flex items-center justify-center mb-6 text-[#F59E0B]">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading mb-4">
        Diagnostic Path Not Found
      </h1>

      <p className="text-sm sm:text-base text-[#9EA8A8] max-w-md leading-relaxed mb-8">
        The requested workshop URL does not exist or has been relocated to another subsystem.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 text-[#0E1111] font-heading font-semibold text-sm transition-all duration-200 shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 rounded-full bg-transparent border border-[#2E3636] hover:border-[#A3B18A]/60 hover:bg-white/[0.03] active:scale-95 text-white font-heading font-semibold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
        >
          <span>Launch Diagnostic Console</span>
        </button>
      </div>

      <div className="pt-8 border-t border-[#1C2121] w-full max-w-md">
        <p className="text-xs text-[#7E8B8B] font-mono mb-4">Quick Navigation</p>
        <div className="grid grid-cols-3 gap-2.5 text-xs">
          <button
            type="button"
            onClick={() => navigate('/docs')}
            className="p-3 rounded-2xl bg-[#121616] border border-[#1E2525] transition-all duration-300 hover:-translate-y-1 hover:border-[#333C3C] hover:bg-[#151919] shadow-lg hover:shadow-xl text-[#9EA8A8] hover:text-[#A3B18A] flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#A3B18A]" />
            <span>Docs</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/status')}
            className="p-3 rounded-2xl bg-[#121616] border border-[#1E2525] transition-all duration-300 hover:-translate-y-1 hover:border-[#333C3C] hover:bg-[#151919] shadow-lg hover:shadow-xl text-[#9EA8A8] hover:text-[#A3B18A] flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <Activity className="w-4 h-4 text-[#A3B18A]" />
            <span>Status</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/help')}
            className="p-3 rounded-2xl bg-[#121616] border border-[#1E2525] transition-all duration-300 hover:-translate-y-1 hover:border-[#333C3C] hover:bg-[#151919] shadow-lg hover:shadow-xl text-[#9EA8A8] hover:text-[#A3B18A] flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-[#A3B18A]" />
            <span>Help</span>
          </button>
        </div>
      </div>
    </div>
  );
}
