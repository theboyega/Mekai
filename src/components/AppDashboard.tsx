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
  Car,
  Check,
  Play,
  Pause,
  Copy,
  Share,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Edit3,
  Pin,
  HelpCircle,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { MekaiLogo, MekaiSpinner } from './MekaiLogo';

// Diagnostic agent endpoints
const MEKAI_CHAT_ENDPOINT = '/api/chat-webhook';
const MEKAI_DIRECT_WEBHOOK_URL =
  'https://mekai-ai.app.n8n.cloud/webhook/5b01dd02-7501-46e9-ba90-f890e6a1c2bf/chat';

interface AppDashboardProps {
  activeCode: string | null;
  technicianName?: string;
  onSignOut: () => void;
  onViewLanding?: () => void;
  initialPrompt?: string;
}

export type {
  ChatAttachment,
  ChatMessage,
  RecentChatSession,
  WebhookResult,
} from '../types/diagnostic';
import type {
  ChatAttachment,
  ChatMessage,
  RecentChatSession,
  WebhookResult,
} from '../types/diagnostic';

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

// Common conversational / diagnostic words that are never part of a vehicle model name
const NON_MODEL_STOPWORDS = new Set([
  'got', 'get', 'getting', 'has', 'have', 'had', 'having', 'is', 'was', 'are', 'were',
  'with', 'without', 'and', 'or', 'but', 'so', 'for', 'from', 'in', 'on', 'at', 'to',
  'by', 'of', 'the', 'a', 'an', 'this', 'that', 'these', 'those', 'my', 'our', 'your',
  'his', 'her', 'its', 'their', 'it', 'we', 'i', 'you', 'they', 'he', 'she', 'here',
  'there', 'where', 'when', 'why', 'how', 'what', 'which', 'who', 'since', 'because',
  'while', 'after', 'before', 'during', 'about', 'into', 'onto', 'over', 'under',
  'again', 'then', 'now', 'just', 'only', 'also', 'very', 'too', 'can', 'could',
  'would', 'should', 'will', 'shall', 'may', 'might', 'must', 'need', 'needs',
  'needed', 'want', 'wants', 'like', 'good', 'great', 'okay', 'ok', 'alright',
  'sure', 'thanks', 'thank', 'hello', 'hi', 'hey', 'mekai', 'session', 'logged',
  'logging', 'diagnostic', 'diagnostics', 'issue', 'issues', 'problem', 'problems',
  'error', 'code', 'codes', 'fault', 'faults', 'check', 'checking', 'engine',
  'transmission', 'brake', 'brakes', 'misfire', 'misfiring', 'noise', 'sound',
  'leaking', 'leak', 'starting', 'start', 'stalling', 'stall', 'shaking', 'rough',
  'idle', 'idling', 'car', 'truck', 'vehicle', 'suv', 'van', 'sedan', 'coupe',
  'workshop', 'bay', 'let', 'lets', "let's", 'looking', 'working', 'today'
]);

function filterModelTokens(rawModel: string): string {
  const tokens = rawModel.trim().split(/\s+/);
  const valid: string[] = [];
  for (const tk of tokens) {
    const cleaned = tk.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '');
    if (!cleaned) break;
    if (NON_MODEL_STOPWORDS.has(cleaned.toLowerCase())) break;
    valid.push(cleaned);
  }
  return valid.join(' ');
}

export function sanitizeSessionTitle(rawTitle: string): string {
  if (!rawTitle) return '';
  // If title contains markdown bold **...**, extract the bolded name directly
  const boldMatch = rawTitle.match(/\*\*([^*\n]+)\*\*/);
  const base = (boldMatch ? boldMatch[1] : rawTitle)
    .replace(/[*_`~]/g, '')
    .replace(/^["'\s]+|["'\s]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Strip trailing conversational stop-words (e.g., "Lexus RX 350 Got" -> "Lexus RX 350")
  const words = base.split(' ');
  while (words.length > 1 && NON_MODEL_STOPWORDS.has(words[words.length - 1].toLowerCase())) {
    words.pop();
  }
  return words.join(' ').trim();
}

// Pre-compiled regex patterns per vehicle make for fast zero-allocation vehicle extraction (horizontal whitespace only so it never crosses newlines)
const COMPILED_VEHICLE_PATTERNS = VEHICLE_MAKES.map((make) => ({
  cleanMake: cleanMakeName(make),
  yearLastRegex: new RegExp(
    `\\b${make}[ \\t]+([A-Za-z0-9\\-]+(?:[ \\t]+[A-Za-z0-9\\-]+){0,2})[ \\t]+(19\\d\\d|20\\d\\d)\\b`,
    'i'
  ),
  yearFirstRegex: new RegExp(
    `\\b(19\\d\\d|20\\d\\d)[ \\t]+${make}[ \\t]+([A-Za-z0-9\\-]+(?:[ \\t]+[A-Za-z0-9\\-]+){0,2})\\b`,
    'i'
  ),
  makeModelRegex: new RegExp(
    `\\b${make}[ \\t]+([A-Za-z0-9\\-]+(?:[ \\t]+[A-Za-z0-9\\-]+){0,1})\\b`,
    'i'
  ),
}));

const YEAR_REGEX = /\b(19\d\d|20\d\d)\b/;

// Extraction of vehicle details from conversation as fallback
export function extractVehicleDetails(
  userText: string,
  mekaiText: string,
  currentTitle?: string
): string | null {
  const combined = `${userText}\n${mekaiText}`;

  for (const { cleanMake, yearLastRegex, yearFirstRegex, makeModelRegex } of COMPILED_VEHICLE_PATTERNS) {
    // 1. [Make] [Model words] [Year] -> e.g., "Ford Explorer 2014"
    const m1 = combined.match(yearLastRegex);
    if (m1) {
      const model = filterModelTokens(m1[1]);
      const year = m1[2];
      if (model) return `${cleanMake} ${model} ${year}`;
    }

    // 2. [Year] [Make] [Model words] -> e.g., "2014 Ford Explorer" -> "Ford Explorer 2014"
    const m2 = combined.match(yearFirstRegex);
    if (m2) {
      const year = m2[1];
      const model = filterModelTokens(m2[2]);
      if (model) return `${cleanMake} ${model} ${year}`;
    }

    // 3. [Make] [Model words]
    const m3 = combined.match(makeModelRegex);
    if (m3) {
      const model = filterModelTokens(m3[1]);
      if (model) {
        const yearMatch = combined.match(YEAR_REGEX);
        if (yearMatch) {
          return `${cleanMake} ${model} ${yearMatch[1]}`;
        }
        return `${cleanMake} ${model}`;
      }
    }
  }

  if (currentTitle && !currentTitle.startsWith('Diagnostic') && !currentTitle.startsWith('New Diagnostic')) {
    return sanitizeSessionTitle(currentTitle);
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
    return sanitizeSessionTitle(webhookResult.title);
  }
  if (webhookResult?.vehicle && webhookResult.vehicle.trim()) {
    return sanitizeSessionTitle(webhookResult.vehicle);
  }

  // 2. Mekai's explicit logging pattern from its response (e.g. "logging this session as Lexus RX 350")
  const boldLoggingMatch = mekaiText.match(
    /(?:log(?:ging|ged)?(?:\s+(?:this|the))?(?:\s+session)?(?:\s+as)?|session(?:\s+logged|\s+name)?(?:\s+is|\s+as)?|naming(?:\s+(?:this|the))?\s+session(?:\s+as)?|tracking(?:\s+this)?(?:\s+session)?(?:\s+as)?)\s*:?\s*\*\*([^*\n]+)\*\*/i
  );
  if (boldLoggingMatch && boldLoggingMatch[1]) {
    const cleanBoldName = sanitizeSessionTitle(boldLoggingMatch[1]);
    if (cleanBoldName.length >= 2 && !cleanBoldName.toLowerCase().startsWith('a diagnostic')) {
      return cleanBoldName;
    }
  }

  const loggingPatterns = [
    /log(?:ging|ged)?\s+(?:this\s+|the\s+)?session(?:\s+as|\s*:)?\s+([^\n.,!?;:—–]+)/i,
    /log(?:ging|ged)?\s+(?:this\s+)?as\s+([^\n.,!?;:—–]+)/i,
    /session\s+logged(?:\s+as|\s*:)?\s+([^\n.,!?;:—–]+)/i,
    /session\s+name(?:\s+is|\s*:)?\s+([^\n.,!?;:—–]+)/i,
    /naming\s+(?:this\s+|the\s+)?session(?:\s+as|\s*:)?\s+([^\n.,!?;:—–]+)/i,
    /tracking\s+(?:this\s+)?(?:session\s+)?as\s+([^\n.,!?;:—–]+)/i,
  ];

  for (const pattern of loggingPatterns) {
    const match = mekaiText.match(pattern);
    if (match && match[1]) {
      const cleanName = sanitizeSessionTitle(match[1]);
      if (cleanName.length >= 2 && !cleanName.toLowerCase().startsWith('a diagnostic')) {
        return cleanName;
      }
    }
  }

  // 3. Retain previous established title once Mekai has already named the session
  if (currentTitle && !currentTitle.startsWith('Diagnostic') && !currentTitle.startsWith('New Diagnostic')) {
    return sanitizeSessionTitle(currentTitle);
  }

  // 4. Fallback vehicle extractor
  const detectedVehicle = extractVehicleDetails(userText, mekaiText, currentTitle);
  if (detectedVehicle) {
    return sanitizeSessionTitle(detectedVehicle);
  }

  // 5. Code or brief snippet
  const dtcMatch = userText.match(/\b([PBCU]\d{4})\b/i);
  if (dtcMatch) {
    return `${dtcMatch[1].toUpperCase()} Diagnostics`;
  }

  const trimmedUser = userText.trim();
  if (!trimmedUser) {
    return currentTitle || 'Acoustic Diagnostic';
  }
  return trimmedUser.length > 28 ? trimmedUser.substring(0, 28) + '...' : trimmedUser;
}

const UNTRAINED_MEDIA_FEATURE_MESSAGE =
  'This feature is not trained yet. You can refer to our status page to see which features are nominal for use.';

// Detects if the user uploaded, sent, or referenced an image, video, or audio file for analysis
function isMediaAnalysisRequest(prompt: string, attachment?: ChatAttachment): boolean {
  if (attachment) {
    return true;
  }

  const text = prompt.trim();
  if (!text) return false;

  // 1. Direct media file extensions referenced in the message
  if (/\b\S+\.(?:jpg|jpeg|png|webp|gif|heic|bmp|svg|mp4|mov|avi|mkv|webm|m4v|mp3|wav|m4a|ogg|flac|aac)\b/i.test(text)) {
    return true;
  }

  // 2. Action verbs paired with image, photo, video, audio file, or recording
  if (
    /\b(?:upload(?:ed|ing)?|attach(?:ed|ing)?|send(?:ing)?|sent|share(?:d|ing)?|here(?:'s|\s+is)|look\s+at|check(?:\s+out)?|analy[sz](?:e|ing)|inspect(?:ing)?|scan(?:ning)?|examine|see|watch|listen\s+to|review)\b[^.?!]{0,50}\b(?:image|photo|photograph|picture|pic|screenshot|snapshot|video|footage|clip|audio|recording|voice\s*note|sound\s*file|sound\s*clip|media\s*file)\b/i.test(
      text
    )
  ) {
    return true;
  }

  // 3. References to "this/the/my/attached/uploaded image/photo/video/audio/recording/file"
  if (
    /\b(?:this|the|my|an|attached|uploaded|recorded)\s+(?:image|photo|photograph|picture|pic|screenshot|snapshot|video|footage|video\s*clip|audio(?:\s*file|\s*clip|\s*recording|\s*sample)?|sound\s*(?:file|clip|recording|sample)|voice\s*(?:note|recording)|recording|media\s*file)\b/i.test(
      text
    )
  ) {
    return true;
  }

  // 4. Requests for image/video/audio file analysis or uploading media
  if (
    /\b(?:image|photo|picture|video|audio)\s+(?:analysis|inspection|diagnostics?|upload|file|clip|recording)\b/i.test(
      text
    )
  ) {
    return true;
  }

  return false;
}

// Real API call to the Mekai n8n webhook
async function callMekaiWebhook(
  prompt: string,
  sessionId: string,
  technicianName: string,
  activeCode: string | null,
  attachment?: ChatAttachment
): Promise<WebhookResult> {
  if (isMediaAnalysisRequest(prompt, attachment)) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return {
      text: UNTRAINED_MEDIA_FEATURE_MESSAGE,
    };
  }

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
    if (contentType.includes('text/html')) {
      throw new Error('Endpoint returned HTML instead of diagnostic JSON');
    }

    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (typeof data === 'string') {
        if (data.trim().startsWith('<!doctype html') || data.trim().startsWith('<html')) {
          throw new Error('Received HTML document instead of diagnostic JSON');
        }
        return { text: data };
      }
      if (Array.isArray(data)) {
        const first = data[0];
        if (typeof first === 'string') return { text: first };
        if (first && typeof first === 'object') {
          const msg = first.output || first.text || first.response || first.message;
          if (msg === 'Error in workflow') {
            throw new Error('The n8n diagnostic workflow reported an execution error.');
          }
          return {
            text: msg || JSON.stringify(first),
            vehicle: first.vehicle,
            title: first.title || first.sessionTitle,
          };
        }
        return { text: JSON.stringify(data) };
      }
      if (data && typeof data === 'object') {
        if (data.message === 'Error in workflow') {
          throw new Error('The n8n diagnostic workflow reported an execution error.');
        }
        const rawVal =
          data.output ??
          data.text ??
          data.response ??
          data.message ??
          data.result ??
          data.data;
        const textVal =
          typeof rawVal === 'string'
            ? rawVal
            : rawVal !== undefined && rawVal !== null
            ? JSON.stringify(rawVal)
            : '';
        if (!textVal) {
          throw new Error('Invalid diagnostic response format from workflow.');
        }
        if (
          textVal.trim().toLowerCase().startsWith('<!doctype html') ||
          textVal.trim().toLowerCase().startsWith('<html')
        ) {
          throw new Error('Received HTML document instead of diagnostic JSON');
        }
        return {
          text: textVal,
          vehicle: data.vehicle,
          title: data.title || data.sessionTitle || data.chatName,
        };
      }
    }
    const textResp = await res.text();
    if (
      !textResp.trim() ||
      textResp.trim().toLowerCase().startsWith('<!doctype html') ||
      textResp.trim().toLowerCase().startsWith('<html')
    ) {
      throw new Error('Received HTML document instead of diagnostic JSON');
    }
    return { text: textResp };
  };

  // Call the Mekai diagnostic webhook proxy endpoint first, then direct endpoint if proxy is unavailable.
  // Only return the daily limit message if Mekai genuinely cannot be reached.
  try {
    return await executeRequest(MEKAI_CHAT_ENDPOINT);
  } catch {
    try {
      return await executeRequest(MEKAI_DIRECT_WEBHOOK_URL);
    } catch {
      return {
        text: "You've reached your diagnostic limit for today. Your credits will automatically refresh tomorrow at 8:00 AM, and you'll be ready to dive back into your workshop sessions.",
      };
    }
  }
}

function normalizeUrlHref(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function getFriendlyLinkLabel(rawUrl: string, customLabel?: string): string {
  if (customLabel) {
    const cleanedLabel = customLabel.replace(/\*\*/g, '').replace(/`/g, '').trim();
    if (cleanedLabel && !/^(?:https?:\/\/|www\.)/i.test(cleanedLabel)) {
      return cleanedLabel;
    }
  }
  const href = normalizeUrlHref(rawUrl);
  try {
    const parsed = new URL(href);
    const host = parsed.hostname.replace(/^www\./i, '');
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be') {
      if (
        parsed.pathname.includes('/watch') ||
        host === 'youtu.be' ||
        parsed.pathname.includes('/shorts')
      ) {
        return 'Watch on YouTube';
      }
      return 'YouTube';
    }
    return host || 'Open Link';
  } catch {
    return 'Open Link';
  }
}

function renderClickableLink(rawUrl: string, key: string, customLabel?: string) {
  const href = normalizeUrlHref(rawUrl);
  const label = getFriendlyLinkLabel(rawUrl, customLabel);
  return (
    <a
      key={key}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1 text-[#D8E5C4] hover:text-[#ECF4DF] underline decoration-[#A3B18A]/60 hover:decoration-[#ECF4DF] underline-offset-[3px] font-medium transition-colors duration-150 break-words"
    >
      <span>{label}</span>
      <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-85 inline-block" />
    </a>
  );
}

const INLINE_TOKEN_REGEX =
  /\[([^\]]+)\]\s*\(((?:[Hh][Tt][Tt][Pp][Ss]?:\/\/|[Ww]{3}\.)(?:[^\s()]|\([^\s()]*\))+)\)|\(\s*((?:[Hh][Tt][Tt][Pp][Ss]?:\/\/|[Ww]{3}\.)(?:[^\s()]|\([^\s()]*\))+)\s*\)|<\s*((?:[Hh][Tt][Tt][Pp][Ss]?:\/\/|[Ww]{3}\.)[^\s<>]+)\s*>|((?:[Hh][Tt][Tt][Pp][Ss]?:\/\/|[Ww]{3}\.)(?:[^\s()]|\([^\s()]*\))+)|(`[^`]+`)|(\b[PCBU][0-3][0-9A-F]{3}\b)/g;

function parseInlineTokens(segment: string, keyPrefix: string) {
  if (!segment) return null;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex = 0;

  for (const match of segment.matchAll(INLINE_TOKEN_REGEX)) {
    const fullMatch = match[0];
    const startIdx = match.index ?? 0;

    if (startIdx > lastIndex) {
      nodes.push(segment.slice(lastIndex, startIdx));
    }

    const mdLabel = match[1];
    const mdUrl = match[2];
    const parenUrl = match[3];
    const angleUrl = match[4];
    const bareUrl = match[5];
    const inlineCode = match[6];
    const dtcCode = match[7];

    if (mdLabel && mdUrl) {
      nodes.push(renderClickableLink(mdUrl, `${keyPrefix}-mdlink-${matchIndex}`, mdLabel));
    } else if (parenUrl) {
      nodes.push(renderClickableLink(parenUrl, `${keyPrefix}-plink-${matchIndex}`));
    } else if (angleUrl) {
      nodes.push(renderClickableLink(angleUrl, `${keyPrefix}-alink-${matchIndex}`));
    } else if (bareUrl) {
      const trailingPunctMatch = bareUrl.match(/([.,;:!?]+)$/);
      const cleanUrl = trailingPunctMatch
        ? bareUrl.slice(0, -trailingPunctMatch[1].length)
        : bareUrl;
      nodes.push(renderClickableLink(cleanUrl, `${keyPrefix}-url-${matchIndex}`));
      if (trailingPunctMatch) {
        nodes.push(trailingPunctMatch[1]);
      }
    } else if (inlineCode) {
      nodes.push(
        <code
          key={`${keyPrefix}-code-${matchIndex}`}
          className="bg-[#151F1C] text-[#D0E0B8] border border-[#263731] px-1.5 py-0.5 rounded-md font-mono text-[13.5px] font-medium mx-0.5"
        >
          {inlineCode.slice(1, -1)}
        </code>
      );
    } else if (dtcCode) {
      nodes.push(
        <span
          key={`${keyPrefix}-dtc-${matchIndex}`}
          className="inline-flex items-center bg-[#151F1C] text-[#D4E3BC] border border-[#283A33] px-1.5 py-0.5 rounded-md font-mono text-[13.5px] font-semibold tracking-tight mx-0.5"
        >
          {dtcCode}
        </span>
      );
    }

    lastIndex = startIdx + fullMatch.length;
    matchIndex++;
  }

  if (lastIndex < segment.length) {
    nodes.push(segment.slice(lastIndex));
  }

  return nodes;
}

function parseFormattedText(line: string) {
  // Clean up trailing unclosed single asterisk while streaming so raw '*' doesn't flash mid-word
  let cleaned = line.replace(/(?<!\*)\*$/, '');

  // If line has an odd number of '**', append temporary closing '**' so partial markdown bold renders smoothly while typing
  const asterisksCount = (cleaned.match(/\*\*/g) || []).length;
  if (asterisksCount % 2 !== 0) {
    cleaned += '**';
  }

  // If line has an odd number of '`', append temporary closing '`' so partial inline code renders smoothly while typing
  const backtickCount = (cleaned.match(/`/g) || []).length;
  if (backtickCount % 2 !== 0) {
    cleaned += '`';
  }

  // Match either markdown links first (even if label has ** inside) or **bold** segments
  const parts = cleaned.split(
    /(\[[^\]]+\]\s*\((?:[Hh][Tt][Tt][Pp][Ss]?:\/\/|[Ww]{3}\.)(?:[^\s()]|\([^\s()]*\))+\)|\*\*.*?\*\*)/g
  );
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const inner = part.slice(2, -2);
      if (!inner) return null;
      return (
        <strong key={i} className="font-semibold text-[#D8E5C4] tracking-[0.004em]">
          {parseInlineTokens(inner, `b-${i}`)}
        </strong>
      );
    }
    return <span key={i}>{parseInlineTokens(part, `t-${i}`)}</span>;
  });
}

function renderStreamedLineContent(lineText: string, animateTrailing: boolean) {
  if (
    !animateTrailing ||
    lineText.length < 10 ||
    /\[[^\]]*\]\(|https?:\/\/|www\./i.test(lineText)
  ) {
    return parseFormattedText(lineText);
  }
  const splitMatch = lineText.match(/^(.*?\s)(\S+(?:\s+\S+){0,2}\s*)$/);
  if (!splitMatch) {
    return <span className="animate-mekai-stream-chunk">{parseFormattedText(lineText)}</span>;
  }
  const stablePart = splitMatch[1];
  const trailingChunk = splitMatch[2];
  return (
    <>
      {parseFormattedText(stablePart)}
      <span key={lineText.length} className="animate-mekai-stream-chunk">
        {parseFormattedText(trailingChunk)}
      </span>
    </>
  );
}

// Mekai response rendered in blended sage tones with fluid AI streaming animation
function renderMekaiText(text: string, isStreaming: boolean = false) {
  if (!text || !text.trim()) {
    return null;
  }

  const paragraphs = text.split(/\n\n+/);
  return (
    <div className="space-y-3.5">
      {paragraphs.map((p, pIdx) => {
        const lines = p.split('\n');
        const isLastParagraph = pIdx === paragraphs.length - 1;

        return (
          <div key={pIdx} className="space-y-2">
            {lines.map((line, lineIdx) => {
              const isLastLine = isLastParagraph && lineIdx === lines.length - 1;
              const animateTrailing = isStreaming && isLastLine;
              const trimmed = line.trim();

              if (!trimmed) {
                return <div key={lineIdx} className="h-1.5" />;
              }

              // Horizontal rule (--- or ***)
              if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
                return (
                  <div
                    key={lineIdx}
                    className="h-px w-full bg-gradient-to-r from-[#23312C] via-[#23312C]/50 to-transparent my-2.5"
                  />
                );
              }

              // Markdown headings (#, ##, ###, ####)
              if (/^#{1,4}\s+/.test(trimmed)) {
                const headingContent = trimmed.replace(/^#{1,4}\s+/, '').replace(/\*\*/g, '');
                return (
                  <h4
                    key={lineIdx}
                    className="font-heading font-semibold text-[#D8E5C4] text-[16px] sm:text-[16.5px] tracking-tight pt-1.5 pb-0.5 leading-snug animate-mekai-line"
                  >
                    {parseInlineTokens(headingContent, `h-${pIdx}-${lineIdx}`)}
                  </h4>
                );
              }

              // Blockquote (> ...)
              if (trimmed.startsWith('> ')) {
                const quoteContent = trimmed.replace(/^>\s*/, '');
                return (
                  <div
                    key={lineIdx}
                    className="border-l-2 border-[#A3B18A]/45 pl-3.5 py-0.5 text-[#9CB084] italic text-[15px] sm:text-[15.5px] leading-[1.72] animate-mekai-line"
                  >
                    {renderStreamedLineContent(quoteContent, animateTrailing)}
                  </div>
                );
              }

              // Bullet points (•, -, *)
              if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                const content = trimmed.replace(/^[•\-*]\s*/, '');
                return (
                  <div
                    key={lineIdx}
                    className="flex items-start gap-2.5 pl-1 sm:pl-1.5 text-[15.5px] sm:text-base leading-[1.72] animate-mekai-line"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A3B18A]/85 mt-[10px] shrink-0" />
                    <span className="flex-1 text-[#A3B18A]">
                      {renderStreamedLineContent(content, animateTrailing)}
                    </span>
                  </div>
                );
              }

              // Numbered diagnostic steps (1. , 2. , etc.)
              if (/^\d+\.\s/.test(trimmed)) {
                const num = trimmed.match(/^(\d+)\.\s/)?.[1];
                const content = trimmed.replace(/^\d+\.\s*/, '');
                return (
                  <div
                    key={lineIdx}
                    className="flex items-start gap-2.5 pl-0.5 sm:pl-1 text-[15.5px] sm:text-base leading-[1.72] animate-mekai-line"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#151F1C] border border-[#263731] text-[#C8D8B0] font-mono text-[11.5px] font-semibold flex items-center justify-center shrink-0 mt-[3.5px]">
                      {num}
                    </span>
                    <span className="flex-1 text-[#A3B18A]">
                      {renderStreamedLineContent(content, animateTrailing)}
                    </span>
                  </div>
                );
              }

              return (
                <p
                  key={lineIdx}
                  className="text-[#A3B18A] text-[15.5px] sm:text-base leading-[1.74] tracking-[0.004em] animate-mekai-line"
                >
                  {renderStreamedLineContent(line, animateTrailing)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
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
  const [displayedCount, setDisplayedCount] = useState(() => (isTyping ? 0 : text.length));
  const lastScrollRef = useRef<number>(0);
  const onDoneRef = useRef(onDoneTyping);
  const onScrollRef = useRef(onScrollRequested);

  useEffect(() => {
    onDoneRef.current = onDoneTyping;
    onScrollRef.current = onScrollRequested;
  }, [onDoneTyping, onScrollRequested]);

  useEffect(() => {
    if (!isTyping) {
      setDisplayedCount(text.length);
      return;
    }

    const totalLength = text.length;
    if (totalLength === 0) {
      setDisplayedCount(0);
      onDoneRef.current?.();
      return;
    }

    // Tokenize into natural words/whitespace while keeping full markdown links and parenthesized URLs atomic so streaming never flashes raw URLs
    const tokens =
      text.match(
        /\[[^\]]+\]\s*\((?:https?:\/\/|www\.)(?:[^\s()]|\([^\s()]*\))+\)\s*|\(\s*(?:https?:\/\/|www\.)(?:[^\s()]|\([^\s()]*\))+\s*\)\s*|\S+\s*|\n+/gi
      ) || [text];
    const cumulativeLengths: number[] = [];
    let acc = 0;
    for (const tk of tokens) {
      acc += tk.length;
      cumulativeLengths.push(acc);
    }

    // Stream multi-token chunks smoothly like an LLM token stream (no artificial typewriter pauses)
    const tokensPerTick = tokens.length > 240 ? 4 : tokens.length > 100 ? 3 : 2;
    let tokenIdx = Math.min(tokens.length - 1, tokensPerTick - 1);
    setDisplayedCount(cumulativeLengths[tokenIdx] || totalLength);

    let timerId: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const streamNextChunk = () => {
      if (cancelled) return;
      if (tokenIdx >= tokens.length - 1) {
        setDisplayedCount(totalLength);
        onScrollRef.current?.();
        onDoneRef.current?.();
        return;
      }

      timerId = setTimeout(() => {
        if (cancelled) return;
        tokenIdx = Math.min(tokens.length - 1, tokenIdx + tokensPerTick);
        const nextCount = cumulativeLengths[tokenIdx] ?? totalLength;
        setDisplayedCount(nextCount);

        const now = Date.now();
        if (now - lastScrollRef.current > 90 || nextCount >= totalLength) {
          lastScrollRef.current = now;
          onScrollRef.current?.();
        }

        streamNextChunk();
      }, 24);
    };

    streamNextChunk();

    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [text, isTyping]);

  const currentlyStreaming = isTyping && displayedCount < text.length;
  const visibleText = text ? text.slice(0, displayedCount) : '';

  return (
    <div
      onClick={() => {
        if (currentlyStreaming) {
          setDisplayedCount(text.length);
          onDoneRef.current?.();
          onScrollRef.current?.();
        }
      }}
      className={currentlyStreaming ? 'cursor-pointer select-text' : 'select-text'}
      title={currentlyStreaming ? 'Click to complete response immediately' : undefined}
    >
      {renderMekaiText(visibleText, currentlyStreaming)}
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'T';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function AudioMessagePlayer({
  url,
  duration,
  isProcessing = false,
}: {
  url?: string;
  duration?: string;
  isProcessing?: boolean;
}) {
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
    <div
      className={`${
        isProcessing ? 'mekai-user-bubble-animated' : 'bg-[#0E1312] border border-[#23312C]'
      } flex items-center justify-center gap-3 rounded-[26px] sm:rounded-[28px] px-4 py-3 shadow-lg min-w-[200px] sm:min-w-[240px] text-white`}
    >
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

      <div className="flex items-center justify-center gap-1 h-6">
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

      {duration && (
        <span className="text-[11px] text-[#8A9A78] font-mono leading-none shrink-0">
          {duration}
        </span>
      )}
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

  // Per-message action states (copy indicator, likes/dislikes, audio speech)
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, 'liked' | 'disliked'>>({});
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [moreOptionsMsg, setMoreOptionsMsg] = useState<ChatMessage | null>(null);

  // Long-press popover / action modal for user's messages
  const [userMsgPopover, setUserMsgPopover] = useState<{
    message: ChatMessage;
    x?: number;
    y?: number;
  } | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [editMessageText, setEditMessageText] = useState('');
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Session ... menu actions state (share, pin, rename, help, report a problem, delete)
  const [sessionMenuTarget, setSessionMenuTarget] = useState<RecentChatSession | null>(null);
  const [sessionToRename, setSessionToRename] = useState<RecentChatSession | null>(null);
  const [renameTitleInput, setRenameTitleInput] = useState('');
  const [sessionHelpTarget, setSessionHelpTarget] = useState<RecentChatSession | null>(null);
  const [sessionReportTarget, setSessionReportTarget] = useState<RecentChatSession | null>(null);
  const [reportIssueText, setReportIssueText] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Persistent user chat sessions from localStorage
  const [recentSessions, setRecentSessions] = useState<RecentChatSession[]>(() => {
    try {
      const stored = localStorage.getItem('mekai_diagnostic_sessions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map((s: RecentChatSession) => ({
            ...s,
            title: sanitizeSessionTitle(s.title) || s.title,
          }));
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Helper to sort sessions with pinned items first
  const sortedRecentSessions = [...recentSessions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Staged attachment for next chat query (file & audio)
  const [attachedMedia, setAttachedMedia] = useState<ChatAttachment | null>(null);

  // Audio recording & detection state & refs
  const [isRecording, setIsRecording] = useState(false);
  const [isDetectingAudio, setIsDetectingAudio] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioVolume, setAudioVolume] = useState(0); // 0 to 100 for visual wave

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const isRecordingRef = useRef(false);
  const basePromptRef = useRef('');
  const liveTranscriptRef = useRef('');
  const recordingDurationRef = useRef(0);
  const wasCancelledRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Hidden file input ref for direct file selection
  const fileInputRef = useRef<HTMLInputElement>(null);
  const promptTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [isInputMultiline, setIsInputMultiline] = useState(false);
  const multilineTriggerLengthRef = useRef<number>(0);

  // Auto-adjust chat bar textarea height and detect when text spans into another line
  useEffect(() => {
    const el = promptTextareaRef.current;
    if (!el) return;

    if (!promptInput) {
      el.style.height = 'auto';
      multilineTriggerLengthRef.current = 0;
      if (isInputMultiline) setIsInputMultiline(false);
      return;
    }

    el.style.height = 'auto';
    const scrollH = el.scrollHeight;
    const hasNewline = promptInput.includes('\n');

    if (!isInputMultiline) {
      if (hasNewline || scrollH > 38) {
        multilineTriggerLengthRef.current = promptInput.length;
        setIsInputMultiline(true);
      }
    } else {
      if (
        !hasNewline &&
        scrollH <= 38 &&
        promptInput.length < Math.max(1, multilineTriggerLengthRef.current - 2)
      ) {
        multilineTriggerLengthRef.current = 0;
        setIsInputMultiline(false);
      }
    }

    el.style.height = `${Math.min(scrollH, 168)}px`;
  }, [promptInput, isInputMultiline, isRecording]);

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
    } else if (file.type.startsWith('audio/')) {
      const audioUrl = URL.createObjectURL(file);
      setAttachedMedia({
        type: 'audio',
        name: file.name,
        url: audioUrl,
        size: formattedSize,
        file,
      });
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
    if (isRecording) {
      handleStopRecording();
      return;
    }
    if (isDetectingAudio) return;

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
      wasCancelledRef.current = false;
      basePromptRef.current = promptInput;
      liveTranscriptRef.current = '';
      recordingDurationRef.current = 0;
      setIsDetectingAudio(false);
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

      // 2. MediaRecorder for capturing audio blob
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

        mediaRecorder.start(200);
        mediaRecorderRef.current = mediaRecorder;
      } catch (recErr) {
        console.warn('MediaRecorder init fallback:', recErr);
      }

      // 3. Speech Recognition - captures spoken text in background while recording
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      let completedSegments = '';
      if (SpeechRec) {
        try {
          const rec = new SpeechRec();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'en-US';

          rec.onresult = (event: any) => {
            if (wasCancelledRef.current) return;
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
            const currentSessionText = (finalTranscript + interimTranscript).trim();
            const spokenNow = [completedSegments.trim(), currentSessionText]
              .filter(Boolean)
              .join(' ')
              .trim();
            if (spokenNow) {
              liveTranscriptRef.current = spokenNow;
            }
          };

          rec.onerror = (e: any) => {
            console.warn('Speech recognition status:', e.error);
          };

          rec.onend = () => {
            if (liveTranscriptRef.current.trim()) {
              completedSegments = liveTranscriptRef.current.trim();
            }
            if (isRecordingRef.current && !wasCancelledRef.current) {
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
        recordingDurationRef.current += 1;
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access warning:', err);
      setIsRecording(false);
      setIsDetectingAudio(false);
      isRecordingRef.current = false;
    }
  };

  const handleStopRecording = () => {
    if (!isRecordingRef.current) return;
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

    // Switch UI from recording to rolling Mekai nut icon ("Detecting audio...")
    setIsRecording(false);
    setAudioVolume(0);
    setIsDetectingAudio(true);

    const detectStartTime = Date.now();
    const MIN_DETECT_SPIN_MS = 1000;

    const finishAudioDetection = () => {
      let recordedBlob: Blob | null = null;
      const recorder = mediaRecorderRef.current;

      const completeClassification = () => {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }

        const elapsed = Date.now() - detectStartTime;
        const remainingSpin = Math.max(0, MIN_DETECT_SPIN_MS - elapsed);

        setTimeout(() => {
          if (wasCancelledRef.current) {
            setIsDetectingAudio(false);
            return;
          }

          const detectedSpeech = liveTranscriptRef.current.trim();

          if (detectedSpeech.length > 0) {
            // Speech detected -> render what was said in the chat bar ONLY
            const base = basePromptRef.current.trim();
            const combinedText = base ? `${base} ${detectedSpeech}` : detectedSpeech;
            setPromptInput(combinedText);
            setAttachedMedia(null);
          } else if (recordedBlob && recordedBlob.size > 200) {
            // Vehicle sound / non-speech audio -> allow sending the audio file to Mekai
            const audioUrl = URL.createObjectURL(recordedBlob);
            const durationSecs = Math.max(1, recordingDurationRef.current);
            setAttachedMedia({
              type: 'audio',
              name: `Acoustic-Diagnostic-${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.webm`,
              url: audioUrl,
              size: formatRecordingTime(durationSecs),
            });
          }

          setIsDetectingAudio(false);
        }, remainingSpin);
      };

      if (recorder && recorder.state !== 'inactive') {
        recorder.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const mimeType = recorder.mimeType || 'audio/webm';
            recordedBlob = new Blob(audioChunksRef.current, { type: mimeType });
          }
          completeClassification();
        };
        try {
          recorder.stop();
        } catch {
          completeClassification();
        }
      } else {
        if (audioChunksRef.current.length > 0) {
          recordedBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        }
        completeClassification();
      }
    };

    // First stop SpeechRecognition and let it flush any final spoken words (e.g. "Good morning") while mic stream is still open
    if (speechRecognitionRef.current) {
      const rec = speechRecognitionRef.current;
      speechRecognitionRef.current = null;
      let settled = false;
      const onSpeechFlushed = () => {
        if (settled) return;
        settled = true;
        finishAudioDetection();
      };
      const flushTimer = setTimeout(onSpeechFlushed, 850);
      rec.onend = () => {
        clearTimeout(flushTimer);
        setTimeout(onSpeechFlushed, 100);
      };
      try {
        rec.stop();
      } catch {
        clearTimeout(flushTimer);
        onSpeechFlushed();
      }
    } else {
      finishAudioDetection();
    }
  };

  const handleCancelRecording = () => {
    isRecordingRef.current = false;
    wasCancelledRef.current = true;
    liveTranscriptRef.current = '';
    recordingDurationRef.current = 0;
    setPromptInput(basePromptRef.current);
    setIsDetectingAudio(false);
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
  const handlePromptSubmit = async (
    promptOverride?: string,
    attachmentOverride?: ChatAttachment | null
  ) => {
    const currentAttachment =
      attachmentOverride !== undefined ? attachmentOverride : attachedMedia;
    const textToSubmit = (promptOverride !== undefined ? promptOverride : promptInput).trim();
    if ((!textToSubmit && !currentAttachment) || isAnalyzing) return;

    const isAudioAttachment = currentAttachment?.type === 'audio';
    const defaultText = currentAttachment
      ? currentAttachment.type === 'image'
        ? 'Diagnostic inspection photo attached for analysis.'
        : currentAttachment.type === 'audio'
        ? ''
        : `Diagnostic document attached (${currentAttachment.name}).`
      : '';

    // Sent audio files must never have text displayed underneath them
    const finalText = isAudioAttachment ? '' : textToSubmit || defaultText;

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
    } catch {
      const limitMessage =
        "You've reached your diagnostic limit for today. Your credits will automatically refresh tomorrow at 8:00 AM, and you'll be ready to dive back into your workshop sessions.";
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}-mek`,
        sender: 'mekai',
        text: limitMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isTyping: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
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

  const handleCopyMessage = async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsgId(msgId);
      setTimeout(() => setCopiedMsgId((prev) => (prev === msgId ? null : prev)), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedMsgId(msgId);
      setTimeout(() => setCopiedMsgId((prev) => (prev === msgId ? null : prev)), 2000);
    }
  };

  const handleShareMessage = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mekai Diagnostic Response',
          text: text,
        });
        return;
      } catch {
        // Fallback below if cancelled or unsupported
      }
    }
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mekai-diagnostic-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/\[([^\]]+)\]\s*\((?:https?:\/\/|www\.)(?:[^\s()]|\([^\s()]*\))+\)/gi, '$1')
      .replace(/\(\s*(?:https?:\/\/|www\.)(?:[^\s()]|\([^\s()]*\))+\s*\)/gi, '')
      .replace(/(?:https?:\/\/|www\.)\S+/gi, '')
      .replace(/[*_#`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);
    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleFeedback = (msgId: string, type: 'liked' | 'disliked') => {
    setFeedbackState((prev) => ({
      ...prev,
      [msgId]: prev[msgId] === type ? (undefined as any) : type,
    }));
  };

  const handleStartLongPress = (
    e: React.TouchEvent | React.MouseEvent,
    msg: ChatMessage
  ) => {
    if (msg.sender !== 'engineer') return;
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      setUserMsgPopover({
        message: msg,
        x: clientX,
        y: clientY,
      });
      if ('vibrate' in navigator) {
        navigator.vibrate(40);
      }
    }, 450);
  };

  const handleEndLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleSaveEditedMessage = async () => {
    if (!editingMessage || !editMessageText.trim() || isAnalyzing) {
      setEditingMessage(null);
      return;
    }

    const targetMessage = editingMessage;
    const newText = editMessageText.trim();
    const activeSessionId = currentSessionId;

    // Locate the edited message index
    const editIndex = messages.findIndex((m) => m.id === targetMessage.id);
    if (editIndex === -1) {
      setEditingMessage(null);
      setEditMessageText('');
      return;
    }

    // Dismiss the edit modal immediately
    setEditingMessage(null);
    setEditMessageText('');

    const updatedUserMsg: ChatMessage = {
      ...targetMessage,
      text: newText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Keep all messages before the edited message, plus the edited message itself.
    // The former old response (and any subsequent messages from that point onward) is removed.
    const newMessages: ChatMessage[] = [
      ...messages.slice(0, editIndex).map((m) => ({ ...m, isTyping: false })),
      updatedUserMsg,
    ];

    setMessages(newMessages);
    setIsAnalyzing(true);

    // Sync session list with the updated user message state immediately
    setRecentSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              snippet: newText.substring(0, 70) + (newText.length > 70 ? '...' : ''),
              messages: newMessages,
              updatedAt: Date.now(),
            }
          : s
      )
    );

    try {
      const webhookResult = await callMekaiWebhook(
        newText,
        activeSessionId,
        displayName,
        activeCode,
        targetMessage.attachment
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

      // Re-evaluate session naming based on the fresh Mekai response
      const sessionNameFromMekai = extractMekaiSessionName(
        webhookResult.text,
        newText,
        webhookResult,
        currentSessionTitle
      );

      setCurrentSessionTitle(sessionNameFromMekai);

      const storedMessages = finalMessages.map((m) =>
        m.id === mekaiMsg.id ? { ...m, isTyping: false } : m
      );

      setRecentSessions((prev) => {
        const filtered = prev.filter((s) => s.id !== activeSessionId);
        return [
          {
            id: activeSessionId,
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
      console.error('Error re-analyzing edited message with Mekai:', err);
      const limitMessage =
        "You've reached your diagnostic limit for today. Your credits will automatically refresh tomorrow at 8:00 AM, and you'll be ready to dive back into your workshop sessions.";
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}-mek`,
        sender: 'mekai',
        text: limitMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isTyping: true,
      };
      setMessages([...newMessages, fallbackMsg]);
      setIsAnalyzing(false);
    }
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setRecentSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      resetDiagnosticsSession();
    }
  };

  const handleShareSession = async (session: RecentChatSession) => {
    const transcript = session.messages
      .map((m) => `[${m.sender === 'engineer' ? 'Technician' : 'Mekai AI'}] ${m.timestamp}\n${m.text}\n`)
      .join('\n---\n\n');
    const header = `MEKAI DIAGNOSTIC SESSION: ${session.title}\nDate: ${session.date}\n\n`;
    const fullContent = header + transcript;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mekai Chat: ${session.title}`,
          text: fullContent,
        });
        setSessionMenuTarget(null);
        return;
      } catch {
        // Fallback to file download
      }
    }

    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mekai-${session.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setSessionMenuTarget(null);
  };

  const handleTogglePinSession = (sessionId: string) => {
    setRecentSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, isPinned: !s.isPinned } : s))
    );
    setSessionMenuTarget(null);
  };

  const handleStartRenameSession = (session: RecentChatSession) => {
    setSessionToRename(session);
    setRenameTitleInput(session.title);
    setSessionMenuTarget(null);
  };

  const handleSaveRenamedSession = () => {
    if (!sessionToRename || !renameTitleInput.trim()) {
      setSessionToRename(null);
      return;
    }
    const newTitle = renameTitleInput.trim();
    setRecentSessions((prev) =>
      prev.map((s) => (s.id === sessionToRename.id ? { ...s, title: newTitle } : s))
    );
    if (currentSessionId === sessionToRename.id) {
      setCurrentSessionTitle(newTitle);
    }
    setSessionToRename(null);
    setRenameTitleInput('');
  };

  const handleStartHelpSession = (session: RecentChatSession) => {
    setSessionHelpTarget(session);
    setSessionMenuTarget(null);
  };

  const handleStartReportProblem = (session: RecentChatSession) => {
    setSessionReportTarget(session);
    setReportIssueText('');
    setReportSubmitted(false);
    setSessionMenuTarget(null);
  };

  const renderDiagnosticInputBar = () => (
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
          className={`w-full rounded-[26px] sm:rounded-[28px] md:rounded-[30px] border border-[#23312C] bg-[#0E1312] hover:border-[#354841] focus-within:border-[#A3B18A] min-h-[52px] sm:min-h-[56px] md:min-h-[60px] transition-all shadow-lg ${
            !isRecording && isInputMultiline
              ? 'flex flex-wrap items-center justify-between px-4 sm:px-5 md:px-6 pt-3 pb-2.5 gap-y-2'
              : 'flex items-center gap-3 sm:gap-4 md:gap-5 pl-4 sm:pl-6 md:pl-7 pr-2.5 sm:pr-3 md:pr-3.5 py-2 sm:py-2.5'
          }`}
        >
          {/* Left Plus Icon to directly send file (moves to bottom-left below text when multiline) */}
          <button
            id="send-file-btn"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-1 focus:outline-none shrink-0 text-[#8A9A78] hover:text-white transition-colors w-8 h-8 md:w-9 md:h-9 flex items-center justify-center ${
              !isRecording && isInputMultiline ? 'order-2' : 'order-1'
            }`}
            title="Send file"
            aria-label="Send file"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6 stroke-[2]" />
          </button>

          {isRecording ? (
            <div className="order-2 flex-1 flex items-center justify-between min-w-0 py-0.5 gap-2 sm:gap-3">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {/* Pulsing recording indicator */}
                <div className="relative flex items-center justify-center shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping absolute" />
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 relative" />
                </div>

                {/* Dynamic Sound Equalizer Waves responding to audio volume */}
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

                <span className="text-xs sm:text-sm md:text-base text-[#A3B18A] font-medium truncate">
                  Recording audio...
                </span>

                {/* Recording Duration */}
                <span className="text-[#A3B18A] font-mono text-xs sm:text-sm shrink-0 ml-auto pr-1">
                  {formatRecordingTime(recordingDuration)}
                </span>
              </div>

              {/* Action Buttons: Cancel (Trash) & Stop Icon (Square) */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCancelRecording}
                  className="p-1 text-[#8A9A78] hover:text-red-400 transition-colors w-8 h-8 md:w-9 md:h-9 flex items-center justify-center"
                  title="Cancel recording"
                  aria-label="Cancel recording"
                >
                  <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  id="stop-recording-btn"
                  type="button"
                  onClick={handleStopRecording}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 active:scale-90 flex items-center justify-center transition-all shadow-sm shrink-0 cursor-pointer"
                  title="Stop recording"
                  aria-label="Stop recording"
                >
                  <Square className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Auto-Expanding Prompt Textarea (moves up above the icons when multiline) */}
              <textarea
                ref={promptTextareaRef}
                id="diagnostic-prompt-input"
                rows={1}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handlePromptSubmit();
                  }
                }}
                placeholder="Ask Mekai (e.g. Ford Explorer 2014)"
                autoComplete="off"
                spellCheck="false"
                className={`bg-transparent text-[#A3B18A] caret-[#A3B18A] placeholder-[#5A6964] text-base md:text-lg leading-relaxed focus:outline-none focus:ring-0 font-sans min-w-0 resize-none max-h-[168px] overflow-y-auto no-scrollbar ${
                  isInputMultiline
                    ? 'order-1 w-full basis-full px-1 py-0.5'
                    : 'order-2 flex-1 py-1 self-center'
                }`}
              />

              {/* Right Controls: Microphone & Submit Arrow (moves to bottom-right below text when multiline) */}
              <div className="order-3 flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
                <button
                  type="button"
                  onClick={handleStartRecording}
                  disabled={isDetectingAudio}
                  className="text-[#8A9A78] hover:text-[#A3B18A] disabled:opacity-40 transition-colors p-1 focus:outline-none w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center"
                  title="Record audio"
                  aria-label="Record audio"
                >
                  <Mic className="w-5 h-5 md:w-6 md:h-6 stroke-[2]" />
                </button>

                <button
                  id="submit-diagnostic-prompt-btn"
                  type="submit"
                  disabled={(!promptInput.trim() && !attachedMedia) || isAnalyzing || isDetectingAudio}
                  className={`w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-90 ${
                    isAnalyzing || isDetectingAudio ? 'disabled:opacity-100' : 'disabled:opacity-40'
                  } disabled:hover:bg-[#A3B18A] text-[#0E1111] flex items-center justify-center transition-all shadow-sm shrink-0`}
                  title={
                    isDetectingAudio
                      ? 'Detecting audio...'
                      : isAnalyzing
                      ? 'Mekai is analyzing...'
                      : 'Send prompt'
                  }
                >
                  {isAnalyzing || isDetectingAudio ? (
                    <MekaiSpinner size={18} color="#0E1111" />
                  ) : (
                    <ArrowUp className="w-4 h-4 md:w-5 md:h-5 stroke-[2.8]" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </form>
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
          <header className="sticky top-0 z-10 w-full p-4 sm:p-5 md:px-8 bg-[#0E1111] shrink-0">
            <div className="flex items-center justify-between w-full h-10 md:h-12">
              {/* Left Group: Logo and Hamburger toggle pinned together on the far left */}
              <div className="flex items-center gap-3.5 h-10 md:h-12 shrink-0">
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-10 h-10 md:w-12 md:h-12 min-h-[40px] md:min-h-[48px] rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 flex items-center justify-center shrink-0 transition-transform shadow-md focus:outline-none cursor-pointer text-[#0E1111]"
                  aria-label="Toggle navigation drawer"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <line x1="4.5" y1="7.5" x2="19.5" y2="7.5" />
                    <line x1="4.5" y1="16.5" x2="19.5" y2="16.5" />
                  </svg>
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
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <line x1="4.5" y1="12" x2="19.5" y2="12" transform="rotate(45 12 12)" />
                    <line x1="4.5" y1="12" x2="19.5" y2="12" transform="rotate(-45 12 12)" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Scrollable Drawer Content (Nav items and Recents) */}
          <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 sm:px-6 md:px-8 md:py-6 overscroll-contain no-scrollbar w-full mx-auto">
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
                  {sortedRecentSessions.length > 0 ? (
                    sortedRecentSessions.slice(0, 7).map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between group rounded-lg hover:bg-[#151D1B] pr-1.5 min-h-[40px] md:min-h-[46px]"
                      >
                        <button
                          type="button"
                          onClick={() => handleOpenRecentSession(session)}
                          className={`flex-1 text-left px-3 py-2 md:py-2.5 text-sm md:text-base truncate transition-colors flex items-center gap-2 ${
                            currentSessionId === session.id
                              ? 'text-[#A3B18A] font-bold bg-[#161F1C] rounded'
                              : 'text-[#8A9A78] hover:text-[#A3B18A]'
                          }`}
                        >
                          {session.isPinned && (
                            <Pin className="w-3.5 h-3.5 text-[#A3B18A] shrink-0 fill-[#A3B18A]/30 rotate-45" />
                          )}
                          <span className="truncate">{session.title}</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSessionMenuTarget(session);
                          }}
                          className="p-1.5 text-[#8A9A78] hover:text-[#A3B18A] hover:bg-[#192220] rounded-lg transition-colors cursor-pointer"
                          title="Chat session options"
                          aria-label="Chat session options"
                        >
                          <MoreHorizontal className="w-4 h-4 md:w-5 md:h-5" />
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
          <div className="w-full bg-[#0E1111] shrink-0">
            <div className="w-full mx-auto px-5 py-4 sm:px-6 md:px-8 md:py-6 flex items-center justify-between">
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#A3B18A] text-[#0E1111] font-heading font-extrabold text-sm md:text-base flex items-center justify-center shrink-0 select-none shadow-sm leading-none"
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
                className="w-8 h-8 flex items-center justify-center text-[#8A9A78] hover:text-[#A3B18A] rounded-lg hover:bg-[#151B1A] transition-colors cursor-pointer focus:outline-none"
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
                  <path d="M9 5v14" />
                  <path d="m16 10-2 2 2 2" />
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
                sortedRecentSessions.length > 0 ? (
                  <div className="space-y-1 max-h-60 overflow-y-auto pr-1 animate-fadeIn no-scrollbar">
                    {sortedRecentSessions.slice(0, 7).map((session) => (
                      <div
                        key={session.id}
                        className="group flex items-center justify-between rounded-lg hover:bg-[#151D1B] pr-1"
                      >
                        <button
                          type="button"
                          onClick={() => handleOpenRecentSession(session)}
                          className={`flex-1 text-left px-2 py-1.5 text-xs truncate transition-colors flex items-center gap-1.5 ${
                            currentSessionId === session.id
                              ? 'text-[#A3B18A] font-semibold bg-[#161F1C] rounded'
                              : 'text-[#8A9A78] hover:text-[#A3B18A]'
                          }`}
                          title={session.title}
                        >
                          {session.isPinned && (
                            <Pin className="w-3 h-3 text-[#A3B18A] shrink-0 fill-[#A3B18A]/30 rotate-45" />
                          )}
                          <span className="truncate">{session.title}</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSessionMenuTarget(session);
                          }}
                          className="opacity-70 group-hover:opacity-100 p-1 text-[#8A9A78] hover:text-[#A3B18A] hover:bg-[#192220] rounded transition-all cursor-pointer"
                          title="Chat session options"
                          aria-label="Chat session options"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
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

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-9 h-9 rounded-full bg-[#A3B18A] text-[#0E1111] font-heading font-extrabold text-sm flex items-center justify-center shrink-0 select-none tracking-tight shadow-sm leading-none"
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
                className="cursor-pointer group w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#151B1A] text-[#8A9A78] hover:text-[#A3B18A] transition-colors focus:outline-none"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <span className="flex items-center justify-center group-hover:hidden">
                  <MekaiLogo iconSize={32} showText={false} />
                </span>
                <span className="hidden group-hover:flex items-center justify-center">
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
                    <path d="M9 5v14" />
                    <path d="m14 10 2 2-2 2" />
                  </svg>
                </span>
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

          <div className="p-6 flex flex-col items-center gap-4">
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
              className="w-9 h-9 rounded-full bg-[#A3B18A] text-[#0E1111] font-heading font-extrabold text-sm flex items-center justify-center shrink-0 hover:ring-2 hover:ring-[#A3B18A]/50 transition-all select-none tracking-tight shadow-sm leading-none"
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
        <header className="w-full p-4 sm:p-5 md:px-8 lg:px-10 z-10 shrink-0">
          <div className="flex lg:hidden items-center justify-between w-full h-10 md:h-12">
            {/* Left Group: Logo and Hamburger toggle pinned together on the far left */}
            <div className="flex items-center gap-3.5 h-10 md:h-12 shrink-0">
              <button
                id="mobile-drawer-toggle-btn"
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="w-10 h-10 md:w-12 md:h-12 min-h-[40px] md:min-h-[48px] rounded-full bg-[#A3B18A] hover:bg-[#92A177] active:scale-95 flex items-center justify-center shrink-0 transition-transform shadow-md focus:outline-none cursor-pointer text-[#0E1111]"
                aria-label="Open navigation drawer"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="4.5" y1="7.5" x2="19.5" y2="7.5" />
                  <line x1="4.5" y1="16.5" x2="19.5" y2="16.5" />
                </svg>
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
                className="w-10 h-10 md:w-12 md:h-12 min-h-[40px] md:min-h-[48px] rounded-full bg-[#A3B18A] text-[#0E1111] font-heading font-extrabold text-sm md:text-base flex items-center justify-center shrink-0 shadow-md active:scale-95 transition-transform focus:outline-none cursor-pointer leading-none"
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
            <div className="flex-1 min-h-0 flex flex-col justify-between md:justify-center items-center px-4 sm:px-6 md:px-8 w-full max-w-[480px] sm:max-w-[540px] md:max-w-[620px] lg:max-w-[700px] mx-auto pb-4 sm:pb-8 md:pb-0 md:-mt-8 overflow-hidden">
              <div className="my-auto md:my-0 text-center w-full">
                <h1
                  id="diagnostics-prompt-heading"
                  className="text-base sm:text-lg md:text-xl lg:text-[22px] xl:text-2xl font-extrabold text-[#A3B18A] font-heading tracking-tight text-center leading-snug select-none md:mb-8 whitespace-nowrap mx-auto"
                >
                  {WORKSHOP_GREETINGS[greetingIndex](firstName)}
                </h1>
              </div>

              <div className="w-full shrink-0">
                {renderDiagnosticInputBar()}
              </div>
            </div>
          ) : (
            /* Active Chat with Fixed-Height Container & Pinned Input Bar */
            <div className="flex-1 min-h-0 flex flex-col h-full w-full overflow-hidden">
              {/* Internal scrolling message history area */}
              <div
                id="diagnostic-chat-messages"
                className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 md:px-8 w-full max-w-[480px] sm:max-w-[540px] md:max-w-[620px] lg:max-w-[700px] mx-auto py-4 md:py-6 space-y-5 md:space-y-6 overscroll-contain no-scrollbar"
              >
                {messages.map((msg, msgIdx) => {
                  const isImage = msg.attachment?.type === 'image';
                  const isAudio = msg.attachment?.type === 'audio';
                  const isFile = msg.attachment?.type === 'file';
                  const isDefaultImageText = msg.text === 'Diagnostic inspection photo attached for analysis.';
                  const isDefaultAudioText = msg.text.startsWith('Acoustic audio sample recorded');
                  const isDefaultDocText = msg.text.startsWith('Diagnostic document attached');
                  const hasCustomCaption = msg.text && !isDefaultImageText && !isDefaultAudioText && !isDefaultDocText;
                  const nextMsg = messages[msgIdx + 1];
                  const isActivelyProcessing =
                    msg.sender === 'engineer' &&
                    ((isAnalyzing && msgIdx === messages.length - 1) ||
                      Boolean(nextMsg?.sender === 'mekai' && nextMsg?.isTyping));
                  const bubbleSurfaceClass = isActivelyProcessing
                    ? 'mekai-user-bubble-animated'
                    : 'bg-[#0E1312] border border-[#23312C]';
                  const userBubbleClass = `${bubbleSurfaceClass} text-[#A3B18A] text-base font-normal leading-relaxed px-5 py-3 rounded-[26px] sm:rounded-[28px] md:rounded-[30px] shadow-lg break-words`;

                  return (
                    <div
                      key={msg.id}
                      className={`w-full flex ${
                        msg.sender === 'engineer' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.sender === 'engineer' ? (
                        isImage && msg.attachment?.url ? (
                          <div
                            className="flex flex-col items-end gap-2 max-w-[85%] cursor-pointer select-none"
                            onTouchStart={(e) => handleStartLongPress(e, msg)}
                            onTouchEnd={handleEndLongPress}
                            onTouchCancel={handleEndLongPress}
                            onMouseDown={(e) => handleStartLongPress(e, msg)}
                            onMouseUp={handleEndLongPress}
                            onMouseLeave={handleEndLongPress}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setUserMsgPopover({
                                message: msg,
                                x: e.clientX,
                                y: e.clientY,
                              });
                            }}
                          >
                            <div
                              className={`overflow-hidden rounded-2xl shadow-lg ${
                                isActivelyProcessing && !hasCustomCaption
                                  ? 'mekai-user-bubble-animated'
                                  : 'border border-[#23312C] bg-[#0E1312]'
                              }`}
                            >
                              <img
                                src={msg.attachment.url}
                                alt={msg.attachment.name || 'Inspection image'}
                                className="max-h-72 w-auto max-w-full rounded-2xl object-cover"
                              />
                            </div>
                            {hasCustomCaption && (
                              <div className={userBubbleClass}>
                                <span>{msg.text}</span>
                              </div>
                            )}
                          </div>
                        ) : isAudio ? (
                          <div
                            className="flex flex-col items-end max-w-[85%] cursor-pointer select-none"
                            onTouchStart={(e) => handleStartLongPress(e, msg)}
                            onTouchEnd={handleEndLongPress}
                            onTouchCancel={handleEndLongPress}
                            onMouseDown={(e) => handleStartLongPress(e, msg)}
                            onMouseUp={handleEndLongPress}
                            onMouseLeave={handleEndLongPress}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setUserMsgPopover({
                                message: msg,
                                x: e.clientX,
                                y: e.clientY,
                              });
                            }}
                          >
                            <AudioMessagePlayer
                              url={msg.attachment?.url}
                              duration={msg.attachment?.size}
                              isProcessing={isActivelyProcessing}
                            />
                          </div>
                        ) : isFile ? (
                          <div
                            className="flex flex-col items-end gap-2 max-w-[85%] cursor-pointer select-none"
                            onTouchStart={(e) => handleStartLongPress(e, msg)}
                            onTouchEnd={handleEndLongPress}
                            onTouchCancel={handleEndLongPress}
                            onMouseDown={(e) => handleStartLongPress(e, msg)}
                            onMouseUp={handleEndLongPress}
                            onMouseLeave={handleEndLongPress}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setUserMsgPopover({
                                message: msg,
                                x: e.clientX,
                                y: e.clientY,
                              });
                            }}
                          >
                            <div className={`${bubbleSurfaceClass} flex items-center gap-2.5 px-4 py-2.5 rounded-[26px] text-xs font-mono text-[#A3B18A] shadow-lg`}>
                              <FileText className="w-4 h-4 text-[#A3B18A] shrink-0" />
                              <span className="truncate max-w-[200px] text-white font-medium">
                                {msg.attachment?.name}
                              </span>
                              {msg.attachment?.size && (
                                <span className="text-[#8A9A78]">({msg.attachment.size})</span>
                              )}
                            </div>
                            {hasCustomCaption && (
                              <div className={userBubbleClass}>
                                <span>{msg.text}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className={`${userBubbleClass} max-w-[85%] inline-block cursor-pointer select-none active:scale-[0.98] transition-transform`}
                            onTouchStart={(e) => handleStartLongPress(e, msg)}
                            onTouchEnd={handleEndLongPress}
                            onTouchCancel={handleEndLongPress}
                            onMouseDown={(e) => handleStartLongPress(e, msg)}
                            onMouseUp={handleEndLongPress}
                            onMouseLeave={handleEndLongPress}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setUserMsgPopover({
                                message: msg,
                                x: e.clientX,
                                y: e.clientY,
                              });
                            }}
                            title="Long-press or right-click to copy or edit"
                          >
                            <span>{msg.text}</span>
                          </div>
                        )
                      ) : (
                      /* Mekai response strictly in sage green (#A3B18A) with action toolbar */
                      <div className="max-w-[95%] text-base leading-normal space-y-2.5 bg-transparent border-0 p-0 shadow-none text-[#A3B18A]">
                        <div className="flex-1 text-[#A3B18A]">
                          <MekaiResponseView
                            text={
                              msg.isError
                                ? "You've reached your diagnostic limit for today. Your credits will automatically refresh tomorrow at 8:00 AM, and you'll be ready to dive back into your workshop sessions."
                                : msg.text
                            }
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

                              {/* Response action icon bar: copy, export/share, speak, like, dislike, more (...) */}
                              {!msg.isTyping && (
                                <div className="flex items-center gap-4 sm:gap-5 pt-2 select-none text-[#8A9A78] animate-fadeIn">
                                  {/* Copy */}
                                  <button
                                    type="button"
                                    onClick={() => handleCopyMessage(msg.id, msg.text)}
                                    className="p-1 hover:text-[#A3B18A] transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
                                    title={copiedMsgId === msg.id ? 'Copied to clipboard' : 'Copy response'}
                                    aria-label="Copy response"
                                  >
                                    {copiedMsgId === msg.id ? (
                                      <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#A3B18A] stroke-[2.2]" />
                                    ) : (
                                      <Copy className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.8]" />
                                    )}
                                  </button>

                                  {/* Export / Share */}
                                  <button
                                    type="button"
                                    onClick={() => handleShareMessage(msg.text)}
                                    className="p-1 hover:text-[#A3B18A] transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
                                    title="Export or share response"
                                    aria-label="Export or share response"
                                  >
                                    <Share className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.8]" />
                                  </button>

                                  {/* Read aloud / Speak */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleSpeak(msg.id, msg.text)}
                                    className={`p-1 transition-colors focus:outline-none flex items-center justify-center cursor-pointer ${
                                      speakingMsgId === msg.id ? 'text-[#A3B18A]' : 'hover:text-[#A3B18A]'
                                    }`}
                                    title={speakingMsgId === msg.id ? 'Stop reading' : 'Read response aloud'}
                                    aria-label="Read response aloud"
                                  >
                                    <Volume2 className={`w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.8] ${speakingMsgId === msg.id ? 'animate-pulse' : ''}`} />
                                  </button>

                                  {/* Like */}
                                  <button
                                    type="button"
                                    onClick={() => handleFeedback(msg.id, 'liked')}
                                    className={`p-1 transition-colors focus:outline-none flex items-center justify-center cursor-pointer ${
                                      feedbackState[msg.id] === 'liked' ? 'text-[#A3B18A]' : 'hover:text-[#A3B18A]'
                                    }`}
                                    title="Helpful response"
                                    aria-label="Good response"
                                  >
                                    <ThumbsUp
                                      className={`w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.8] ${
                                        feedbackState[msg.id] === 'liked' ? 'fill-[#A3B18A]/30' : ''
                                      }`}
                                    />
                                  </button>

                                  {/* Dislike */}
                                  <button
                                    type="button"
                                    onClick={() => handleFeedback(msg.id, 'disliked')}
                                    className={`p-1 transition-colors focus:outline-none flex items-center justify-center cursor-pointer ${
                                      feedbackState[msg.id] === 'disliked' ? 'text-[#A3B18A]' : 'hover:text-[#A3B18A]'
                                    }`}
                                    title="Needs improvement"
                                    aria-label="Poor response"
                                  >
                                    <ThumbsDown
                                      className={`w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.8] ${
                                        feedbackState[msg.id] === 'disliked' ? 'fill-[#A3B18A]/30' : ''
                                      }`}
                                    />
                                  </button>

                                  {/* More options (...) */}
                                  <button
                                    type="button"
                                    onClick={() => setMoreOptionsMsg(msg)}
                                    className="p-1 hover:text-[#A3B18A] transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
                                    title="More options"
                                    aria-label="More options"
                                  >
                                    <MoreHorizontal className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.8]" />
                                  </button>
                                </div>
                              )}

                              {/* Mekai AI Disclaimer directly under response and action bar */}
                              {!msg.isTyping && (
                                <p className="text-xs sm:text-[13px] text-[#707D7A] font-normal select-none pt-2 sm:pt-2.5">
                                  Mekai is AI and can make mistakes.
                                </p>
                              )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

                {isAnalyzing && (
                  <div className="w-full flex justify-start">
                    <div className="inline-flex items-center py-2 px-1">
                      <MekaiSpinner size={24} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Pinned Bottom Input Bar Container */}
              <div className="w-full max-w-[480px] sm:max-w-[540px] md:max-w-[620px] lg:max-w-[700px] mx-auto px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 pt-2 shrink-0 bg-[#0E1111] z-10">
                {renderDiagnosticInputBar()}
              </div>
            </div>
          )
        ) : (
          /* Search Chats View - Fixed viewport container with pinned search field & internal scrolling list only */
          <div className="flex-1 min-h-0 flex flex-col h-full w-full overflow-hidden">
            {/* Pinned Search Field Container at Top */}
            <div className="w-full max-w-[480px] sm:max-w-[540px] md:max-w-[620px] lg:max-w-[700px] mx-auto px-4 sm:px-6 md:px-8 pt-3 sm:pt-6 pb-2 shrink-0 bg-[#0E1111] z-10">
              <div
                id="search-chats-pill"
                className="w-full rounded-full border border-[#23312C] bg-[#0E1312] hover:border-[#354841] focus-within:border-[#A3B18A] px-4 sm:px-6 md:px-7 h-[52px] sm:h-[56px] md:h-[60px] flex items-center gap-3 md:gap-4 transition-all shadow-lg mx-auto"
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
            <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 md:px-8 w-full max-w-[480px] sm:max-w-[540px] md:max-w-[620px] lg:max-w-[700px] mx-auto py-2 pb-8 overscroll-contain no-scrollbar">
              <div className="flex items-center justify-between mb-4 mt-2">
                <h2
                  id="recent-chats-heading"
                  className="text-lg sm:text-xl font-extrabold text-[#A3B18A] font-heading tracking-tight"
                >
                  Recent
                </h2>
              </div>

              <div id="recent-chats-container" className="space-y-2.5">
                {sortedRecentSessions
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
                      className="w-full text-left p-3.5 sm:p-4 rounded-xl bg-[#131817] hover:bg-[#18201E] border border-[#212C29] transition-all group cursor-pointer relative pr-12"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 truncate pr-4">
                          <Car className="w-3.5 h-3.5 text-[#A3B18A] shrink-0" />
                          {session.isPinned && (
                            <Pin className="w-3.5 h-3.5 text-[#A3B18A] shrink-0 fill-[#A3B18A]/30 rotate-45" />
                          )}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setSessionMenuTarget(session);
                        }}
                        className="absolute right-3 top-3 p-1.5 text-[#8A9A78] hover:text-[#A3B18A] hover:bg-[#1C2522] rounded-lg transition-colors cursor-pointer"
                        title="Chat options"
                        aria-label="Chat options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                {sortedRecentSessions.filter(
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
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#A3B18A] text-[#0E1111] font-heading font-extrabold text-sm md:text-base flex items-center justify-center shrink-0 select-none leading-none">
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

      {/* MORE OPTIONS MODAL (from the ... button on Mekai response) */}
      {moreOptionsMsg && (
        <div
          id="mekai-more-options-modal"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setMoreOptionsMsg(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl md:rounded-3xl bg-[#121615] border border-[#23312C] p-5 md:p-6 shadow-2xl space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#23312C]/60 pb-3">
              <span className="font-heading font-bold text-base text-[#A3B18A]">Response Options</span>
              <button
                type="button"
                onClick={() => setMoreOptionsMsg(null)}
                className="text-[#8A9A78] hover:text-[#A3B18A] p-1 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  handleCopyMessage(moreOptionsMsg.id, moreOptionsMsg.text);
                  setMoreOptionsMsg(null);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-[#1A2522] text-[#A3B18A] text-sm font-medium transition-colors text-left"
              >
                <Copy className="w-4 h-4 text-[#A3B18A] shrink-0" />
                <span>Copy full response</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleShareMessage(moreOptionsMsg.text);
                  setMoreOptionsMsg(null);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-[#1A2522] text-[#A3B18A] text-sm font-medium transition-colors text-left"
              >
                <Share className="w-4 h-4 text-[#A3B18A] shrink-0" />
                <span>Export / Share as file</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleToggleSpeak(moreOptionsMsg.id, moreOptionsMsg.text);
                  setMoreOptionsMsg(null);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-[#1A2522] text-[#A3B18A] text-sm font-medium transition-colors text-left"
              >
                <Volume2 className="w-4 h-4 text-[#A3B18A] shrink-0" />
                <span>Read aloud</span>
              </button>

              <div className="pt-2 border-t border-[#23312C]/50 flex items-center justify-between text-xs text-[#5A6964]">
                <span>Mekai Diagnostic Assistant</span>
                <span>Cestcore Limited</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USER MESSAGE LONG-PRESS ACTION SHEET / POPOVER */}
      {userMsgPopover && (
        <div
          id="user-message-action-sheet"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fadeIn"
          onClick={() => setUserMsgPopover(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl md:rounded-3xl bg-[#121615] border border-[#23312C] p-4 md:p-5 shadow-2xl space-y-2 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs uppercase tracking-wider text-[#8A9A78] font-bold px-2 pb-1 border-b border-[#23312C]/60 flex items-center justify-between">
              <span>Message Options</span>
              <button
                type="button"
                onClick={() => setUserMsgPopover(null)}
                className="text-[#8A9A78] hover:text-[#A3B18A] p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 pt-1">
              <button
                type="button"
                onClick={() => {
                  handleCopyMessage(userMsgPopover.message.id, userMsgPopover.message.text);
                  setUserMsgPopover(null);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-[#1A2522] text-[#A3B18A] text-sm font-semibold transition-colors text-left"
              >
                <Copy className="w-4 h-4 text-[#A3B18A] shrink-0" />
                <span>Copy text</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingMessage(userMsgPopover.message);
                  setEditMessageText(userMsgPopover.message.text);
                  setUserMsgPopover(null);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-[#1A2522] text-[#A3B18A] text-sm font-semibold transition-colors text-left"
              >
                <Edit3 className="w-4 h-4 text-[#A3B18A] shrink-0" />
                <span>Edit message</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER MESSAGE MODAL */}
      {editingMessage && (
        <div
          id="edit-message-modal"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setEditingMessage(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl md:rounded-3xl bg-[#121615] border border-[#23312C] p-5 md:p-6 shadow-2xl space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#23312C]/60 pb-3">
              <span className="font-heading font-bold text-base text-[#A3B18A]">Edit Message</span>
              <button
                type="button"
                onClick={() => setEditingMessage(null)}
                className="text-[#8A9A78] hover:text-[#A3B18A] p-1 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              value={editMessageText}
              onChange={(e) => setEditMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (editMessageText.trim() && !isAnalyzing) {
                    handleSaveEditedMessage();
                  }
                }
              }}
              rows={4}
              className="w-full p-3.5 rounded-xl bg-[#0E1312] border border-[#23312C] text-white focus:outline-none focus:border-[#A3B18A] text-sm font-sans resize-none leading-relaxed"
              placeholder="Edit your message text..."
              autoFocus
            />

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setEditingMessage(null)}
                className="px-4 py-2 rounded-xl text-xs md:text-sm font-medium text-[#8A9A78] hover:text-white hover:bg-[#19221F] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditedMessage}
                disabled={!editMessageText.trim() || isAnalyzing}
                className="px-5 py-2 rounded-xl bg-[#A3B18A] hover:bg-[#92A177] text-[#0E1111] font-heading font-bold text-xs md:text-sm transition-colors disabled:opacity-40"
              >
                {isAnalyzing ? 'Analyzing...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SESSION ... ACTION MENU MODAL (Share, Pin, Rename, Help, Report a problem, Delete) */}
      {sessionMenuTarget && (
        <div
          id="session-options-modal"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSessionMenuTarget(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl md:rounded-3xl bg-[#121615] border border-[#23312C] p-5 md:p-6 shadow-2xl space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#23312C]/60 pb-3">
              <div className="min-w-0 pr-2">
                <span className="font-heading font-bold text-base text-[#A3B18A] block truncate">
                  {sessionMenuTarget.title}
                </span>
                <span className="text-[11px] text-[#5A6964] block font-mono">
                  {sessionMenuTarget.date}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSessionMenuTarget(null)}
                className="text-[#8A9A78] hover:text-[#A3B18A] p-1 focus:outline-none shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              {/* Share */}
              <button
                type="button"
                onClick={() => handleShareSession(sessionMenuTarget)}
                className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-[#1A2522] text-[#A3B18A] text-sm font-medium transition-colors text-left cursor-pointer"
              >
                <Share className="w-4 h-4 text-[#A3B18A] shrink-0 stroke-[1.9]" />
                <span>Share chat</span>
              </button>

              {/* Pin / Unpin */}
              <button
                type="button"
                onClick={() => handleTogglePinSession(sessionMenuTarget.id)}
                className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-[#1A2522] text-[#A3B18A] text-sm font-medium transition-colors text-left cursor-pointer"
              >
                <Pin className={`w-4 h-4 text-[#A3B18A] shrink-0 stroke-[1.9] rotate-45 ${sessionMenuTarget.isPinned ? 'fill-[#A3B18A]/40' : ''}`} />
                <span>{sessionMenuTarget.isPinned ? 'Unpin chat' : 'Pin chat'}</span>
              </button>

              {/* Rename */}
              <button
                type="button"
                onClick={() => handleStartRenameSession(sessionMenuTarget)}
                className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-[#1A2522] text-[#A3B18A] text-sm font-medium transition-colors text-left cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-[#A3B18A] shrink-0 stroke-[1.9]" />
                <span>Rename</span>
              </button>

              {/* Help */}
              <button
                type="button"
                onClick={() => handleStartHelpSession(sessionMenuTarget)}
                className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-[#1A2522] text-[#A3B18A] text-sm font-medium transition-colors text-left cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-[#A3B18A] shrink-0 stroke-[1.9]" />
                <span>Help</span>
              </button>

              {/* Report a problem */}
              <button
                type="button"
                onClick={() => handleStartReportProblem(sessionMenuTarget)}
                className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-[#1A2522] text-[#A3B18A] text-sm font-medium transition-colors text-left cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-[#A3B18A] shrink-0 stroke-[1.9]" />
                <span>Report a problem</span>
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={(e) => {
                  handleDeleteSession(e, sessionMenuTarget.id);
                  setSessionMenuTarget(null);
                }}
                className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-red-950/40 text-red-400 text-sm font-medium transition-colors text-left cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-red-400 shrink-0 stroke-[1.9]" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENAME SESSION MODAL */}
      {sessionToRename && (
        <div
          id="rename-session-modal"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSessionToRename(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl md:rounded-3xl bg-[#121615] border border-[#23312C] p-5 md:p-6 shadow-2xl space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#23312C]/60 pb-3">
              <span className="font-heading font-bold text-base text-[#A3B18A]">Rename Chat</span>
              <button
                type="button"
                onClick={() => setSessionToRename(null)}
                className="text-[#8A9A78] hover:text-[#A3B18A] p-1 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#8A9A78] uppercase tracking-wider block">
                Chat Title
              </label>
              <input
                type="text"
                value={renameTitleInput}
                onChange={(e) => setRenameTitleInput(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#0E1312] border border-[#23312C] text-white focus:outline-none focus:border-[#A3B18A] text-sm font-sans"
                placeholder="e.g. Ford Explorer 2014"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRenamedSession();
                }}
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSessionToRename(null)}
                className="px-4 py-2 rounded-xl text-xs md:text-sm font-medium text-[#8A9A78] hover:text-white hover:bg-[#19221F] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRenamedSession}
                disabled={!renameTitleInput.trim()}
                className="px-5 py-2 rounded-xl bg-[#A3B18A] hover:bg-[#92A177] text-[#0E1111] font-heading font-bold text-xs md:text-sm transition-colors disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HELP MODAL */}
      {sessionHelpTarget && (
        <div
          id="session-help-modal"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSessionHelpTarget(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl md:rounded-3xl bg-[#121615] border border-[#23312C] p-5 md:p-6 shadow-2xl space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#23312C]/60 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#A3B18A]" />
                <span className="font-heading font-bold text-base text-[#A3B18A]">Chat Help & Guidelines</span>
              </div>
              <button
                type="button"
                onClick={() => setSessionHelpTarget(null)}
                className="text-[#8A9A78] hover:text-[#A3B18A] p-1 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs md:text-sm text-[#A3B18A]/90 leading-relaxed max-h-72 overflow-y-auto pr-1">
              <div className="p-3 bg-[#161F1C] border border-[#23312C] rounded-xl">
                <p className="font-bold text-white mb-1">Vehicle Details & DTC Guidance</p>
                <p className="text-[#8A9A78]">
                  Specify Year, Make, Model, and Engine (e.g. "2014 Ford Explorer 3.5L") along with DTC fault codes for pinpoint step-by-step diagnostic trees.
                </p>
              </div>

              <div className="p-3 bg-[#161F1C] border border-[#23312C] rounded-xl">
                <p className="font-bold text-white mb-1">Acoustic Diagnostics</p>
                <p className="text-[#8A9A78]">
                  Tap the microphone in the prompt bar to record engine knock, valvetrain ticking, wheel bearing hum, or transmission whine.
                </p>
              </div>

              <div className="p-3 bg-[#161F1C] border border-[#23312C] rounded-xl">
                <p className="font-bold text-white mb-1">Session Management</p>
                <p className="text-[#8A9A78]">
                  You can Pin critical active bay jobs to the top of your Recents and Search Chats list, rename them to match repair order numbers, or export them to share with technicians.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-[#23312C]/50">
              <button
                type="button"
                onClick={() => setSessionHelpTarget(null)}
                className="px-5 py-2 rounded-xl bg-[#A3B18A] hover:bg-[#92A177] text-[#0E1111] font-heading font-bold text-xs md:text-sm transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT A PROBLEM MODAL */}
      {sessionReportTarget && (
        <div
          id="report-problem-modal"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSessionReportTarget(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl md:rounded-3xl bg-[#121615] border border-[#23312C] p-5 md:p-6 shadow-2xl space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#23312C]/60 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span className="font-heading font-bold text-base text-[#A3B18A]">Report a Problem</span>
              </div>
              <button
                type="button"
                onClick={() => setSessionReportTarget(null)}
                className="text-[#8A9A78] hover:text-[#A3B18A] p-1 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <Check className="w-8 h-8 text-[#A3B18A] mx-auto stroke-[2.5]" />
                <p className="font-heading font-bold text-base text-white">Problem Reported</p>
                <p className="text-xs text-[#8A9A78]">
                  Thank you. Diagnostic logs for "{sessionReportTarget.title}" have been flagged for engineering review.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setSessionReportTarget(null)}
                    className="px-5 py-2 rounded-xl bg-[#A3B18A] text-[#0E1111] font-heading font-bold text-xs md:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-xs text-[#8A9A78] leading-relaxed">
                  Reporting an issue with diagnostic session <strong className="text-white font-mono">"{sessionReportTarget.title}"</strong> ({sessionReportTarget.date}).
                </div>

                <textarea
                  value={reportIssueText}
                  onChange={(e) => setReportIssueText(e.target.value)}
                  rows={4}
                  className="w-full p-3.5 rounded-xl bg-[#0E1312] border border-[#23312C] text-white focus:outline-none focus:border-[#A3B18A] text-sm font-sans resize-none leading-relaxed"
                  placeholder="Describe the issue (e.g. incorrect pinout, inaccurate torque spec, network error)..."
                  autoFocus
                />

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setSessionReportTarget(null)}
                    className="px-4 py-2 rounded-xl text-xs md:text-sm font-medium text-[#8A9A78] hover:text-white hover:bg-[#19221F] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!reportIssueText.trim()) return;
                      setReportSubmitted(true);
                    }}
                    disabled={!reportIssueText.trim()}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-heading font-bold text-xs md:text-sm transition-colors disabled:opacity-40"
                  >
                    Submit Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
