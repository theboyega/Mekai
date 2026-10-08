import { useEffect } from 'react';
import { ScrollReveal } from '../components/ScrollReveal';
import { CheckCircle2, AlertCircle, Radio, Mail } from 'lucide-react';

interface ServiceStatusItem {
  name: string;
  status: 'Norminal' | 'Offline';
  category: string;
  uptime?: string;
}

export function StatusPage() {
  useEffect(() => {
    document.title = 'Mekai | Status';
  }, []);

  const services: ServiceStatusItem[] = [
    {
      name: 'Conversational assistant',
      status: 'Norminal',
      category: 'AI Diagnostic Core',
      uptime: '99.98%',
    },
    {
      name: 'OBD-II & DTC Parser',
      status: 'Norminal',
      category: 'Telemetry Ingestion',
      uptime: '100%',
    },
    {
      name: 'Acoustic Engine Analysis',
      status: 'Offline',
      category: 'Multimodal Audio Lab',
      uptime: 'Scheduled Maintenance',
    },
    {
      name: 'Visual Component Inspection',
      status: 'Offline',
      category: 'Computer Vision Services',
      uptime: 'Under Development',
    },
    {
      name: 'Diagnostic Report Generation',
      status: 'Norminal',
      category: 'Reporting & Export Engine',
      uptime: '99.95%',
    },
    {
      name: 'Torkara Procurement Bridge',
      status: 'Offline',
      category: 'External Marketplace Integration',
      uptime: 'Partner Sync Pending',
    },
    {
      name: 'User Authentication & Gate',
      status: 'Norminal',
      category: 'Security & Access Controls',
      uptime: '100%',
    },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-12 sm:py-16">
      {/* Document Header */}
        <ScrollReveal animation="fade-up" duration={480} delay={0}>
          <div className="border-b border-[#1E2525] pb-8 mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.03em] font-heading mb-3">
                  System Status Overview
                </h1>
                <p className="text-sm sm:text-base text-[#7E8B8B] font-medium font-heading">
                  Real-time telemetry and component availability for Mekai services
                </p>
              </div>

              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#131717] border border-[#232B2B] self-start sm:self-auto">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3B18A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A3B18A]"></span>
                </span>
                <span className="text-xs font-semibold text-[#A3B18A] tracking-wider uppercase">
                  Systems Monitored
                </span>
              </div>
            </div>

            {/* Operational banner */}
            <div className="mt-8 p-5 rounded-2xl bg-[#121616] border border-[#1E2525] flex items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#333C3C] hover:bg-[#151919] shadow-lg hover:shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#A3B18A]/10 border border-[#A3B18A]/20 flex items-center justify-center shrink-0">
                  <Radio className="w-5 h-5 text-[#A3B18A]" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-semibold text-white font-heading">
                    Core Diagnostic Pipeline Online
                  </p>
                  <p className="text-xs sm:text-sm text-[#8F9999]">
                    Conversational diagnosis, DTC code parsing, and authentication are operating normally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* System Services Status Table / List */}
        <div className="space-y-3">
          {services.map((service, index) => {
            const isNorminal = service.status === 'Norminal';

            return (
              <ScrollReveal
                key={index}
                animation="fade-up"
                duration={450}
                delay={index * 45}
              >
                <div
                  className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#121616] border border-[#1E2525] transition-all duration-300 hover:-translate-y-1 hover:border-[#333C3C] hover:bg-[#151919] shadow-lg hover:shadow-xl gap-4"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        isNorminal ? 'bg-[#A3B18A] shadow-[0_0_8px_rgba(163,177,138,0.6)]' : 'bg-[#D97706]'
                      }`}
                    />
                    <div className="truncate">
                      <p className="text-sm sm:text-base font-semibold text-white font-heading truncate">
                        {service.name}
                      </p>
                      <p className="text-xs text-[#707D7D] font-mono truncate">
                        {service.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-heading uppercase tracking-wider ${
                        isNorminal
                          ? 'bg-[#A3B18A]/15 text-[#A3B18A] border border-[#A3B18A]/30'
                          : 'bg-[#D97706]/15 text-[#F59E0B] border border-[#D97706]/30'
                      }`}
                    >
                      {isNorminal ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{service.status}</span>
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Support Callout */}
        <ScrollReveal animation="fade-up" duration={480} delay={100}>
          <div className="mt-12 p-6 rounded-2xl bg-[#121616] border border-[#1E2525] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#333C3C] hover:bg-[#151919] shadow-lg hover:shadow-xl">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#1A2121] border border-[#263131] flex items-center justify-center shrink-0 text-[#9EA8A8]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-semibold text-white font-heading">
                  Experiencing issues we haven’t listed?
                </p>
                <p className="text-xs sm:text-sm text-[#8F9999]">
                  Our engineering team is actively monitoring service health.
                </p>
              </div>
            </div>

            <a
              href="mailto:support@mekai.ai"
              className="px-5 py-2.5 rounded-full bg-transparent border border-[#2E3636] hover:border-[#A3B18A]/60 hover:bg-white/[0.03] active:scale-95 text-white text-xs sm:text-sm font-semibold font-heading transition-all duration-200 inline-flex items-center justify-center shrink-0 cursor-pointer"
            >
              Contact support@mekai.ai
            </a>
          </div>
        </ScrollReveal>
    </div>
  );
}
