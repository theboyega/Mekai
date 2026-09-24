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
  Image as ImageIcon,
  FileText,
  Square,
  Trash2,
  Volume2,
  AlertCircle,
  Car,
  Check,
  Play,
  Pause
} from 'lucide-react';
import { MekaiLogo } from './MekaiLogo';

// Protected internal proxy endpoint for the Mekai diagnostic agent
const MEKAI_CHAT_ENDPOINT = '/api/chat-webhook';

interface AppDashboardProps {
  activeCode: string | null;
  technicianName?: string;
  onSignOut: () => void;
  onViewLanding?: () => void;
  initialPrompt?: string;
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
  isError?: boolean;
  isTyping?: boolean;
}

export interface RecentChatSession {
  id: string;
  title: string;
  vehicle?: string;
  snippet: string;
  date: string;
  messages: ChatMessage[];
  updatedAt: number;
}

export interface WebhookResult {
  text: string;
  vehicle?: string;
  title?: string;
}

const VEHICLE_MAKES = [
  'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Buick', 'Cadillac',
  'Chevrolet', 'Chevy', 'Chrysler', 'Dodge', 'Ferrari', 'Fiat', 'Ford', 'Genesis',
  'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia', 'Lamborghini',
  'Land Rover', 'Range Rover', 'Lexus', 'Lincoln', 'Maserati', 'Mazda', 'McLaren',
  'Mercedes-Benz', 'Mercedes', 'Mini', 'Mitsubishi', 'Nissan', 'Polestar', 'Pontiac',
  'Porsche', 'Ram', 'Rolls-Royce', 'Saab', 'Saturn', 'Scion', 'Subaru', 'Suzuki',
  'Tesla', 'Toyota', 'Volkswagen', 'VW', 'Volvo'
];

function cleanMakeName(make: string): string {
  const m = make.toLowerCase();
  if (m === 'chevy') return 'Chevrolet';
  if (m === 'mercedes') return 'Mercedes-Benz';
  if (m === 'vw') return 'Volkswagen';
  return make.charAt(0).toUpperCase() + make.slice(1);
}

// Extraction of vehicle details from conversation as fallback
export function extractVehicleDetails(
  userText: string,
  mekaiText: string,
  currentTitle?: string
): string | null {
  const combined = `${userText}\n${mekaiText}`;

  for (const make of VEHICLE_MAKES) {
    // 1. [Make] [Model words] [Year] -> e.g., "Ford Explorer 2014"
    const yearLastRegex = new RegExp(
      `\\b${make}\\s+([A-Za-z0-9\\-]+(?:\\s+[A-Za-z0-9\\-]+){0,2})\\s+(19\\d\\d|20\\d\\d)\\b`,
      'i'
    );
    const m1 = combined.match(yearLastRegex);
    if (m1) {
      const model = m1[1].trim();
      const year = m1[2];
      return `${cleanMakeName(make)} ${model} ${year}`;
    }

    // 2. [Year] [Make] [Model words] -> e.g., "2014 Ford Explorer" -> "Ford Explorer 2014"
    const yearFirstRegex = new RegExp(
      `\\b(19\\d\\d|20\\d\\d)\\s+${make}\\s+([A-Za-z0-9\\-]+(?:\\s+[A-Za-z0-9\\-]+){0,2})\\b`,
      'i'
    );
    const m2 = combined.match(yearFirstRegex);
    if (m2) {
      const year = m2[1];
      const model = m2[2].trim();
      return `${cleanMakeName(make)} ${model} ${year}`;
    }

    // 3. [Make] [Model words]
    const makeModelRegex = new RegExp(
      `\\b${make}\\s+([A-Za-z0-9\\-]+(?:\\s+[A-Za-z0-9\\-]+){0,1})\\b`,
      'i'
    );
    const m3 = combined.match(makeModelRegex);
    if (m3) {
      const model = m3[1].trim();
      const yearMatch = combined.match(/\b(19\\d\\d|20\\d\\d)\b/);
      if (yearMatch) {
        return `${cleanMakeName(make)} ${model} ${yearMatch[1]}`;
      }
      return `${cleanMakeName(make)} ${model}`;
    }
  }

  if (currentTitle && !currentTitle.startsWith('Diagnostic') && !currentTitle.startsWith('New Diagnostic')) {
    return currentTitle;
  }

  return null;
}

// Mekai logs the name of the session because it's configured in its prompt/workflow
// e.g. "Got it, logging this session as Ford Explorer 2014."
export function extractMekaiSessionName(
  mekaiText: string,
  userText: string,
  webhookResult?: WebhookResult,
  currentTitle?: string
): string {
  // 1. Direct explicit metadata from n8n webhook if returned
  if (webhookResult?.title && webhookResult.title.trim()) {
    return webhookResult.title.trim();
  }
  if (webhookResult?.vehicle && webhookResult.vehicle.trim()) {
    return webhookResult.vehicle.trim();
  }

  // 2. Mekai's explicit logging pattern from its response (e.g. "logging this session as Ford Explorer 2014")
  const loggingPatterns = [
    /log(?:ging|ged)?\s+this\s+session\s+as\s+([^.,\n\?!]+)/i,
    /log(?:ging|ged)?\s+this\s+as\s+([^.,\n\?!]+)/i,
    /log(?:ging|ged)?\s+as\s+([^.,\n\?!]+)/i,
    /session\s+logged\s+as\s+([^.,\n\?!]+)/i,
    /session\s+name(?:\s+is)?\s+([^.,\n\?!]+)/i,
    /naming\s+this\s+session\s+([^.,\n\?!]+)/i,
    /tracking\s+this\s+as\s+([^.,\n\?!]+)/i,
  ];

  for (const pattern of loggingPatterns) {
    const match = mekaiText.match(pattern);
    if (match && match[1]) {
      const cleanName = match[1].trim().replace(/^["']|["']$/g, '');
      if (cleanName.length >= 2 && !cleanName.toLowerCase().startsWith('a diagnostic')) {
        return cleanName;
      }
    }
  }

  // 3. Fallback vehicle extractor
  const detectedVehicle = extractVehicleDetails(userText, mekaiText, currentTitle);
  if (detectedVehicle) {
    return detectedVehicle;
  }

  // 4. Retain previous established title
  if (currentTitle && !currentTitle.startsWith('Diagnostic') && !currentTitle.startsWith('New Diagnostic')) {
    return currentTitle;
  }

  // 5. Code or brief snippet
  const dtcMatch = userText.match(/\b([PBCU]\d{4})\b/i);
  if (dtcMatch) {
    return `${dtcMatch[1].toUpperCase()} Diagnostics`;
  }

  return userText.length > 28 ? userText.substring(0, 28) + '...' : userText;
}

// Real API call to the Mekai n8n webhook
async function callMekaiWebhook(
  prompt: string,
  sessionId: string,
  technicianName: string,
  activeCode: string | null,
  attachment?: ChatAttachment
): Promise<WebhookResult> {
  const payload = {
    action: 'sendMessage',
    chatInput: prompt,
    message: prompt,
    sessionId: sessionId,
    technicianName: technicianName,
    activeCode: activeCode || 'CST-ACTIVE-WORKSHOP',
    attachment: attachment
      ? {
          type: attachment.type,
          name: attachment.name,
          size: attachment.size,
          url: attachment.url?.startsWith('data:') ? attachment.url : undefined,
        }
      : undefined,
  };

  const executeRequest = async (endpointUrl: string): Promise<WebhookResult> => {
    const res = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}: ${errText || res.statusText}`);
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (typeof data === 'string') return { text: data };
      if (Array.isArray(data)) {
        const first = data[0];
        if (typeof first === 'string') return { text: first };
        if (first && typeof first === 'object') {
          return {
            text: first.output || first.text || first.response || first.message || JSON.stringify(first),
            vehicle: first.vehicle,
            title: first.title || first.sessionTitle,
          };
        }
        return { text: JSON.stringify(data) };
      }
      if (data && typeof data === 'object') {
        return {
          text:
            data.output ||
            data.text ||
            data.response ||
            data.message ||
            data.result ||
            data.data ||
            JSON.stringify(data),
          vehicle: data.vehicle,
          title: data.title || data.sessionTitle || data.chatName,
        };
      }
    }
    const textResp = await res.text();
    return { text: textResp };
  };

  try {
    return await executeRequest(MEKAI_CHAT_ENDPOINT);
  } catch (err) {
    console.error('Diagnostic engine request error:', err);
    throw new Error('Unable to reach Mekai diagnostic engine. Please check network connection.');
  }
}

function parseFormattedText(line: string) {
  // If line has an odd number of '**', append temporary closing '**' so partial markdown bold renders smoothly while typing
  const asterisksCount = (line.match(/\*\*/g) || []).length;
  const safeLine = asterisksCount % 2 !== 0 ? line + '**' : line;
  const parts = safeLine.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// Mekai response rendered in sage green with optional typewriter cursor
function renderMekaiText(text: string, isTyping: boolean = false) {
  if (!text || !text.trim()) {
    if (isTyping) {
      return (
        <span
          className="inline-block w-2 h-4 bg-[#A3B18A] align-middle rounded-[1px] animate-pulse shadow-[0_0_8px_rgba(163,177,138,0.6)]"
          aria-hidden="true"
        />
      );
    }
    return null;
  }

  const paragraphs = text.split(/\n\n+/);
  return (
    <>
      {paragraphs.map((p, pIdx) => {
        const lines = p.split('\n');
        const isLastParagraph = pIdx === paragraphs.length - 1;

        return (
          <div key={pIdx} className="space-y-1.5">
            {lines.map((line, lineIdx) => {
              const isLastLine = isLastParagraph && lineIdx === lines.length - 1;
              const trimmed = line.trim();

              if (!trimmed) {
                return (
                  <div key={lineIdx} className="h-2">
                    {isTyping && isLastLine && (
                      <span
                        className="inline-block w-2 h-4 bg-[#A3B18A] align-middle rounded-[1px] animate-pulse shadow-[0_0_8px_rgba(163,177,138,0.6)]"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                );
              }

              if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                const content = trimmed.replace(/^[•\-*]\s*/, '');
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2 text-base leading-normal">
                    <span className="text-[#A3B18A] mt-0.5 shrink-0 font-bold">•</span>
                    <span className="text-[#A3B18A]">
                      {parseFormattedText(content)}
                      {isTyping && isLastLine && (
                        <span
                          className="inline-block w-2 h-4 ml-1 bg-[#A3B18A] align-middle rounded-[1px] animate-pulse shadow-[0_0_8px_rgba(163,177,138,0.6)]"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </div>
                );
              }

              if (/^\d+\.\s/.test(trimmed)) {
                const num = trimmed.match(/^(\d+)\.\s/)?.[1];
                const content = trimmed.replace(/^\d+\.\s*/, '');
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2 text-base leading-normal">
                    <span className="text-[#A3B18A] font-semibold font-mono shrink-0">{num}.</span>
                    <span className="text-[#A3B18A]">
                      {parseFormattedText(content)}
                      {isTyping && isLastLine && (
                        <span
                          className="inline-block w-2 h-4 ml-1 bg-[#A3B18A] align-middle rounded-[1px] animate-pulse shadow-[0_0_8px_rgba(163,177,138,0.6)]"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </div>
                );
              }

              return (
                <p key={lineIdx} className="text-[#A3B18A] text-base leading-normal">
                  {parseFormattedText(line)}
                  {isTyping && isLastLine && (
                    <span
                      className="inline-block w-2 h-4 ml-1 bg-[#A3B18A] align-middle rounded-[1px] animate-pulse shadow-[0_0_8px_rgba(163,177,138,0.6)]"
                      aria-hidden="true"
                    />
                  )}
                </p>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

interface MekaiResponseViewProps {
  text: string;
  isTyping?: boolean;
  onDoneTyping?: () => void;
  onScrollRequested?: () => void;
}

function MekaiResponseView({
  text,
  isTyping = false,
  onDoneTyping,
  onScrollRequested,
}: MekaiResponseViewProps) {
  const [displayedCount, setDisplayedCount] = useState(() => (isTyping ? 1 : text.length));
  const lastScrollRef = useRef<number>(0);

  useEffect(() => {
    if (!isTyping) {
      setDisplayedCount(text.length);
      return;
    }

    setDisplayedCount(1);
    const totalLength = text.length;
    if (totalLength <= 1) {
      setDisplayedCount(totalLength);
      onDoneTyping?.();
      return;
    }

    // Adaptive step size based on total text length so response renders fast and fluidly (~1.2s - 2.5s)
    const stepSize = Math.max(1, Math.ceil(totalLength / 120));
    const intervalTime = 16; // 60fps smooth progression

    let current = 1;
    const interval = setInterval(() => {
      current = Math.min(totalLength, current + stepSize);
      setDisplayedCount(current);

      const now = Date.now();
      if (now - lastScrollRef.current > 100 || current >= totalLength) {
        lastScrollRef.current = now;
        onScrollRequested?.();
      }

      if (current >= totalLength) {
        clearInterval(interval);
        onDoneTyping?.();
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [text, isTyping]);

  const currentlyTyping = isTyping && displayedCount < text.length;
  const visibleText = text ? text.slice(0, displayedCount) : '';

  return (
    <div
      onClick={() => {
        if (currentlyTyping) {
          setDisplayedCount(text.length);
          onDoneTyping?.();
          onScrollRequested?.();
        }
      }}
      className={currentlyTyping ? 'cursor-pointer select-text' : 'select-text'}
      title={currentlyTyping ? 'Click to show full response immediately' : undefined}
    >
      {renderMekaiText(visibleText, currentlyTyping)}
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'T';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function AudioMessagePlayer({ url, duration }: { url?: string; duration?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => {
        console.warn('Audio play error:', err);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-[#151D1B] border border-[#23312C] rounded-2xl px-4 py-3 shadow-md min-w-[220px] sm:min-w-[260px] text-white">
      {url && (
        <audio
          ref={audioRef}
          src={url}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
        />
      )}
      <button
        type="button"
        onClick={togglePlay}
        className="w-9 h-9 rounded-full bg-[#A3B18A] hover:bg-[#92A177] text-[#0E1111] flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-sm focus:outline-none"
        title={isPlaying ? 'Pause' : 'Play audio recording'}
        aria-label={isPlaying ? 'Pause audio recording' : 'Play audio recording'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 h-6">
          {[35, 70, 50, 95, 60, 100, 75, 40, 85, 60, 90, 45, 65, 30, 70, 50].map((h, i) => (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-300 ${
                isPlaying ? 'bg-[#A3B18A] animate-pulse' : 'bg-[#283631]'
              }`}
              style={{
                height: isPlaying ? `${Math.max(25, (h * (0.6 + Math.sin(i * 1.2))) % 100)}%` : `${h}%`,
              }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#8A9A78] mt-1 font-mono">
          <span className="flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-[#A3B18A]" />
            Audio Recording
          </span>
          {duration && <span>{duration}</span>}
        </div>
      </div>
    </div>
  );
}

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

export function AppDashboard({
  activeCode,
  technicianName,
  onSignOut,
  onViewLanding,
  initialPrompt,
}: AppDashboardProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'new-diagnostics' | 'search-chats'>('new-diagnostics');
  const [promptInput, setPromptInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Collapsible state for Recents section (toggled by clicking Recents header)
  const [isRecentsCollapsed, setIsRecentsCollapsed] = useState(false);

  // Active chat conversation messages and analyzing state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  const [currentSessionTitle, setCurrentSessionTitle] = useState<string>('');

  // Persistent user chat sessions from localStorage
  const [recentSessions, setRecentSessions] = useState<RecentChatSession[]>(() => {
    try {
      const stored = localStorage.getItem('mekai_diagnostic_sessions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Staged attachment for next chat query (file & audio)
  const [attachedMedia, setAttachedMedia] = useState<ChatAttachment | null>(null);

  // Audio recording state & refs
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [audioVolume, setAudioVolume] = useState(0); // 0 to 100 for visual wave

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const isRecordingRef = useRef(false);
  const basePromptRef = useRef('');
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Hidden file input ref for direct file selection
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resolved technician name and first name for prompt greeting
  const displayName = technicianName || 'Adeyemi Tomiwa';
  const firstName = displayName.trim().split(/\s+/)[0] || 'Adeyemi';
  const initials = getInitials(displayName);

  // Dynamic greeting randomization
  const [greetingIndex, setGreetingIndex] = useState(() =>
    Math.floor(Math.random() * WORKSHOP_GREETINGS.length)
  );

  // Persist real sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mekai_diagnostic_sessions', JSON.stringify(recentSessions));
    } catch {
      // ignore
    }
  }, [recentSessions]);

  // Handle initialPrompt if passed from landing hero or navigation
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handlePromptSubmit(initialPrompt.trim());
    }
  }, [initialPrompt]);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAnalyzing]);

  // Clean up recording timer and audio streams on unmount
  useEffect(() => {
    return () => {
      isRecordingRef.current = false;
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {
          // ignore
        }
      }
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.onend = null;
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
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const formatRecordingTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(file.size / 1024))} KB`;

    if (file.type.startsWith('image/')) {
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

    e.target.value = '';
  };

  const handleStartRecording = async () => {
    // If already recording, stop
    if (isRecording) {
      handleStopRecording();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];
      isRecordingRef.current = true;
      basePromptRef.current = promptInput;
      setLiveTranscript('');
      setIsRecording(true);
      setRecordingDuration(0);

      // 1. Audio Visualizer using Web Audio API to detect real sound levels
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          analyserRef.current = analyser;
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateAudioLevel = () => {
            if (!isRecordingRef.current) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            const normalized = Math.min(100, Math.round((avg / 128) * 100));
            setAudioVolume(normalized);
            animFrameRef.current = requestAnimationFrame(updateAudioLevel);
          };
          updateAudioLevel();
        }
      } catch (audioErr) {
        console.warn('AudioContext visualization setup warning:', audioErr);
      }

      // 2. MediaRecorder for acoustic diagnostic audio file capture
      try {
        let options: MediaRecorderOptions = {};
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          options = { mimeType: 'audio/webm;codecs=opus' };
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          options = { mimeType: 'audio/webm' };
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          options = { mimeType: 'audio/mp4' };
        }

        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const mimeType = mediaRecorder.mimeType || 'audio/webm';
            const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
            if (audioBlob.size > 200) {
              const audioUrl = URL.createObjectURL(audioBlob);
              setAttachedMedia({
                type: 'audio',
                name: `Acoustic-Diagnostic-${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.webm`,
                url: audioUrl,
                size: `${recordingDuration > 0 ? `${recordingDuration}s` : 'Audio'}`,
              });
            }
          }
        };

        mediaRecorder.start(200);
        mediaRecorderRef.current = mediaRecorder;
      } catch (recErr) {
        console.warn('MediaRecorder init fallback:', recErr);
      }

      // 3. Speech Recognition - actively listens to what is being spoken
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          const rec = new SpeechRec();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'en-US';

          rec.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = 0; i < event.results.length; ++i) {
              const res = event.results[i];
              if (res.isFinal) {
                finalTranscript += res[0].transcript + ' ';
              } else {
                interimTranscript += res[0].transcript;
              }
            }
            const spokenNow = (finalTranscript + interimTranscript).trim();
            if (spokenNow) {
              setLiveTranscript(spokenNow);
              const base = basePromptRef.current.trim();
              const combined = base ? `${base} ${spokenNow}` : spokenNow;
              setPromptInput(combined);
            }
          };

          rec.onerror = (e: any) => {
            console.warn('Speech recognition status:', e.error);
          };

          rec.onend = () => {
            // Automatically keep listening if user hasn't finished recording
            if (isRecordingRef.current) {
              try {
                rec.start();
              } catch {
                // ignore
              }
            }
          };

          rec.start();
          speechRecognitionRef.current = rec;
        } catch (speechErr) {
          console.warn('SpeechRecognition setup warning:', speechErr);
        }
      }

      // 4. Duration Timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access warning:', err);
      alert('Microphone access is needed so Mekai can listen to what is being spoken. Please allow microphone permissions.');
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  };

  const handleStopRecording = () => {
    isRecordingRef.current = false;

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.onend = null;
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

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    setIsRecording(false);
    setAudioVolume(0);
  };

  const handleCancelRecording = () => {
    isRecordingRef.current = false;
    setPromptInput(basePromptRef.current);
    setLiveTranscript('');
    audioChunksRef.current = [];

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.onend = null;
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

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    setIsRecording(false);
    setAudioVolume(0);
  };

  const resetDiagnosticsSession = () => {
    setActiveTab('new-diagnostics');
    setPromptInput('');
    setMessages([]);
    setCurrentSessionId(`session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
    setCurrentSessionTitle('');
    setAttachedMedia(null);
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

  // Submit diagnostic prompt handler - connects to real n8n webhook
  // Naming on the session is picked from Mekai as configured
  const handlePromptSubmit = async (promptOverride?: string) => {
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

    // Ensure any previously active typing effect is completed when new input is submitted
    const newMessages: ChatMessage[] = [
      ...messages.map((m) => ({ ...m, isTyping: false })),
      userMsg,
    ];
    setMessages(newMessages);
    setPromptInput('');
    setAttachedMedia(null);
    setIsAnalyzing(true);

    try {
      const webhookResult = await callMekaiWebhook(
        finalText,
        currentSessionId,
        displayName,
        activeCode,
        currentAttachment || undefined
      );

      const mekaiMsg: ChatMessage = {
        id: `msg-${Date.now()}-mek`,
        sender: 'mekai',
        text: webhookResult.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isTyping: true,
      };

      const finalMessages = [...newMessages, mekaiMsg];
      setMessages(finalMessages);
      setIsAnalyzing(false);

      // Session naming: logged directly by Mekai (e.g. "Ford Explorer 2014")
      const sessionNameFromMekai = extractMekaiSessionName(
        webhookResult.text,
        finalText,
        webhookResult,
        currentSessionTitle
      );

      setCurrentSessionTitle(sessionNameFromMekai);

      // Update recent sessions with the Mekai-logged session title (persisted without isTyping flag)
      const storedMessages = finalMessages.map((m) =>
        m.id === mekaiMsg.id ? { ...m, isTyping: false } : m
      );
      setRecentSessions((prev) => {
        const filtered = prev.filter((s) => s.id !== currentSessionId);
        return [
          {
            id: currentSessionId,
            title: sessionNameFromMekai,
            snippet: webhookResult.text.substring(0, 70) + '...',
            date: 'Just now',
            messages: storedMessages,
            updatedAt: Date.now(),
          },
          ...filtered,
        ];
      });
    } catch (err: any) {
      console.error('Error fetching Mekai response:', err);
      const friendlyError =
        err?.message?.includes('Unable to reach Mekai') || err?.message?.includes('Network error')
          ? 'Unable to reach the Mekai diagnostic engine at this moment. Please check your network connection and try again.'
          : `Diagnostic communication notice: ${err?.message || 'Please check connection and retry.'}`;
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: 'mekai',
        text: friendlyError,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
      setIsAnalyzing(false);
    }
  };

  const handleOpenRecentSession = (session: RecentChatSession) => {
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    setCurrentSessionTitle(session.title);
    setActiveTab('new-diagnostics');
    setMobileDrawerOpen(false);
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setRecentSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      resetDiagnosticsSession();
    }
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
        <div
          id="diagnostic-input-pill"
          className="w-full rounded-full border border-[#23312C] bg-[#0E1312] hover:border-[#354841] focus-within:border-[#A3B18A] px-4 sm:px-6 md:px-7 py-3 sm:py-3.5 md:py-4 flex items-center gap-3 sm:gap-4 md:gap-5 transition-all shadow-lg min-h-[52px] md:min-h-[58px]"
        >
          {/* Left Plus Icon to directly send file */}
          <button
            id="send-file-btn"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1 md:p-1.5 focus:outline-none shrink-0 text-[#8A9A78] hover:text-white transition-colors min-w-[36px] min-h-[36px] md:min-w-[44px] md:min-h-[44px] flex items-center justify-center"
            title="Send file"
            aria-label="Send file"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6 stroke-[2]" />
          </button>

          {isRecording ? (
            <div className="flex-1 flex items-center justify-between min-w-0 py-0.5 gap-2 sm:gap-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {/* Pulsing listening indicator */}
                <div className="relative flex items-center justify-center shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping absolute" />
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 relative" />
                </div>

                {/* Dynamic Sound Equalizer Waves responding to voice volume */}
                <div className="flex items-center gap-0.5 shrink-0 h-4" title="Audio meter">
                  {[0.5, 1.2, 0.7, 1.5, 0.9].map((multiplier, i) => {
                    const dynamicHeight = Math.max(4, Math.min(18, Math.round((audioVolume * multiplier * 0.25) + 4)));
                    return (
                      <span
                        key={i}
                        style={{ height: `${dynamicHeight}px` }}
                        className="w-1 bg-[#A3B18A] rounded-full transition-all duration-75"
                      />
                    );
                  })}
                </div>

                {/* Live Speech Recognition Transcription */}
                <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
                  <span className="text-red-400 text-xs sm:text-sm font-semibold tracking-wide shrink-0">
                    Listening:
                  </span>
                  <span className="text-xs sm:text-sm md:text-base text-[#A3B18A] font-medium truncate">
                    {liveTranscript || promptInput || 'Speak now (e.g. Ford Explorer 2014)'}
                  </span>
                </div>

                {/* Recording Duration */}
                <span className="text-[#A3B18A] font-mono text-xs sm:text-sm shrink-0 ml-1">
                  {formatRecordingTime(recordingDuration)}
                </span>
              </div>

              {/* Action Buttons: Discard, Done, Send */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCancelRecording}
                  className="p-1.5 text-[#8A9A78] hover:text-red-400 transition-colors min-w-[36px] min-h-[36px] md:min-w-[44px] md:min-h-[44px] flex items-center justify-center"
                  title="Cancel and discard"
                >
                  <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="px-2.5 md:px-3.5 py-1 md:py-1.5 bg-[#202B27] hover:bg-[#283832] text-[#A3B18A] border border-[#2B3E36] rounded-full text-xs md:text-sm font-bold transition-all shadow-sm flex items-center gap-1 min-h-[36px] md:min-h-[44px]"
                  title="Finish listening"
                >
                  <Check className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-[2.5]" />
                  <span className="hidden sm:inline">Done</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleStopRecording();
                    setTimeout(() => {
                      handlePromptSubmit();
                    }, 120);
                  }}
                  disabled={!promptInput.trim() && !liveTranscript.trim() && !attachedMedia}
                  className="w-8 h-8 md:w-10 md:h-10 min-w-[36px] min-h-[36px] md:min-w-[44px] md:min-h-[44px] rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-90 disabled:opacity-40 text-[#0E1111] flex items-center justify-center transition-all shadow-sm shrink-0"
                  title="Send now"
                >
                  <ArrowUp className="w-4 h-4 md:w-5 md:h-5 stroke-[2.8]" />
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
                placeholder="Ask Mekai (e.g. Ford Explorer 2014)"
                autoComplete="off"
                spellCheck="false"
                className="flex-1 bg-transparent text-[#A3B18A] caret-[#A3B18A] placeholder-[#5A6964] text-base md:text-lg leading-normal focus:outline-none focus:ring-0 font-sans min-w-0"
              />

              {/* Right Controls: Microphone & Submit Arrow */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="text-[#8A9A78] hover:text-[#A3B18A] transition-colors p-1 md:p-1.5 focus:outline-none min-w-[36px] min-h-[36px] md:min-w-[44px] md:min-h-[44px] flex items-center justify-center"
                  title="Listen with microphone"
                  aria-label="Listen with microphone"
                >
                  <Mic className="w-5 h-5 md:w-6 md:h-6 stroke-[2]" />
                </button>

                <button
                  id="submit-diagnostic-prompt-btn"
                  type="submit"
                  disabled={(!promptInput.trim() && !attachedMedia) || isAnalyzing}
                  className="w-8 h-8 md:w-10 md:h-10 min-w-[36px] min-h-[36px] md:min-w-[44px] md:min-h-[44px] rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-90 disabled:opacity-40 disabled:hover:bg-[#A3B18A] text-[#0E1111] flex items-center justify-center transition-all shadow-sm shrink-0"
                  title="Send prompt"
                >
                  <ArrowUp className="w-4 h-4 md:w-5 md:h-5 stroke-[2.8]" />
                </button>
              </div>
            </>
          )}
        </div>
      </form>

      {showDisclaimer && (
        <p className="text-xs md:text-[13px] text-[#707D7A] text-center mt-2 font-normal select-none tracking-normal">
          Mekai is AI and can make mistakes.
        </p>
      )}
    </div>
  );

  return (
    <div id="app-dashboard" className="fixed inset-0 h-screen h-[100dvh] max-h-[100dvh] w-full max-w-full bg-[#0E1111] text-white flex overflow-hidden font-sans selection:bg-[#A3B18A]/30 selection:text-white overscroll-none touch-pan-y">
      {/* Hidden file input for direct file send */}
      <input
        ref={fileInputRef}
        type="file"
        accept="*/*"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* MOBILE & TABLET FULL-SCREEN DRAWER */}
      {mobileDrawerOpen && (
        <div
          id="mobile-drawer"
          className="lg:hidden fixed inset-0 z-50 bg-[#0E1111] flex flex-col justify-between h-[100dvh] max-h-[100dvh] w-full overflow-hidden animate-fadeIn select-none overscroll-none"
        >
          {/* Fixed/Sticky Top Bar: Exact same layout as main header (space-between, left group with logo & hamburger, locked right slot) */}
          <header className="sticky top-0 z-10 w-full p-4 sm:p-5 md:px-8 bg-[#0E1111] border-b border-[#1A2320]/60 shrink-0 shadow-sm">
            <div className="flex items-center justify-between w-full h-10 md:h-12">
              {/* Left Group: Logo and Hamburger toggle pinned together on the far left */}
              <div className="flex items-center gap-3.5 h-10 md:h-12 shrink-0">
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-10 h-10 md:w-12 md:h-12 min-h-[40px] md:min-h-[48px] rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 flex flex-col items-center justify-center gap-1.5 shrink-0 transition-transform shadow-md focus:outline-none cursor-pointer"
                  aria-label="Toggle navigation drawer"
                >
                  <span className="w-4 md:w-5 h-[2.5px] bg-[#0E1111] rounded-full" />
                  <span className="w-4 md:w-5 h-[2.5px] bg-[#0E1111] rounded-full" />
                </button>

                <div
                  className="cursor-pointer flex items-center gap-2.5 h-9 md:h-11 select-none"
                  onClick={() => {
                    resetDiagnosticsSession();
                    setMobileDrawerOpen(false);
                  }}
                >
                  <span className="font-heading font-extrabold text-xl md:text-2xl tracking-widest text-[#A3B18A] leading-none">
                    MEKAI
                  </span>
                </div>
              </div>

              {/* Right Slot: Locked fixed-size container (w-10 h-10 md:w-12 md:h-12) for in-place swapping */}
              <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center">
                <button
                  id="mobile-drawer-close-btn"
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-10 h-10 md:w-12 md:h-12 min-h-[40px] md:min-h-[48px] rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 text-[#0E1111] flex items-center justify-center shrink-0 transition-transform shadow-md focus:outline-none cursor-pointer"
                  aria-label="Close navigation drawer"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </header>

          {/* Scrollable Drawer Content (Nav items and Recents) */}
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 md:px-10 md:py-6 overscroll-contain no-scrollbar w-full max-w-xl md:max-w-2xl mx-auto">
            <nav className="space-y-2.5 md:space-y-3">
              <button
                id="mobile-nav-new-diagnostics-btn"
                type="button"
                onClick={() => {
                  resetDiagnosticsSession();
                  setMobileDrawerOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 text-left transition-colors font-heading text-lg md:text-xl py-1 md:py-1.5 ${
                  activeTab === 'new-diagnostics'
                    ? 'text-[#A3B18A] font-extrabold'
                    : 'text-[#A3B18A]/90 hover:text-[#A3B18A] font-bold'
                }`}
              >
                <div className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center shrink-0">
                  <SquarePen className="w-5 h-5 md:w-6 md:h-6 text-[#A3B18A]" />
                </div>
                <span>New Diagnostics</span>
              </button>

              <button
                id="mobile-nav-search-chats-btn"
                type="button"
                onClick={() => {
                  setActiveTab('search-chats');
                  setMobileDrawerOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 text-left transition-colors font-heading text-lg md:text-xl py-1 md:py-1.5 ${
                  activeTab === 'search-chats'
                    ? 'text-[#A3B18A] font-extrabold'
                    : 'text-[#A3B18A]/90 hover:text-[#A3B18A] font-bold'
                }`}
              >
                <div className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center shrink-0">
                  <Search className="w-5 h-5 md:w-6 md:h-6 text-[#A3B18A]" />
                </div>
                <span>Search Chats</span>
              </button>
            </nav>

            {/* Permanent Collapsible Recents in Mobile/Tablet Drawer (Only up to 7 sessions) */}
            <div className="mt-8 md:mt-10">
              <button
                type="button"
                onClick={() => setIsRecentsCollapsed((prev) => !prev)}
                className="w-full flex items-center justify-between text-base md:text-lg font-heading font-bold text-[#A3B18A] tracking-wide cursor-pointer focus:outline-none select-none py-1"
              >
                <div className="flex items-center gap-2">
                  <span>Recents</span>
                  <ChevronDown
                    className={`w-4 h-4 md:w-5 md:h-5 text-[#A3B18A] transition-transform duration-200 ${
                      isRecentsCollapsed ? '-rotate-90' : 'rotate-0'
                    }`}
                  />
                </div>
              </button>

              {!isRecentsCollapsed && (
                <div className="mt-3 space-y-1.5 animate-fadeIn">
                  {recentSessions.length > 0 ? (
                    recentSessions.slice(0, 7).map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between group rounded-lg hover:bg-[#151D1B] pr-2 min-h-[40px] md:min-h-[46px]"
                      >
                        <button
                          type="button"
                          onClick={() => handleOpenRecentSession(session)}
                          className={`flex-1 text-left px-3 py-2 md:py-2.5 text-sm md:text-base truncate transition-colors ${
                            currentSessionId === session.id
                              ? 'text-[#A3B18A] font-bold bg-[#161F1C] rounded'
                              : 'text-[#8A9A78] hover:text-[#A3B18A]'
                          }`}
                        >
                          {session.title}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSession(e, session.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-[#5A6964] hover:text-red-400 transition-opacity"
                          title="Delete chat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-[#5A6964] italic">
                      No recent sessions
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Fixed/Pinned Bottom User Profile Bar */}
          <div className="w-full border-t border-[#192220]/60 bg-[#0E1111] shrink-0">
            <div className="max-w-xl md:max-w-2xl mx-auto px-6 py-4 md:px-10 md:py-6 flex items-center justify-between">
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#A3B18A] text-[#0E1111] font-heading font-extrabold text-xs md:text-sm flex items-center justify-center shrink-0 select-none shadow-sm"
                  aria-label={`Profile for ${displayName}`}
                >
                  {initials}
                </div>
                <span className="font-heading font-bold text-base md:text-lg text-[#A3B18A] truncate">
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
                className="w-10 h-10 md:w-12 md:h-12 min-h-[40px] md:min-h-[48px] flex items-center justify-center text-[#8A9A78] hover:text-[#A3B18A] transition-colors rounded-xl focus:outline-none hover:bg-[#161F1C]"
                title="Workshop Settings & Profile"
                aria-label="Workshop Settings"
              >
                <Settings className="w-5 h-5 md:w-6 md:h-6 text-[#A3B18A]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR (Visible only on Desktop lg:) */}
      {isSidebarOpen ? (
        <aside
          id="dashboard-sidebar-open"
          className="hidden lg:flex w-72 bg-[#0E1111] border-r border-[#192220] flex-col justify-between shrink-0 select-none z-20 transition-all duration-200"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-10 h-8">
              <div
                className="cursor-pointer h-8 flex items-center"
                onClick={resetDiagnosticsSession}
                title="New Diagnostics"
              >
                <MekaiLogo iconSize={32} showText={true} textSize="text-xl tracking-widest font-heading font-extrabold" />
              </div>

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

            <nav className="space-y-2.5">
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

            {/* Permanent Collapsible Recents Section (Only up to 7 sessions displayed) */}
            <div className="mt-10">
              <button
                type="button"
                onClick={() => setIsRecentsCollapsed((prev) => !prev)}
                className="w-full flex items-center justify-between text-xs font-heading font-bold text-[#A3B18A] tracking-wider mb-2.5 group cursor-pointer focus:outline-none select-none"
                title={isRecentsCollapsed ? 'Expand Recents' : 'Collapse Recents'}
              >
                <div className="flex items-center gap-1.5 group-hover:text-[#BFCCAA] transition-colors">
                  <span>Recents</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#A3B18A] transition-transform duration-200 ${
                      isRecentsCollapsed ? '-rotate-90' : 'rotate-0'
                    }`}
                  />
                </div>
              </button>

              {!isRecentsCollapsed && (
                recentSessions.length > 0 ? (
                  <div className="space-y-1 max-h-60 overflow-y-auto pr-1 animate-fadeIn no-scrollbar">
                    {recentSessions.slice(0, 7).map((session) => (
                      <div
                        key={session.id}
                        className="group flex items-center justify-between rounded-lg hover:bg-[#151D1B] pr-1.5"
                      >
                        <button
                          type="button"
                          onClick={() => handleOpenRecentSession(session)}
                          className={`flex-1 text-left px-2 py-1.5 text-xs truncate transition-colors ${
                            currentSessionId === session.id
                              ? 'text-[#A3B18A] font-semibold bg-[#161F1C] rounded'
                              : 'text-[#8A9A78] hover:text-[#A3B18A]'
                          }`}
                          title={session.title}
                        >
                          {session.title}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSession(e, session.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#5A6964] hover:text-red-400 transition-opacity"
                          title="Delete chat"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-2 py-3 text-xs text-[#5A6964] italic select-none">
                    No recent sessions
                  </div>
                )
              )}
            </div>
          </div>

          <div className="p-6 border-t border-[#192220]/60 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
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
        <aside
          id="dashboard-sidebar-closed"
          className="hidden lg:flex w-20 bg-[#0E1111] border-r border-[#192220] flex-col justify-between shrink-0 select-none z-20 transition-all duration-200"
        >
          <div className="p-6">
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

            <nav className="space-y-2.5">
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

      {/* MAIN VIEW AREA - Fixed height viewport locked container */}
      <main className="flex-1 flex flex-col h-full min-h-0 w-full overflow-hidden relative bg-[#0E1111]">
        {/* Pinned Header */}
        <header className="w-full p-4 sm:p-5 md:px-8 lg:px-10 z-10 shrink-0 border-b border-[#1A2320]/40 lg:border-b-0">
          <div className="flex lg:hidden items-center justify-between w-full h-10 md:h-12">
            {/* Left Group: Logo and Hamburger toggle pinned together on the far left */}
            <div className="flex items-center gap-3.5 h-10 md:h-12 shrink-0">
              <button
                id="mobile-drawer-toggle-btn"
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="w-10 h-10 md:w-12 md:h-12 min-h-[40px] md:min-h-[48px] rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 flex flex-col items-center justify-center gap-1.5 shrink-0 transition-transform shadow-md focus:outline-none cursor-pointer"
                aria-label="Open navigation drawer"
              >
                <span className="w-4 md:w-5 h-[2.5px] bg-[#0E1111] rounded-full" />
                <span className="w-4 md:w-5 h-[2.5px] bg-[#0E1111] rounded-full" />
              </button>

              <span className="font-heading font-extrabold text-xl md:text-2xl tracking-widest text-[#A3B18A] select-none leading-none">
                MEKAI
              </span>
            </div>

            {/* Right Slot: Locked fixed-size container (w-10 h-10 md:w-12 md:h-12) for in-place swapping */}
            <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center">
              <button
                id="mobile-profile-avatar-btn"
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="w-10 h-10 md:w-12 md:h-12 min-h-[40px] md:min-h-[48px] rounded-full bg-[#A3B18A] text-[#0E1111] font-heading font-extrabold text-xs md:text-sm flex items-center justify-center shrink-0 shadow-md active:scale-95 transition-transform focus:outline-none cursor-pointer"
                title={`${displayName} - Workshop Settings`}
                aria-label={`Profile for ${displayName}`}
              >
                {initials}
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-end w-full h-9">
            <button
              id="upgrade-tier-btn"
              type="button"
              className="rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 text-[#0E1111] font-heading font-extrabold text-sm px-6 py-2 transition-all shadow-md"
            >
              Upgrade
            </button>
          </div>
        </header>

        {activeTab === 'new-diagnostics' ? (
          messages.length === 0 ? (
            /* Clean Empty Initial State */
            <div className="flex-1 min-h-0 flex flex-col justify-between md:justify-center items-center px-4 sm:px-6 md:px-8 w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-[760px] mx-auto pb-4 sm:pb-8 md:pb-0 md:-mt-8 overflow-hidden">
              <div className="my-auto md:my-0 text-center">
                <h1
                  id="diagnostics-prompt-heading"
                  className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-extrabold text-[#A3B18A] font-heading tracking-tight text-center leading-snug select-none md:mb-7 max-w-xl mx-auto"
                >
                  {WORKSHOP_GREETINGS[greetingIndex](firstName)}
                </h1>
              </div>

              <div className="w-full shrink-0">
                {renderDiagnosticInputBar(false)}
              </div>
            </div>
          ) : (
            /* Active Chat with Fixed-Height Container & Pinned Input Bar */
            <div className="flex-1 min-h-0 flex flex-col h-full w-full overflow-hidden">
              {/* Internal scrolling message history area */}
              <div
                id="diagnostic-chat-messages"
                className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 md:px-8 w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-[760px] mx-auto py-4 md:py-6 space-y-5 md:space-y-6 overscroll-contain no-scrollbar"
              >
                {messages.map((msg) => {
                  const isImage = msg.attachment?.type === 'image';
                  const isAudio = msg.attachment?.type === 'audio';
                  const isFile = msg.attachment?.type === 'file';
                  const isDefaultImageText = msg.text === 'Diagnostic inspection photo attached for analysis.';
                  const isDefaultAudioText = msg.text.startsWith('Acoustic audio sample recorded');
                  const isDefaultDocText = msg.text.startsWith('Diagnostic document attached');
                  const hasCustomCaption = msg.text && !isDefaultImageText && !isDefaultAudioText && !isDefaultDocText;

                  return (
                    <div
                      key={msg.id}
                      className={`w-full flex ${
                        msg.sender === 'engineer' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.sender === 'engineer' ? (
                        isImage && msg.attachment?.url ? (
                          <div className="flex flex-col items-end gap-2 max-w-[85%]">
                            <div className="overflow-hidden rounded-2xl border border-[#23312C] shadow-lg bg-[#141A18]">
                              <img
                                src={msg.attachment.url}
                                alt={msg.attachment.name || 'Inspection image'}
                                className="max-h-72 w-auto max-w-full rounded-2xl object-cover"
                              />
                            </div>
                            {hasCustomCaption && (
                              <div className="bg-[#A3B18A] text-[#0E1111] text-base leading-normal font-semibold px-5 py-3 rounded-full shadow-md break-words">
                                <span>{msg.text}</span>
                              </div>
                            )}
                          </div>
                        ) : isAudio ? (
                          <div className="flex flex-col items-end gap-2 max-w-[85%]">
                            <AudioMessagePlayer
                              url={msg.attachment?.url}
                              duration={msg.attachment?.size}
                            />
                            {hasCustomCaption && (
                              <div className="bg-[#A3B18A] text-[#0E1111] text-base leading-normal font-semibold px-5 py-3 rounded-full shadow-md break-words">
                                <span>{msg.text}</span>
                              </div>
                            )}
                          </div>
                        ) : isFile ? (
                          <div className="flex flex-col items-end gap-2 max-w-[85%]">
                            <div className="flex items-center gap-2.5 bg-[#151D1B] border border-[#23312C] px-4 py-2.5 rounded-2xl text-xs font-mono text-[#A3B18A] shadow-md">
                              <FileText className="w-4 h-4 text-[#A3B18A] shrink-0" />
                              <span className="truncate max-w-[200px] text-white font-medium">
                                {msg.attachment?.name}
                              </span>
                              {msg.attachment?.size && (
                                <span className="text-[#8A9A78]">({msg.attachment.size})</span>
                              )}
                            </div>
                            {hasCustomCaption && (
                              <div className="bg-[#A3B18A] text-[#0E1111] text-base leading-normal font-semibold px-5 py-3 rounded-full shadow-md break-words">
                                <span>{msg.text}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-[#A3B18A] text-[#0E1111] text-base leading-normal font-semibold px-5 py-3 rounded-full shadow-md max-w-[85%] break-words inline-block">
                            <span>{msg.text}</span>
                          </div>
                        )
                      ) : (
                      /* Mekai response strictly in sage green (#A3B18A) with typed rendering */
                      <div className={`max-w-[95%] text-base leading-normal space-y-3.5 bg-transparent border-0 p-0 shadow-none ${
                        msg.isError ? 'text-red-400 flex items-start gap-2.5' : 'text-[#A3B18A]'
                      }`}>
                        {msg.isError && (
                          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 text-[#A3B18A]">
                          {msg.isError ? (
                            <p className="text-red-400 text-base leading-normal">{msg.text}</p>
                          ) : (
                            <MekaiResponseView
                              text={msg.text}
                              isTyping={Boolean(msg.isTyping)}
                              onDoneTyping={() => {
                                setMessages((prev) =>
                                  prev.map((m) => (m.id === msg.id ? { ...m, isTyping: false } : m))
                                );
                              }}
                              onScrollRequested={() => {
                                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                              }}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

                {isAnalyzing && (
                  <div className="w-full flex justify-start">
                    <div className="inline-flex items-center gap-1.5 py-2 px-1">
                      <span className="w-2 h-2 rounded-full bg-[#A3B18A] animate-dot-1" />
                      <span className="w-2 h-2 rounded-full bg-[#A3B18A] animate-dot-2" />
                      <span className="w-2 h-2 rounded-full bg-[#A3B18A] animate-dot-3" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Pinned Bottom Input Bar Container */}
              <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-[760px] mx-auto px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 pt-2 shrink-0 bg-[#0E1111] z-10 border-t border-[#192220]/60 sm:border-t-0">
                {renderDiagnosticInputBar(true)}
              </div>
            </div>
          )
        ) : (
          /* Search Chats View - Fixed viewport container with pinned search field & internal scrolling list only */
          <div className="flex-1 min-h-0 flex flex-col h-full w-full overflow-hidden">
            {/* Pinned Search Field Container at Top */}
            <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-[760px] mx-auto px-4 sm:px-6 md:px-8 pt-3 sm:pt-6 pb-2 shrink-0 bg-[#0E1111] z-10">
              <div
                id="search-chats-pill"
                className="w-full rounded-full border border-[#23312C] bg-[#0E1312] hover:border-[#354841] focus-within:border-[#A3B18A] px-4 sm:px-6 md:px-7 py-3 sm:py-3.5 md:py-4 flex items-center gap-3 md:gap-4 transition-all shadow-lg mx-auto min-h-[52px] md:min-h-[58px]"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6 text-[#A3B18A] shrink-0 stroke-[2]" />
                <input
                  id="search-chats-input"
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats by vehicle (e.g. Ford Explorer 2014) or code"
                  className="flex-1 bg-transparent text-white placeholder-[#5A6964] text-base md:text-lg leading-normal focus:outline-none font-sans min-w-0"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 md:p-1.5 text-[#5A6964] hover:text-[#A3B18A] focus:outline-none shrink-0 min-w-[32px] min-h-[32px] flex items-center justify-center"
                    title="Clear search"
                  >
                    <X className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Internal Scrolling Content List Only */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 md:px-8 w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-[760px] mx-auto py-2 pb-8 overscroll-contain no-scrollbar">
              <div className="flex items-center justify-between mb-4 mt-2">
                <h2
                  id="recent-chats-heading"
                  className="text-lg sm:text-xl font-extrabold text-[#A3B18A] font-heading tracking-tight"
                >
                  Recent
                </h2>
              </div>

              <div id="recent-chats-container" className="space-y-2.5">
                {recentSessions
                  .filter(
                    (s) =>
                      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (s.vehicle && s.vehicle.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleOpenRecentSession(session)}
                      className="w-full text-left p-3.5 sm:p-4 rounded-xl bg-[#131817] hover:bg-[#18201E] border border-[#212C29] transition-all group cursor-pointer relative"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 truncate pr-6">
                          <Car className="w-3.5 h-3.5 text-[#A3B18A] shrink-0" />
                          <h3 className="font-heading font-bold text-sm text-[#DDE3E3] group-hover:text-[#A3B18A] transition-colors truncate">
                            {session.title}
                          </h3>
                        </div>
                        <span className="text-[11px] text-[#5A6964] shrink-0 ml-2 font-mono">
                          {session.date}
                        </span>
                      </div>
                      <p className="text-xs text-[#8A9A78] line-clamp-1 pl-5">
                        {session.snippet}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSession(e, session.id)}
                        className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 p-1 text-[#5A6964] hover:text-red-400 transition-opacity"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                {recentSessions.filter(
                  (s) =>
                    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (s.vehicle && s.vehicle.toLowerCase().includes(searchQuery.toLowerCase()))
                ).length === 0 && (
                  <div className="py-12 text-center text-xs text-[#5A6964]">
                    {searchQuery ? 'No matching diagnostic sessions found.' : 'No recent diagnostic sessions yet.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md md:max-w-lg bg-[#121616] border border-[#26312E] rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-4 md:pb-5 border-b border-[#202927]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#A3B18A] text-[#0E1111] font-heading font-extrabold text-xs md:text-sm flex items-center justify-center shrink-0 select-none">
                  {initials}
                </div>
                <h3 className="font-heading font-extrabold text-base md:text-lg text-white">Technician Workshop</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="text-[#8A9A78] hover:text-white p-1.5 md:p-2 rounded-lg min-w-[36px] min-h-[36px] md:min-w-[44px] md:min-h-[44px] flex items-center justify-center"
                aria-label="Close settings"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="py-5 md:py-6 space-y-4 md:space-y-5 text-xs sm:text-sm">
              <div className="p-3.5 md:p-4 rounded-xl md:rounded-2xl bg-[#171D1B] border border-[#202927]">
                <div className="text-[11px] md:text-xs uppercase tracking-wider text-[#8A9A78] font-semibold mb-1">
                  Active Technician
                </div>
                <div className="font-heading font-bold text-white text-base md:text-lg">{displayName}</div>
                <div className="text-xs md:text-sm text-[#8F9999] mt-0.5">Senior Diagnostic Specialist</div>
              </div>

              <div className="p-3.5 md:p-4 rounded-xl md:rounded-2xl bg-[#171D1B] border border-[#202927] flex items-center justify-between">
                <div>
                  <div className="text-[11px] md:text-xs uppercase tracking-wider text-[#8A9A78] font-semibold mb-1">
                    Workshop Key
                  </div>
                  <div className="font-mono text-xs md:text-sm text-white tracking-wider">
                    {activeCode || 'CST-ACTIVE-WORKSHOP'}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs md:text-sm text-[#A3B18A] font-semibold bg-[#A3B18A]/10 px-3 py-1.5 rounded-full border border-[#A3B18A]/20">
                  <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span>Connected</span>
                </div>
              </div>

              {onViewLanding && (
                <button
                  type="button"
                  onClick={() => {
                    setShowSettingsModal(false);
                    onViewLanding();
                  }}
                  className="w-full py-2.5 md:py-3.5 rounded-xl md:rounded-2xl border border-[#2B3834] hover:border-white text-xs md:text-sm font-semibold text-white transition-colors min-h-[44px] md:min-h-[48px]"
                >
                  View Homepage
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowSettingsModal(false);
                  onSignOut();
                }}
                className="w-full py-2.5 md:py-3.5 rounded-xl md:rounded-2xl bg-red-950/40 border border-red-800/40 hover:bg-red-900/50 text-red-300 font-semibold text-xs md:text-sm flex items-center justify-center gap-2 transition-colors min-h-[44px] md:min-h-[48px]"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                <span>Disconnect & Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
