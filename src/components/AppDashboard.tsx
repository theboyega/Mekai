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
  X,
  Camera,
  Image as ImageIcon,
  FileText,
  Square,
  Trash2,
  Volume2
} from 'lucide-react';
import { MekaiLogo } from './MekaiLogo';

interface AppDashboardProps {
  activeCode: string | null;
  technicianName?: string;
  onSignOut: () => void;
  onViewLanding?: () => void;
}

export interface ChatAttachment {
  type: 'image' | 'file' | 'audio';
  name: string;
  url?: string;
  size?: string;
  file?: File;
}

export interface ChatMessage {
  id: string;
  sender: 'engineer' | 'mekai';
  text: string;
  timestamp: string;
  attachment?: ChatAttachment;
}

export interface RecentChatSession {
  id: string;
  title: string;
  snippet: string;
  date: string;
  messages: ChatMessage[];
}

function getMekaiDiagnosticResponse(
  prompt: string,
  technicianName: string,
  attachment?: ChatAttachment
): string {
  const p = prompt.toLowerCase();
  const firstName = technicianName.trim().split(/\s+/)[0] || 'Technician';

  // Handle acoustic / audio recordings
  if (attachment?.type === 'audio') {
    return `Acoustic Diagnostic Telemetry: Workshop Audio Sample Captured (${attachment.size || 'Audio'})\n\nSignal Processing & Frequency Isolation:\n• Primary Resonance Peak: Elevated mechanical vibration energy isolated in the 1,850 Hz–2,400 Hz range during rotational deceleration.\n• Harmonic Interval: Cadence synchronizes with camshaft half-speed rotation, strongly indicating valvetrain origin (hydraulic lifter bleed-down or rocker arm lash) or turbocharger wastegate actuator linkage flutter.\n\nRecommended Workshop Actions:\n1. Apply an acoustic stethoscope probe to the cylinder head valve cover versus the turbo turbine housing to pinpoint the source.\n2. Verify engine oil pressure at full operating temperature to rule out hydraulic valve lifter starvation.`;
  }

  // Handle visual images (photos or live camera captures)
  if (attachment?.type === 'image') {
    return `Visual Component Diagnostic Assessment: ${attachment.name}\n\nVisual Inspection Analysis:\n• Component surface and harness connector ingested for thermal stress, pin fretting, and fluid intrusion.\n• Verify weather-pack rubber connector seal for oil degradation or contamination wicking into copper wiring strands.\n\nRecommended Pinpoint Test Sequence:\n1. Measure connector pin backprobe resistance with digital multimeter (target < 0.5 Ω to ground).\n2. Apply dielectric grease upon reassembly to prevent intermittent high-resistance faults.`;
  }

  // Handle diagnostic documents / files (PDF, CSV, logs)
  if (attachment?.type === 'file') {
    return `Telemetry Data Log Assessment: ${attachment.name}\n\nDiagnostic Ingestion:\n• Ingesting Mode $06 freeze-frame parameters, PID live data, and DTC fault register.\n• Freeze-frame records abnormal operating deviation at triggered RPM and engine load threshold.\n\nRecommended Pinpoint Test Sequence:\n1. Re-verify live sensor voltage waveform against OEM reference specifications.\n2. Clear historical codes, execute drive cycle monitor run, and log live sensor telemetry.`;
  }

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
  const [recentSessions, setRecentSessions] = useState<RecentChatSession[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Staged attachment for next chat query (+ button & audio)
  const [attachedMedia, setAttachedMedia] = useState<ChatAttachment | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  // Audio recording state & refs
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Hidden file/camera input refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  // Clean up recording timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Format recording duration (mm:ss)
  const formatRecordingTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // File and photo selection handler
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(file.size / 1024))} KB`;

    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedMedia({
          type: 'image',
          name: file.name,
          url: event.target?.result as string,
          size: formattedSize,
          file,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setAttachedMedia({
        type: 'file',
        name: file.name,
        size: formattedSize,
        file,
      });
    }

    setShowAttachMenu(false);
    e.target.value = '';
  };

  // Start audio recording with microphone & optional live transcription
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAttachedMedia({
          type: 'audio',
          name: `Acoustic-Diagnostic-${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.webm`,
          url: audioUrl,
          size: `${recordingDuration > 0 ? `${recordingDuration}s` : 'Audio'}`,
        });
        stream.getTracks().forEach((track) => track.stop());
      };

      // Also attempt real-time speech recognition if available
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          const rec = new SpeechRec();
          rec.continuous = true;
          rec.interimResults = true;
          rec.onresult = (event: any) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              transcript += event.results[i][0].transcript;
            }
            if (transcript.trim()) {
              setPromptInput((prev) => (prev ? prev + ' ' : '') + transcript.trim());
            }
          };
          rec.start();
          speechRecognitionRef.current = rec;
        } catch {
          // speech recognition fallback
        }
      }

      mediaRecorder.start(250);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access unavailable, providing acoustic sample mode', err);
      // Simulated acoustic recording fallback
      setIsRecording(true);
      setRecordingDuration(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  const handleStopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {
        // ignore
      }
      speechRecognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    } else {
      setAttachedMedia({
        type: 'audio',
        name: `Acoustic-Diagnostic-${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.webm`,
        size: `${recordingDuration > 0 ? `${recordingDuration}s` : 'Audio'}`,
      });
    }
    setIsRecording(false);
  };

  const handleCancelRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {
        // ignore
      }
      speechRecognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordingDuration(0);
  };

  // Session reset helper: resets input, messages, ensures new-diagnostics view, and randomizes greeting
  const resetDiagnosticsSession = () => {
    setActiveTab('new-diagnostics');
    setPromptInput('');
    setMessages([]);
    setAttachedMedia(null);
    setShowAttachMenu(false);
    if (isRecording) {
      handleCancelRecording();
    }
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
    if ((!textToSubmit && !attachedMedia) || isAnalyzing) return;

    const currentAttachment = attachedMedia;
    const defaultText = currentAttachment
      ? currentAttachment.type === 'image'
        ? 'Diagnostic inspection photo attached for analysis.'
        : currentAttachment.type === 'audio'
        ? `Acoustic audio sample recorded (${currentAttachment.size || 'Diagnostic clip'}).`
        : `Diagnostic document attached (${currentAttachment.name}).`
      : '';

    const finalText = textToSubmit || defaultText;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-eng`,
      sender: 'engineer',
      text: finalText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: currentAttachment || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setPromptInput('');
    setAttachedMedia(null);
    setShowAttachMenu(false);
    setIsAnalyzing(true);

    setTimeout(() => {
      const mekaiResponseText = getMekaiDiagnosticResponse(finalText, displayName, currentAttachment || undefined);
      const mekaiMsg: ChatMessage = {
        id: `msg-${Date.now()}-mek`,
        sender: 'mekai',
        text: mekaiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, mekaiMsg]);
      setIsAnalyzing(false);

      // Add to dynamic recent sessions
      setRecentSessions((prev) => {
        const title = finalText.length > 34 ? finalText.substring(0, 34) + '...' : finalText;
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

  const renderDiagnosticInputBar = (showDisclaimer = false) => (
    <div className="w-full relative">
      {/* Staged attachment preview chip */}
      {attachedMedia && (
        <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-[#141A18] border border-[#23312C] rounded-full w-fit max-w-full text-xs text-[#A3B18A] animate-fadeIn">
          {attachedMedia.type === 'image' && (
            <>
              {attachedMedia.url ? (
                <img
                  src={attachedMedia.url}
                  alt="preview"
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                />
              ) : (
                <ImageIcon className="w-3.5 h-3.5 shrink-0" />
              )}
            </>
          )}
          {attachedMedia.type === 'file' && <FileText className="w-3.5 h-3.5 shrink-0" />}
          {attachedMedia.type === 'audio' && <Volume2 className="w-3.5 h-3.5 shrink-0 text-red-400" />}
          <span className="truncate max-w-[200px] text-white font-medium">{attachedMedia.name}</span>
          {attachedMedia.size && <span className="text-[#8A9A78] text-[10px]">({attachedMedia.size})</span>}
          <button
            type="button"
            onClick={() => setAttachedMedia(null)}
            className="p-0.5 hover:text-white transition-colors ml-1 focus:outline-none"
            title="Remove attachment"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePromptSubmit();
        }}
        className="w-full relative"
      >
        {/* Attachment menu popover (live image, upload photo, send file) */}
        {showAttachMenu && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setShowAttachMenu(false)}
            />
            <div className="absolute bottom-full left-0 mb-3 z-40 bg-[#141A18] border border-[#23312C] rounded-2xl p-1.5 shadow-2xl min-w-[220px] animate-fadeIn">
              <button
                type="button"
                onClick={() => {
                  setShowAttachMenu(false);
                  cameraInputRef.current?.click();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#DDE3E3] hover:text-[#A3B18A] hover:bg-[#1D2522] transition-colors text-left"
              >
                <Camera className="w-4 h-4 text-[#A3B18A] shrink-0" />
                <span>Take Live Photo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAttachMenu(false);
                  imageInputRef.current?.click();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#DDE3E3] hover:text-[#A3B18A] hover:bg-[#1D2522] transition-colors text-left"
              >
                <ImageIcon className="w-4 h-4 text-[#A3B18A] shrink-0" />
                <span>Upload Vehicle Photo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAttachMenu(false);
                  fileInputRef.current?.click();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#DDE3E3] hover:text-[#A3B18A] hover:bg-[#1D2522] transition-colors text-left"
              >
                <FileText className="w-4 h-4 text-[#A3B18A] shrink-0" />
                <span>Send File / Log</span>
              </button>
            </div>
          </>
        )}

        <div
          id="diagnostic-input-pill"
          className="w-full rounded-full border border-[#23312C] bg-[#0E1312] hover:border-[#354841] focus-within:border-[#A3B18A] px-4 sm:px-6 py-3 sm:py-3.5 flex items-center gap-3 sm:gap-4 transition-all shadow-lg"
        >
          {/* Left Plus / Attach Icon */}
          <button
            type="button"
            onClick={() => setShowAttachMenu((prev) => !prev)}
            className={`p-0.5 focus:outline-none shrink-0 transition-colors ${
              showAttachMenu ? 'text-[#A3B18A]' : 'text-[#8A9A78] hover:text-white'
            }`}
            title="Send file, image, or take live photo"
          >
            <Plus className="w-5 h-5 stroke-[2]" />
          </button>

          {isRecording ? (
            <div className="flex-1 flex items-center justify-between min-w-0 py-0.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-red-400 text-xs sm:text-sm font-semibold tracking-wide">
                  Recording Audio...
                </span>
                <span className="text-[#A3B18A] font-mono text-xs sm:text-sm ml-1">
                  {formatRecordingTime(recordingDuration)}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCancelRecording}
                  className="p-1 text-[#8A9A78] hover:text-red-400 transition-colors"
                  title="Cancel recording"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  title="Finish recording"
                >
                  <Square className="w-3 h-3 fill-white" />
                  <span>Done</span>
                </button>
              </div>
            </div>
          ) : (
            <>
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
                  onClick={handleStartRecording}
                  className="text-[#8A9A78] hover:text-white transition-colors p-0.5 focus:outline-none"
                  title="Record diagnostic audio"
                >
                  <Mic className="w-5 h-5 stroke-[2]" />
                </button>

                <button
                  id="submit-diagnostic-prompt-btn"
                  type="submit"
                  disabled={(!promptInput.trim() && !attachedMedia) || isAnalyzing}
                  className="w-8 h-8 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-90 disabled:opacity-40 disabled:hover:bg-[#A3B18A] text-[#0E1111] flex items-center justify-center transition-all shadow-sm shrink-0"
                  title="Send prompt"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.8]" />
                </button>
              </div>
            </>
          )}
        </div>
      </form>

      {showDisclaimer && (
        <p className="text-[11px] text-[#5A6363] text-center mt-2 font-normal select-none">
          Mekai is AI and can make mistakes.
        </p>
      )}
    </div>
  );

  return (
    <div id="app-dashboard" className="h-screen w-screen bg-[#0E1111] text-white flex overflow-hidden font-sans selection:bg-[#A3B18A]/30 selection:text-white">
      {/* Hidden file & live camera inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileSelected(e, 'image')}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelected(e, 'image')}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.csv,.json,.log,.bin"
        className="hidden"
        onChange={(e) => handleFileSelected(e, 'file')}
      />

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

            {/* Recents Section Header - Only dynamic sessions */}
            {recentSessions.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center gap-2 text-base font-heading font-bold text-[#A3B18A] tracking-wide cursor-default">
                  <span>Recents</span>
                  <ChevronDown className="w-4 h-4 text-[#A3B18A]" />
                </div>
                <div className="mt-3 space-y-1.5">
                  {recentSessions.slice(0, 6).map((session) => (
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
            )}
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

            {/* Recents Section Header - Only dynamic sessions */}
            {recentSessions.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-[#A3B18A] tracking-wider cursor-default select-none">
                  <span>Recents</span>
                  <ChevronDown className="w-4 h-4 text-[#A3B18A]" />
                </div>
                <div className="mt-2.5 space-y-1">
                  {recentSessions.slice(0, 6).map((session) => (
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
            )}
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

              {/* Input Pill Bar (Mockup pills removed) */}
              <div className="w-full">
                {renderDiagnosticInputBar(false)}
              </div>
            </div>
          ) : (
            /* 2. Active Chat Conversation: Engineer message in rounded pill container, Mekai response naked */
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
                      /* Engineer's query: distinct rounded pill container with background fill */
                      <div className="bg-[#A3B18A] text-[#0E1111] text-sm sm:text-base font-semibold px-5 py-3 rounded-full shadow-md max-w-[85%] break-words inline-block">
                        {msg.attachment?.type === 'image' && msg.attachment.url && (
                          <div className="mb-2 overflow-hidden rounded-2xl border border-[#0E1111]/20">
                            <img
                              src={msg.attachment.url}
                              alt={msg.attachment.name}
                              className="max-h-60 w-auto rounded-xl object-contain bg-black/10"
                            />
                          </div>
                        )}
                        {msg.attachment?.type === 'file' && (
                          <div className="mb-2 flex items-center gap-2 bg-[#0E1111]/10 px-3 py-1.5 rounded-full text-xs font-mono">
                            <FileText className="w-4 h-4 text-[#0E1111] shrink-0" />
                            <span className="truncate max-w-[200px]">{msg.attachment.name}</span>
                            {msg.attachment.size && <span className="opacity-75">({msg.attachment.size})</span>}
                          </div>
                        )}
                        {msg.attachment?.type === 'audio' && (
                          <div className="mb-2 flex items-center gap-2 bg-[#0E1111]/10 px-3 py-1.5 rounded-full text-xs font-mono">
                            <Volume2 className="w-4 h-4 text-[#0E1111] shrink-0" />
                            <span>Audio Recording {msg.attachment.size ? `(${msg.attachment.size})` : ''}</span>
                          </div>
                        )}
                        <span>{msg.text}</span>
                      </div>
                    ) : (
                      /* Mekai's response: completely uncontained ("naked") with zero background cards or borders */
                      <div className="max-w-[95%] text-[#DDE3E3] text-sm sm:text-[15px] leading-relaxed space-y-3.5 bg-transparent border-0 p-0 shadow-none">
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
                {renderDiagnosticInputBar(true)}
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
