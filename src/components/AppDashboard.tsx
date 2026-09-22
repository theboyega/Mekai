import { useState, useRef, useEffect } from 'react';
import {
  SquarePen,
  Search,
  ChevronDown,
  Settings,
  Plus,
  Mic,
  ArrowUp,
  LogOut,
  ShieldCheck,
  X
} from 'lucide-react';
import { MekaiLogo } from './MekaiLogo';

interface AppDashboardProps {
  activeCode: string | null;
  technicianName?: string;
  onSignOut: () => void;
  onViewLanding?: () => void;
}

export interface ChatMessage {
  id: string;
  sender: 'engineer' | 'mekai';
  text: string;
  timestamp: string;
}

export interface RecentChatSession {
  id: string;
  title: string;
  snippet: string;
  date: string;
  messages: ChatMessage[];
}

const INITIAL_RECENT_SESSIONS: RecentChatSession[] = [
  {
    id: 'chat-p0300',
    title: '2018 Ford F-150 3.5L EcoBoost',
    snippet: 'P0300 Random/Multiple Cylinder Misfire Detected',
    date: '2h ago',
    messages: [
      {
        id: 'p0300-1',
        sender: 'engineer',
        text: '2018 Ford F-150 3.5L EcoBoost throwing P0300 under hard acceleration on highway.',
        timestamp: '10:14 AM',
      },
      {
        id: 'p0300-2',
        sender: 'mekai',
        text: 'Diagnostic Analysis: 2018 Ford F-150 3.5L EcoBoost — P0300\n\nUnder high boost and load conditions, the 3.5L EcoBoost ignition system demands peak secondary voltage. The primary failure pathways are:\n\n1. Spark Plug Carbon Tracking & Gap Widening: Factory plugs with over 35,000 miles frequently suffer gap erosion exceeding 0.035 in, blowing out the spark under boost. Recommend Motorcraft SP-578 (or latest OE revision) gapped strictly to 0.028–0.030 in.\n\n2. Coil-on-Plug (COP) Boot Breakdown: Inspect the rubber dielectric boots on cylinders 2 and 5 for white flashover carbon tracking traces.\n\n3. High-Pressure Fuel Rail Pressure: Verify commanded vs actual high-pressure rail PSI (should maintain 2,100+ PSI under wide-open throttle).\n\nPinpoint Action: Check freeze frame data for cylinder-specific misfire counts in Mode $06 to pinpoint if cylinder 2 or 5 is the dominant contributor.',
        timestamp: '10:14 AM',
      },
    ],
  },
  {
    id: 'chat-knock',
    title: '2021 BMW M340i B58',
    snippet: 'Acoustic inspection: metallic rattle on decel',
    date: 'Yesterday',
    messages: [
      {
        id: 'knock-1',
        sender: 'engineer',
        text: 'Acoustic inspection on 2021 BMW M340i B58: metallic buzzing rattle on deceleration from 2,000 RPM.',
        timestamp: '3:20 PM',
      },
      {
        id: 'knock-2',
        sender: 'mekai',
        text: 'Acoustic Diagnostic Analysis: B58 Turbocharger Assembly\n\nSignature Classification:\nHigh probability of Electronic Wastegate (EWG) linkage pivot wear or actuator bushing play. This produces a characteristic tinny metallic vibration specifically upon off-throttle coast down between 1,800–2,400 RPM.\n\nSecondary Possibilities:\n• Downpipe heat shield bracket hairline fatigue crack near catalytic converter inlet.\n• Exhaust flap actuator pivot spring loose inside right-hand muffler tailpipe.\n\nRecommended Physical Check:\n1. With engine cold, manually grab the EWG actuator rod on the hot side of the turbo. If lateral play exceeds 1.5mm, verify if BMW technical service bulletin for wastegate linkage clip retro-fit applies.\n2. Use an acoustic stethoscope probe placed on the turbine housing while manually varying throttle to isolate.',
        timestamp: '3:21 PM',
      },
    ],
  },
  {
    id: 'chat-p0420',
    title: '2019 Toyota Camry 2.5L',
    snippet: 'P0420 Catalyst System Efficiency Below Threshold',
    date: '3d ago',
    messages: [
      {
        id: 'p0420-1',
        sender: 'engineer',
        text: '2019 Toyota Camry 2.5L throwing P0420. Downstream O2 sensor was recently replaced by customer.',
        timestamp: '11:05 AM',
      },
      {
        id: 'p0420-2',
        sender: 'mekai',
        text: 'Diagnostic Analysis: Toyota A25A-FKS — P0420\n\nSince the downstream sensor was already renewed, focus diagnostic isolation on catalytic converter conversion efficiency and exhaust integrity:\n\n1. Downstream O2S Signal Cross-Check: Monitor Bank 1 Sensor 2 voltage at warm 2,500 RPM steady state. An active converter should hold the sensor steadily between 0.65V and 0.78V. If the signal swings synchronously between 0.1V and 0.9V with the air-fuel ratio sensor, converter oxygen storage capacity has depleted.\n\n2. Exhaust Flange Leak Check: The manifold-to-converter donut gasket frequently develops subtle leaks that pull outside air in on decel, falsely triggering P0420.\n\n3. Thermal Delta: Use thermal imaging or infrared gun. Outlet temperature should be at least 35°C hotter than inlet.',
        timestamp: '11:06 AM',
      },
    ],
  },
];

function getMekaiDiagnosticResponse(prompt: string, technicianName: string): string {
  const p = prompt.toLowerCase();
  const firstName = technicianName.trim().split(/\s+/)[0] || 'Technician';

  if (p.includes('p0300') || p.includes('misfire')) {
    return `Diagnostic Analysis: P0300 — Random / Multiple Cylinder Misfire Detected\n\nPossible Causes:\n• Ignition System: Worn spark plug gap erosion (>0.035 in) or secondary coil pack insulation breakdown.\n• Fuel Delivery: Fuel rail pressure drop under load, partially clogged fuel injector nozzles.\n• Air/Vacuum: Vacuum leak downstream of Mass Air Flow (MAF) sensor, sticking intake runner valves.\n• Mechanical: Sticky valve guides or uneven cylinder compression balance.\n\nRecommended Diagnostic Steps:\n1. Hook up the diagnostic interface and inspect live misfire counters (Mode $06) to identify if the misfires isolate to a specific bank or cylinder.\n2. Verify Short-Term Fuel Trim (STFT) and Long-Term Fuel Trim (LTFT) at idle vs 2,500 RPM to distinguish between unmetered air intake and fuel delivery deficiency.\n3. Perform a relative compression test and inspect secondary ignition waveforms with a lab scope.`;
  }

  if (p.includes('p0420') || p.includes('catalyst') || p.includes('catalytic')) {
    return `Diagnostic Analysis: P0420 — Catalyst System Efficiency Below Threshold (Bank 1)\n\nPrimary Causes:\n• Catalytic Converter washcoat degradation or internal honeycombed ceramic substrate breakdown.\n• Downstream Oxygen Sensor (O2S Bank 1 Sensor 2) lazy switching response or heater circuit degradation.\n• Exhaust manifold crack or donut flange leak introducing ambient oxygen upstream of downstream sensor.\n\nRecommended Diagnostic Steps:\n1. Graph upstream Wideband Air-Fuel sensor and downstream O2 sensor voltages during steady 2,000 RPM cruise. Downstream sensor should maintain a steady 0.65V–0.78V voltage line without oscillating.\n2. Inspect fuel trim history to verify the engine has not suffered prior unburned fuel dumping or oil wash.\n3. Take infrared thermal measurements across converter inlet and outlet. Outlet must be 30°C–60°C hotter than inlet during active conversion.`;
  }

  if (p.includes('p0171') || p.includes('lean')) {
    return `Diagnostic Analysis: P0171 — System Too Lean (Bank 1)\n\nPrimary Causes:\n• Unmetered vacuum leak (PCV valve diaphragm, intake manifold runner gaskets, brake booster check valve).\n• Contaminated Mass Air Flow (MAF) sensor hot-wire under-reporting intake air volume.\n• Low fuel delivery pressure or restricted high-pressure fuel pump (HPFP).\n\nRecommended Diagnostic Steps:\n1. Compare Long-Term Fuel Trims (LTFT) at idle versus cruising speed. If trim improves significantly at high RPM, confirm a vacuum leak.\n2. Smoke test the intake tract downstream of the throttle body.\n3. Verify MAF sensor gram-per-second readings against OEM target specifications at operating temperature.`;
  }

  if (p.includes('hey') || p.includes('hello') || p.includes('mekai') || p.trim() === 'hi') {
    return `Hello! I am Mekai, your automotive diagnostic assistant from Cestcore Limited.\n\nIt is great to connect with you, ${firstName}. How are you doing today, and what vehicle or issue are we looking at in the workshop?`;
  }

  if (p.includes('knock') || p.includes('noise') || p.includes('sound') || p.includes('rattle') || p.includes('acoustic')) {
    return `Acoustic Diagnostic Analysis: Mechanical Noise Isolation\n\nSignature Classification:\n• Deep metallic hollow thud (100–300 Hz) that intensifies directly under torque load: High probability of connecting rod bearing clearance wear or crankshaft journal damage.\n• Sharp rhythmic ticking at half engine speed: Valve train origin (hydraulic lifter bleed-down, loose rocker arm, or cam lobe wear).\n• Light metallic buzzing during cold off-throttle decel: Common turbocharger electronic wastegate (EWG) linkage rattle or exhaust heat shield bracket fatigue.\n\nRecommended Pinpoint Steps:\n1. Perform cylinder power balance / drop test: if deep knock softens when cutting fuel/spark to an individual cylinder, isolate rod bearing on that pin.\n2. Cut open and inspect the oil filter element for non-ferrous bronze/copper glitter.`;
  }

  return `Diagnostic Assessment: "${prompt}"\n\n1. Initial Diagnostic Overview:\nAnalyzing vehicle operating parameters, sensor telemetry, and component failure probability for this reported condition.\n\n2. Pinpoint Test Sequence:\n• Connect diagnostic scan interface and poll all vehicle modules for active, pending, and permanent DTCs.\n• Review Freeze Frame data to isolate exact RPM, engine coolant temperature, and calculated engine load at the moment of failure.\n• Perform visual harness inspection and reference voltage backprobe at affected sensor connectors.\n\n3. Verification & Resolution:\nFollowing physical repair or component renewal, clear fault history, run OEM drive-cycle monitors, and verify live telemetry under road-test conditions.`;
}

function renderMekaiText(text: string) {
  const paragraphs = text.split('\n\n');
  return (
    <>
      {paragraphs.map((p, idx) => {
        const lines = p.split('\n');
        return (
          <div key={idx} className="space-y-1.5">
            {lines.map((line, lineIdx) => {
              if (line.startsWith('• ') || line.startsWith('- ')) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-[#A3B18A] mt-1 shrink-0 font-bold">•</span>
                    <span className="text-[#DDE3E3]">{line.replace(/^[•-]\s*/, '')}</span>
                  </div>
                );
              }
              if (/^\d+\.\s/.test(line)) {
                const num = line.match(/^(\d+)\.\s/)?.[1];
                const content = line.replace(/^\d+\.\s*/, '');
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-[#A3B18A] font-semibold font-mono shrink-0">{num}.</span>
                    <span className="text-[#DDE3E3]">{content}</span>
                  </div>
                );
              }
              return (
                <p key={lineIdx} className="text-[#DDE3E3] leading-relaxed">
                  {line}
                </p>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'T';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Array of professional workshop variations always including the user's first name
export const WORKSHOP_GREETINGS: Array<(name: string) => string> = [
  (name) => `Ready for diagnostics, ${name}?`,
  (name) => `What are we wrenching on today, ${name}?`,
  (name) => `Standing by for fault codes, ${name}?`,
  (name) => `What vehicle is on the lift today, ${name}?`,
  (name) => `Ready to track down that fault, ${name}?`,
  (name) => `What's in the bay today, ${name}?`,
  (name) => `Systems primed and ready, ${name}?`,
  (name) => `What problem are we solving today, ${name}?`,
];

export function AppDashboard({ activeCode, technicianName, onSignOut, onViewLanding }: AppDashboardProps) {
  // 1. Sidebar open by default on desktop viewports
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  // 2. Active tab: 'new-diagnostics' or 'search-chats'
  const [activeTab, setActiveTab] = useState<'new-diagnostics' | 'search-chats'>('new-diagnostics');
  // State for diagnostics prompt and search
  const [promptInput, setPromptInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  // Settings menu modal/popover
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Active chat conversation messages and analyzing state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentSessions, setRecentSessions] = useState<RecentChatSession[]>(INITIAL_RECENT_SESSIONS);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Resolved technician name and first name for prompt greeting
  const displayName = technicianName || 'Adeyemi Tomiwa';
  const firstName = displayName.trim().split(/\s+/)[0] || 'Adeyemi';
  const initials = getInitials(displayName);

  // Dynamic greeting randomization: initial load / page refresh picks randomly
  const [greetingIndex, setGreetingIndex] = useState(() =>
    Math.floor(Math.random() * WORKSHOP_GREETINGS.length)
  );

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAnalyzing]);

  // Session reset helper: resets input, messages, ensures new-diagnostics view, and randomizes greeting
  const resetDiagnosticsSession = () => {
    setActiveTab('new-diagnostics');
    setPromptInput('');
    setMessages([]);
    setIsAnalyzing(false);
    setGreetingIndex((prev) => {
      let next = Math.floor(Math.random() * WORKSHOP_GREETINGS.length);
      if (WORKSHOP_GREETINGS.length > 1 && next === prev) {
        next = (next + 1) % WORKSHOP_GREETINGS.length;
      }
      return next;
    });
  };

  // Submit diagnostic prompt handler
  const handlePromptSubmit = (promptOverride?: string) => {
    const textToSubmit = (promptOverride !== undefined ? promptOverride : promptInput).trim();
    if (!textToSubmit || isAnalyzing) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-eng`,
      sender: 'engineer',
      text: textToSubmit,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setPromptInput('');
    setIsAnalyzing(true);

    setTimeout(() => {
      const mekaiResponseText = getMekaiDiagnosticResponse(textToSubmit, displayName);
      const mekaiMsg: ChatMessage = {
        id: `msg-${Date.now()}-mek`,
        sender: 'mekai',
        text: mekaiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, mekaiMsg]);
      setIsAnalyzing(false);

      // Add to recent sessions
      setRecentSessions((prev) => {
        const title = textToSubmit.length > 34 ? textToSubmit.substring(0, 34) + '...' : textToSubmit;
        const exists = prev.find((s) => s.title.toLowerCase() === title.toLowerCase());
        if (exists) return prev;
        return [
          {
            id: `session-${Date.now()}`,
            title,
            snippet: mekaiResponseText.substring(0, 50) + '...',
            date: 'Just now',
            messages: [userMsg, mekaiMsg],
          },
          ...prev,
        ];
      });
    }, 400);
  };

  const handleOpenRecentSession = (session: RecentChatSession) => {
    setMessages(session.messages);
    setActiveTab('new-diagnostics');
    setMobileDrawerOpen(false);
  };

  return (
    <div id="app-dashboard" className="h-screen w-screen bg-[#0E1111] text-white flex overflow-hidden font-sans selection:bg-[#A3B18A]/30 selection:text-white">
      {/* ─────────────────────────────────────────────────────────────
          MOBILE FULL-SCREEN DRAWER (Matching 'app drawer active.png')
      ───────────────────────────────────────────────────────────── */}
      {mobileDrawerOpen && (
        <div
          id="mobile-drawer"
          className="md:hidden fixed inset-0 z-50 bg-[#0E1111] flex flex-col justify-between p-6 animate-fadeIn select-none"
        >
          {/* Top Bar: Logo & Close Button */}
          <div>
            {/* Top Bar: Logo & Close Button - Locked to exact grid and w-9 h-9 controls */}
            <div className="flex items-center justify-between h-9 mb-12">
              <div
                className="cursor-pointer flex items-center gap-3.5 h-9"
                onClick={() => {
                  resetDiagnosticsSession();
                  setMobileDrawerOpen(false);
                }}
              >
                <div className="w-9 h-9 flex items-center justify-center shrink-0">
                  <MekaiLogo iconSize={32} showText={false} />
                </div>
                <span className="font-heading font-extrabold text-xl tracking-widest text-[#A3B18A] select-none leading-none">
                  MEKAI
                </span>
              </div>

              {/* Sage Green Circular Close Button with dark 'X' */}
              <button
                id="mobile-drawer-close-btn"
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-9 h-9 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 text-[#0E1111] flex items-center justify-center shrink-0 transition-transform shadow-md focus:outline-none"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Navigation Actions */}
            <nav className="space-y-6">
              {/* New Diagnostics */}
              <button
                id="mobile-nav-new-diagnostics-btn"
                type="button"
                onClick={() => {
                  resetDiagnosticsSession();
                  setMobileDrawerOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 text-left transition-colors font-heading text-lg ${
                  activeTab === 'new-diagnostics'
                    ? 'text-[#A3B18A] font-extrabold'
                    : 'text-[#A3B18A]/90 hover:text-[#A3B18A] font-bold'
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <SquarePen className="w-5 h-5 text-[#A3B18A]" />
                </div>
                <span>New Diagnostics</span>
              </button>

              {/* Search Chats */}
              <button
                id="mobile-nav-search-chats-btn"
                type="button"
                onClick={() => {
                  setActiveTab('search-chats');
                  setMobileDrawerOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 text-left transition-colors font-heading text-lg ${
                  activeTab === 'search-chats'
                    ? 'text-[#A3B18A] font-extrabold'
                    : 'text-[#A3B18A]/90 hover:text-[#A3B18A] font-bold'
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <Search className="w-5 h-5 text-[#A3B18A]" />
                </div>
                <span>Search Chats</span>
              </button>
            </nav>

            {/* Recents Section Header */}
            <div className="mt-12">
              <div className="flex items-center gap-2 text-base font-heading font-bold text-[#A3B18A] tracking-wide cursor-default">
                <span>Recents</span>
                <ChevronDown className="w-4 h-4 text-[#A3B18A]" />
              </div>
              <div className="mt-3 space-y-1.5">
                {recentSessions.slice(0, 4).map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => handleOpenRecentSession(session)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#8A9A78] hover:text-[#A3B18A] hover:bg-[#151D1B] truncate transition-colors block"
                  >
                    {session.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section: Avatar with initials + Technician Name & Settings Gear */}
          <div className="pt-6 border-t border-[#192220]/60 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-9 h-9 rounded-full bg-[#A3B18A] text-[#0E1111] font-heading font-extrabold text-xs flex items-center justify-center shrink-0 select-none shadow-sm"
                aria-label={`Profile for ${displayName}`}
              >
                {initials}
              </div>
              <span className="font-heading font-bold text-base text-[#A3B18A] truncate">
                {displayName}
              </span>
            </div>

            <button
              id="mobile-drawer-settings-btn"
              type="button"
              onClick={() => {
                setMobileDrawerOpen(false);
                setShowSettingsModal(true);
              }}
              className="w-8 h-8 flex items-center justify-center text-[#8A9A78] hover:text-[#A3B18A] transition-colors rounded-lg focus:outline-none"
              title="Workshop Settings & Profile"
              aria-label="Workshop Settings"
            >
              <Settings className="w-5 h-5 text-[#A3B18A]" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          LEFT SIDEBAR (OPEN or CLOSED RAIL) - DESKTOP ONLY
      ───────────────────────────────────────────────────────────── */}
      {isSidebarOpen ? (
        /* OPEN SIDEBAR (Matching 'app open sidebar.png') */
        <aside
          id="dashboard-sidebar-open"
          className="hidden md:flex w-72 bg-[#0E1111] border-r border-[#192220] flex-col justify-between shrink-0 select-none z-20 transition-all duration-200"
        >
          {/* Top Section */}
          <div className="p-6">
            {/* Logo and Collapse Toggle */}
            <div className="flex items-center justify-between mb-10 h-8">
              <div
                className="cursor-pointer h-8 flex items-center"
                onClick={resetDiagnosticsSession}
                title="New Diagnostics"
              >
                <MekaiLogo iconSize={32} showText={true} textSize="text-xl tracking-widest font-heading font-extrabold" />
              </div>

              {/* Sidebar Collapse Toggle Button: Nudged up a little bit to be horizontally centered with the logo */}
              <button
                id="collapse-sidebar-btn"
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="text-[#8A9A78] hover:text-[#A3B18A] p-1.5 rounded-lg hover:bg-[#151B1A] transition-colors -translate-y-1"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="14" x="3" y="5" rx="3" />
                  <path d="M15 5v14" />
                </svg>
              </button>
            </div>

            {/* Navigation Actions */}
            <nav className="space-y-4">
              {/* New Diagnostics */}
              <button
                id="nav-new-diagnostics-btn"
                type="button"
                onClick={resetDiagnosticsSession}
                className={`w-full flex items-center gap-3.5 text-left transition-colors font-heading text-sm h-8 ${
                  activeTab === 'new-diagnostics'
                    ? 'text-[#A3B18A] font-bold'
                    : 'text-[#A3B18A]/90 hover:text-[#A3B18A] font-semibold'
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <SquarePen className="w-5 h-5 text-[#A3B18A]" />
                </div>
                <span className="text-[#A3B18A]">New Diagnostics</span>
              </button>

              {/* Search Chats */}
              <button
                id="nav-search-chats-btn"
                type="button"
                onClick={() => setActiveTab('search-chats')}
                className={`w-full flex items-center gap-3.5 text-left transition-colors font-heading text-sm h-8 ${
                  activeTab === 'search-chats'
                    ? 'text-[#A3B18A] font-bold'
                    : 'text-[#A3B18A]/90 hover:text-[#A3B18A] font-semibold'
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <Search className="w-5 h-5 text-[#A3B18A]" />
                </div>
                <span className="text-[#A3B18A]">Search Chats</span>
              </button>
            </nav>

            {/* Recents Section Header */}
            <div className="mt-12">
              <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-[#A3B18A] tracking-wider cursor-default select-none">
                <span>Recents</span>
                <ChevronDown className="w-4 h-4 text-[#A3B18A]" />
              </div>
              <div className="mt-2.5 space-y-1">
                {recentSessions.slice(0, 4).map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => handleOpenRecentSession(session)}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-[#8A9A78] hover:text-[#A3B18A] hover:bg-[#151D1B] truncate transition-colors block"
                    title={session.title}
                  >
                    {session.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Profile Section */}
          <div className="p-6 border-t border-[#192220]/60 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {/* Sage Green Avatar with Initials - Standardized w-9 h-9 */}
              <div
                className="w-9 h-9 rounded-full bg-[#A3B18A] text-[#0E1111] font-heading font-extrabold text-xs flex items-center justify-center shrink-0 select-none tracking-tight shadow-sm"
                aria-label={`Profile for ${displayName}`}
              >
                {initials}
              </div>
              <span className="font-heading font-bold text-sm text-[#A3B18A] truncate">
                {displayName}
              </span>
            </div>

            {/* Settings Trigger */}
            <button
              id="sidebar-settings-btn"
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="w-8 h-8 flex items-center justify-center text-[#8A9A78] hover:text-[#A3B18A] transition-colors rounded-lg hover:bg-[#161D1B]"
              title="Workshop Settings & Profile"
              aria-label="Workshop Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </aside>
      ) : (
        /* CLOSED SIDEBAR RAIL (Matching 'app close sidebar.png') */
        <aside
          id="dashboard-sidebar-closed"
          className="hidden md:flex w-20 bg-[#0E1111] border-r border-[#192220] flex-col justify-between shrink-0 select-none z-20 transition-all duration-200"
        >
          {/* Top Section */}
          <div className="p-6">
            {/* Logo as expand toggle - Exact same position and height as open sidebar */}
            <div className="flex items-center mb-10 h-8">
              <button
                id="expand-sidebar-logo-btn"
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="cursor-pointer group flex items-center justify-center focus:outline-none"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <MekaiLogo iconSize={32} showText={false} />
              </button>
            </div>

            {/* Navigation Actions - Exact same size, vertical spacing and horizontal position as open sidebar */}
            <nav className="space-y-4">
              <button
                type="button"
                onClick={resetDiagnosticsSession}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  activeTab === 'new-diagnostics'
                    ? 'text-[#A3B18A] bg-[#161E1B]'
                    : 'text-[#A3B18A]/90 hover:text-[#A3B18A] hover:bg-[#151C1A]'
                }`}
                title="New Diagnostics"
                aria-label="New Diagnostics"
              >
                <SquarePen className="w-5 h-5 text-[#A3B18A]" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('search-chats')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  activeTab === 'search-chats'
                    ? 'text-[#A3B18A] bg-[#161E1B]'
                    : 'text-[#A3B18A]/90 hover:text-[#A3B18A] hover:bg-[#151C1A]'
                }`}
                title="Search Chats"
                aria-label="Search Chats"
              >
                <Search className="w-5 h-5 text-[#A3B18A]" />
              </button>
            </nav>
          </div>

          {/* Bottom Icons: Settings above Avatar, displayed as it is with same sizing as open sidebar */}
          <div className="p-6 border-t border-[#192220]/60 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="w-8 h-8 flex items-center justify-center text-[#8A9A78] hover:text-[#A3B18A] transition-colors rounded-lg hover:bg-[#161D1B]"
              title="Workshop Settings & Profile"
              aria-label="Workshop Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="w-9 h-9 rounded-full bg-[#A3B18A] text-[#0E1111] font-heading font-extrabold text-xs flex items-center justify-center shrink-0 hover:ring-2 hover:ring-[#A3B18A]/50 transition-all select-none tracking-tight shadow-sm"
              title={`${displayName} (Click to expand sidebar)`}
              aria-label={`Profile for ${displayName}`}
            >
              {initials}
            </button>
          </div>
        </aside>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT VIEW AREA
      ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col relative overflow-y-auto bg-[#0E1111]">
        {/* Top Header - Locked to exact p-6 mobile grid and h-9 row */}
        <header className="w-full p-6 md:px-10 z-10 shrink-0">
          {/* Mobile Top Bar (Matching 'app closed.png' and locking grid with mobile drawer) */}
          <div className="flex md:hidden items-center justify-between w-full h-9">
            {/* Left: Circular Two-Bar Button + MEKAI */}
            <div className="flex items-center gap-3.5 h-9">
              <button
                id="mobile-drawer-toggle-btn"
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="w-9 h-9 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 flex flex-col items-center justify-center gap-1.5 shrink-0 transition-transform shadow-md focus:outline-none"
                aria-label="Open navigation drawer"
              >
                <span className="w-4 h-[2.5px] bg-[#0E1111] rounded-full" />
                <span className="w-4 h-[2.5px] bg-[#0E1111] rounded-full" />
              </button>

              <span className="font-heading font-extrabold text-xl tracking-widest text-[#A3B18A] select-none leading-none">
                MEKAI
              </span>
            </div>

            {/* Right: Circular Sage Green Profile Avatar - Standardized w-9 h-9 */}
            <button
              id="mobile-profile-avatar-btn"
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="w-9 h-9 rounded-full bg-[#A3B18A] text-[#0E1111] font-heading font-extrabold text-xs flex items-center justify-center shrink-0 shadow-md active:scale-95 transition-transform focus:outline-none"
              title={`${displayName} - Workshop Settings`}
              aria-label={`Profile for ${displayName}`}
            >
              {initials}
            </button>
          </div>

          {/* Desktop Top Bar: Upgrade Button */}
          <div className="hidden md:flex items-center justify-end w-full h-9">
            <button
              id="upgrade-tier-btn"
              type="button"
              className="rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 text-[#0E1111] font-heading font-extrabold text-sm px-6 py-2 transition-all shadow-md"
            >
              Upgrade
            </button>
          </div>
        </header>

        {/* Dynamic View Switcher */}
        {activeTab === 'new-diagnostics' ? (
          /* ──────── VIEW A: NEW DIAGNOSTICS & CHAT SESSION ──────── */
          messages.length === 0 ? (
            /* 1. Initial Empty State (Matching 'app closed.png' on mobile & desktop references) */
            <div className="flex-1 flex flex-col justify-between md:justify-center items-center px-4 sm:px-6 md:px-12 w-full max-w-2xl mx-auto pb-6 sm:pb-8 md:pb-0 md:-mt-10">
              {/* Center Heading */}
              <div className="my-auto md:my-0 text-center">
                <h1
                  id="diagnostics-prompt-heading"
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#A3B18A] font-heading tracking-tight text-center leading-snug select-none md:mb-8 max-w-xl mx-auto"
                >
                  {WORKSHOP_GREETINGS[greetingIndex](firstName)}
                </h1>
              </div>

              {/* Input Pill Bar */}
              <div className="w-full space-y-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePromptSubmit();
                  }}
                  className="w-full"
                >
                  <div
                    id="diagnostic-input-pill"
                    className="w-full rounded-full border border-[#23312C] bg-[#0E1312] hover:border-[#354841] focus-within:border-[#A3B18A] px-4 sm:px-6 py-3 sm:py-3.5 flex items-center gap-3 sm:gap-4 transition-all shadow-lg"
                  >
                    {/* Left Plus / Attach Icon */}
                    <button
                      type="button"
                      className="text-[#8A9A78] hover:text-white transition-colors p-0.5 focus:outline-none shrink-0"
                      title="Attach evidence or file"
                    >
                      <Plus className="w-5 h-5 stroke-[2]" />
                    </button>

                    {/* Main Prompt Input Field */}
                    <input
                      id="diagnostic-prompt-input"
                      type="text"
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      placeholder="Ask Mekai"
                      className="flex-1 bg-transparent text-white placeholder-[#5A6964] text-sm sm:text-base focus:outline-none font-sans min-w-0"
                    />

                    {/* Right Controls: Microphone & Submit Arrow */}
                    <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                      <button
                        type="button"
                        className="text-[#8A9A78] hover:text-white transition-colors p-0.5 focus:outline-none"
                        title="Voice input"
                      >
                        <Mic className="w-5 h-5 stroke-[2]" />
                      </button>

                      <button
                        id="submit-diagnostic-prompt-btn"
                        type="submit"
                        disabled={!promptInput.trim() || isAnalyzing}
                        className="w-8 h-8 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-90 disabled:opacity-40 disabled:hover:bg-[#A3B18A] text-[#0E1111] flex items-center justify-center transition-all shadow-sm shrink-0"
                        title="Send prompt"
                      >
                        <ArrowUp className="w-4 h-4 stroke-[2.8]" />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Quick Workshop Suggestion Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 select-none">
                  {[
                    'P0300 cylinder misfire',
                    'Acoustic knock under load',
                    'P0420 catalyst efficiency',
                    'Hey, Mekai',
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handlePromptSubmit(chip)}
                      className="rounded-full bg-[#141A18] hover:bg-[#1A2320] border border-[#23312C] text-[#8A9A78] hover:text-[#A3B18A] hover:border-[#354841] text-xs font-semibold px-3 py-1.5 transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* 2. Active Chat Conversation: Engineer message in rounded corner pill, Mekai naked */
            <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
              {/* Messages Scroll Area */}
              <div
                id="diagnostic-chat-messages"
                className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-12 w-full max-w-2xl mx-auto py-6 space-y-6"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`w-full flex ${
                      msg.sender === 'engineer' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'engineer' ? (
                      /* Engineer's message: rounded corner pill */
                      <div className="bg-[#A3B18A] text-[#0E1111] text-sm sm:text-[14.5px] font-semibold px-5 py-2.5 rounded-full shadow-sm max-w-[85%] break-words">
                        {msg.text}
                      </div>
                    ) : (
                      /* Mekai's response: naked (no pill, no card wrapper, no background) */
                      <div className="max-w-[95%] text-[#DDE3E3] text-sm sm:text-[14.5px] leading-relaxed space-y-3.5">
                        {renderMekaiText(msg.text)}
                      </div>
                    )}
                  </div>
                ))}

                {isAnalyzing && (
                  <div className="w-full flex justify-start">
                    <div className="max-w-[95%] text-[#8A9A78] text-xs sm:text-sm flex items-center gap-2 py-1">
                      <span className="w-2 h-2 rounded-full bg-[#A3B18A] animate-pulse" />
                      <span className="font-heading font-medium tracking-wide">
                        Mekai is analyzing vehicle telemetry...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Pinned Bottom Input Bar */}
              <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-12 pb-6 sm:pb-8 pt-2 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePromptSubmit();
                  }}
                  className="w-full"
                >
                  <div
                    id="diagnostic-input-pill"
                    className="w-full rounded-full border border-[#23312C] bg-[#0E1312] hover:border-[#354841] focus-within:border-[#A3B18A] px-4 sm:px-6 py-3 sm:py-3.5 flex items-center gap-3 sm:gap-4 transition-all shadow-lg"
                  >
                    <button
                      type="button"
                      className="text-[#8A9A78] hover:text-white transition-colors p-0.5 focus:outline-none shrink-0"
                      title="Attach evidence or file"
                    >
                      <Plus className="w-5 h-5 stroke-[2]" />
                    </button>

                    <input
                      id="diagnostic-prompt-input"
                      type="text"
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      placeholder="Ask Mekai"
                      className="flex-1 bg-transparent text-white placeholder-[#5A6964] text-sm sm:text-base focus:outline-none font-sans min-w-0"
                    />

                    <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                      <button
                        type="button"
                        className="text-[#8A9A78] hover:text-white transition-colors p-0.5 focus:outline-none"
                        title="Voice input"
                      >
                        <Mic className="w-5 h-5 stroke-[2]" />
                      </button>

                      <button
                        id="submit-diagnostic-prompt-btn"
                        type="submit"
                        disabled={!promptInput.trim() || isAnalyzing}
                        className="w-8 h-8 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-90 disabled:opacity-40 disabled:hover:bg-[#A3B18A] text-[#0E1111] flex items-center justify-center transition-all shadow-sm shrink-0"
                        title="Send prompt"
                      >
                        <ArrowUp className="w-4 h-4 stroke-[2.8]" />
                      </button>
                    </div>
                  </div>
                </form>
                <p className="text-[11px] text-[#5A6363] text-center mt-2 font-normal select-none">
                  Mekai is AI and can make mistakes.
                </p>
              </div>
            </div>
          )
        ) : (
          /* ──────── VIEW B: SEARCH CHATS (Matching 'app search chats.png') ──────── */
          <div className="flex-1 flex flex-col items-center px-4 sm:px-6 md:px-12 max-w-2xl mx-auto w-full pt-4 sm:pt-8 md:pt-12 overflow-y-auto pb-8">
            {/* Search Input Bar - Centered */}
            <div className="w-full max-w-2xl mx-auto">
              <div
                id="search-chats-pill"
                className="w-full rounded-full border border-[#23312C] bg-[#0E1312] hover:border-[#354841] focus-within:border-[#A3B18A] px-5 sm:px-6 py-3.5 sm:py-4 flex items-center gap-3.5 transition-all shadow-lg mx-auto"
              >
                <Search className="w-5 h-5 text-[#A3B18A] shrink-0 stroke-[2]" />
                <input
                  id="search-chats-input"
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats"
                  className="flex-1 bg-transparent text-white placeholder-[#5A6964] text-sm sm:text-base focus:outline-none font-sans"
                />
              </div>
            </div>

            {/* Recent Section Header & Filtered Sessions */}
            <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-10">
              <h2
                id="recent-chats-heading"
                className="text-xl sm:text-2xl font-extrabold text-[#A3B18A] font-heading tracking-tight mb-4"
              >
                Recent
              </h2>

              <div id="recent-chats-container" className="space-y-2.5">
                {recentSessions
                  .filter(
                    (s) =>
                      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.snippet.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((session) => (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => handleOpenRecentSession(session)}
                      className="w-full text-left p-4 rounded-xl bg-[#131817] hover:bg-[#18201E] border border-[#212C29] transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-heading font-bold text-sm text-[#DDE3E3] group-hover:text-[#A3B18A] transition-colors truncate">
                          {session.title}
                        </h3>
                        <span className="text-[11px] text-[#5A6964] shrink-0 ml-2 font-mono">
                          {session.date}
                        </span>
                      </div>
                      <p className="text-xs text-[#8A9A78] line-clamp-1">
                        {session.snippet}
                      </p>
                    </button>
                  ))}
                {recentSessions.filter(
                  (s) =>
                    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.snippet.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 && (
                  <div className="py-8 text-center text-xs text-[#5A6964]">
                    No matching diagnostic sessions found.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─────────────────────────────────────────────────────────────
          SETTINGS & WORKSHOP MODAL
      ───────────────────────────────────────────────────────────── */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121616] border border-[#26312E] rounded-2xl p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-[#202927]">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#A3B18A] text-[#0E1111] font-heading font-extrabold text-[10px] flex items-center justify-center shrink-0 select-none">
                  {initials}
                </div>
                <h3 className="font-heading font-extrabold text-base text-white">Technician Workshop</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="text-[#8A9A78] hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-[#171D1B] border border-[#202927]">
                <div className="text-[11px] uppercase tracking-wider text-[#8A9A78] font-semibold mb-1">
                  Active Technician
                </div>
                <div className="font-heading font-bold text-white text-base">{displayName}</div>
                <div className="text-xs text-[#8F9999] mt-0.5">Senior Diagnostic Specialist</div>
              </div>

              <div className="p-3 rounded-xl bg-[#171D1B] border border-[#202927] flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#8A9A78] font-semibold mb-1">
                    Workshop Key
                  </div>
                  <div className="font-mono text-xs text-white tracking-wider">
                    {activeCode || 'CST-ACTIVE-WORKSHOP'}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#A3B18A] font-semibold bg-[#A3B18A]/10 px-2.5 py-1 rounded-full border border-[#A3B18A]/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Authenticated</span>
                </div>
              </div>

              {onViewLanding && (
                <button
                  type="button"
                  onClick={() => {
                    setShowSettingsModal(false);
                    onViewLanding();
                  }}
                  className="w-full py-2.5 rounded-xl border border-[#2B3834] hover:border-white text-xs font-semibold text-white transition-colors"
                >
                  View Marketing Homepage
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowSettingsModal(false);
                  onSignOut();
                }}
                className="w-full py-2.5 rounded-xl bg-red-950/40 border border-red-800/40 hover:bg-red-900/50 text-red-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect & Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
