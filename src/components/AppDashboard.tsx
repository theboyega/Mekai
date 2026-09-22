import { useState } from 'react';
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

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'T';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function AppDashboard({ activeCode, technicianName, onSignOut, onViewLanding }: AppDashboardProps) {
  // 1. Sidebar open by default on desktop viewports
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // 2. Active tab: 'new-diagnostics' or 'search-chats'
  const [activeTab, setActiveTab] = useState<'new-diagnostics' | 'search-chats'>('new-diagnostics');
  // State for diagnostics prompt and search
  const [promptInput, setPromptInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  // Settings menu modal/popover
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Resolved technician name and first name for prompt greeting
  const displayName = technicianName || 'Adeyemi Tomiwa';
  const firstName = displayName.trim().split(/\s+/)[0] || 'Adeyemi';
  const initials = getInitials(displayName);

  return (
    <div id="app-dashboard" className="h-screen w-screen bg-[#0E1111] text-white flex overflow-hidden font-sans selection:bg-[#A3B18A]/30 selection:text-white">
      {/* ─────────────────────────────────────────────────────────────
          LEFT SIDEBAR (OPEN or CLOSED RAIL)
      ───────────────────────────────────────────────────────────── */}
      {isSidebarOpen ? (
        /* OPEN SIDEBAR (Matching 'app open sidebar.png') */
        <aside
          id="dashboard-sidebar-open"
          className="w-72 bg-[#0E1111] border-r border-[#192220] flex flex-col justify-between shrink-0 select-none z-20 transition-all duration-200"
        >
          {/* Top Section */}
          <div className="p-6">
            {/* Logo and Collapse Toggle */}
            <div className="flex items-center justify-between mb-10">
              <div
                className="cursor-pointer"
                onClick={() => setActiveTab('new-diagnostics')}
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
                  width="22"
                  height="22"
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
                onClick={() => setActiveTab('new-diagnostics')}
                className={`w-full flex items-center gap-3.5 text-left transition-colors font-heading text-sm ${
                  activeTab === 'new-diagnostics'
                    ? 'text-[#A3B18A] font-bold'
                    : 'text-[#A3B18A]/90 hover:text-[#A3B18A] font-semibold'
                }`}
              >
                <SquarePen className="w-4 h-4 shrink-0 text-[#A3B18A]" />
                <span className="text-[#A3B18A]">New Diagnostics</span>
              </button>

              {/* Search Chats */}
              <button
                id="nav-search-chats-btn"
                type="button"
                onClick={() => setActiveTab('search-chats')}
                className={`w-full flex items-center gap-3.5 text-left transition-colors font-heading text-sm ${
                  activeTab === 'search-chats'
                    ? 'text-[#A3B18A] font-bold'
                    : 'text-[#A3B18A]/90 hover:text-[#A3B18A] font-semibold'
                }`}
              >
                <Search className="w-4 h-4 shrink-0 text-[#A3B18A]" />
                <span className="text-[#A3B18A]">Search Chats</span>
              </button>
            </nav>

            {/* Recents Section Header (empty content below per instruction) */}
            <div className="mt-12">
              <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-[#A3B18A] tracking-wider cursor-default select-none">
                <span>Recents</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#A3B18A]" />
              </div>
              {/* Empty recents area: will be populated by incoming chat function */}
            </div>
          </div>

          {/* Bottom Profile Section */}
          <div className="p-6 border-t border-[#192220]/60 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {/* Sage Green Avatar with Initials */}
              <div
                className="w-7 h-7 rounded-full bg-[#A3B18A] text-[#0E1111] font-heading font-extrabold text-xs flex items-center justify-center shrink-0 select-none tracking-tight shadow-sm"
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
              className="text-[#8A9A78] hover:text-[#A3B18A] transition-colors p-1.5 rounded-lg hover:bg-[#161D1B]"
              title="Workshop Settings & Profile"
              aria-label="Workshop Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </aside>
      ) : (
        /* CLOSED SIDEBAR RAIL (Matching 'app close sidebar.png') */
        <aside
          id="dashboard-sidebar-closed"
          className="w-18 sm:w-20 bg-[#0E1111] border-r border-[#192220] flex flex-col justify-between items-center py-6 shrink-0 select-none z-20 transition-all duration-200"
        >
          {/* Top: Logo as expand toggle */}
          <div className="flex flex-col items-center">
            <button
              id="expand-sidebar-logo-btn"
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="cursor-pointer group p-1.5 rounded-xl hover:bg-[#161D1A] transition-colors focus:outline-none"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <MekaiLogo iconSize={32} showText={false} />
            </button>

            {/* Middle Nav Icons */}
            <div className="mt-14 space-y-6 flex flex-col items-center">
              <button
                type="button"
                onClick={() => setActiveTab('new-diagnostics')}
                className={`p-2 rounded-xl transition-colors ${
                  activeTab === 'new-diagnostics'
                    ? 'text-[#A3B18A] bg-[#161E1B]'
                    : 'text-[#A3B18A]/80 hover:text-[#A3B18A] hover:bg-[#151C1A]'
                }`}
                title="New Diagnostics"
              >
                <SquarePen className="w-5 h-5 text-[#A3B18A]" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('search-chats')}
                className={`p-2 rounded-xl transition-colors ${
                  activeTab === 'search-chats'
                    ? 'text-[#A3B18A] bg-[#161E1B]'
                    : 'text-[#A3B18A]/80 hover:text-[#A3B18A] hover:bg-[#151C1A]'
                }`}
                title="Search Chats"
              >
                <Search className="w-5 h-5 text-[#A3B18A]" />
              </button>
            </div>
          </div>

          {/* Bottom Icons: Settings above Avatar */}
          <div className="flex flex-col items-center gap-5">
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="text-[#8A9A78] hover:text-[#A3B18A] transition-colors p-1.5 rounded-lg hover:bg-[#161D1B]"
              title="Workshop Settings & Profile"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="w-7 h-7 rounded-full bg-[#A3B18A] text-[#0E1111] font-heading font-extrabold text-xs flex items-center justify-center shrink-0 hover:ring-2 hover:ring-[#A3B18A]/50 transition-all select-none tracking-tight shadow-sm"
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
        {/* Top Header with Upgrade Button */}
        <header className="w-full flex items-center justify-end p-6 sm:px-10 z-10 shrink-0">
          <button
            id="upgrade-tier-btn"
            type="button"
            className="rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 text-[#0E1111] font-heading font-extrabold text-sm px-6 py-2 transition-all shadow-md"
          >
            Upgrade
          </button>
        </header>

        {/* Dynamic View Switcher */}
        {activeTab === 'new-diagnostics' ? (
          /* ──────── VIEW A: NEW DIAGNOSTICS (Matching 'app open sidebar.png' / 'app close sidebar.png') ──────── */
          <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 -mt-10 max-w-4xl mx-auto w-full">
            {/* Center Heading */}
            <h1
              id="diagnostics-prompt-heading"
              className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#A3B18A] font-heading tracking-tight mb-8 sm:mb-10 text-center leading-tight select-none"
            >
              Ready for diagnostics, {firstName}?
            </h1>

            {/* Input Pill Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Chat messaging flow placeholder
              }}
              className="w-full"
            >
              <div
                id="diagnostic-input-pill"
                className="w-full rounded-full border border-[#23312C] bg-[#0E1312] hover:border-[#354841] focus-within:border-[#A3B18A] px-5 sm:px-6 py-3.5 sm:py-4 flex items-center gap-3 sm:gap-4 transition-all shadow-lg"
              >
                {/* Left Plus / Attach Icon */}
                <button
                  type="button"
                  className="text-[#8A9A78] hover:text-white transition-colors p-0.5 focus:outline-none"
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
                  placeholder="Describe the symptom, paste a code or attach evidence..."
                  className="flex-1 bg-transparent text-white placeholder-[#5A6964] text-sm sm:text-base focus:outline-none font-sans"
                />

                {/* Right Controls: Microphone & Submit Arrow */}
                <div className="flex items-center gap-3 shrink-0">
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
                    className="w-8 h-8 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-90 text-[#0E1111] flex items-center justify-center transition-all shadow-sm shrink-0"
                    title="Send prompt"
                  >
                    <ArrowUp className="w-4 h-4 stroke-[2.8]" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* ──────── VIEW B: SEARCH CHATS (Matching 'app search chats.png') ──────── */
          <div className="flex-1 flex flex-col items-center px-6 sm:px-12 max-w-4xl mx-auto w-full pt-8 sm:pt-12">
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

            {/* Recent Section Header */}
            <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-10">
              <h2
                id="recent-chats-heading"
                className="text-xl sm:text-2xl font-extrabold text-[#A3B18A] font-heading tracking-tight"
              >
                Recent
              </h2>

              {/* Empty list container as specified */}
              <div id="recent-chats-container" className="mt-4">
                {/* Clean empty state awaiting external function binding */}
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
