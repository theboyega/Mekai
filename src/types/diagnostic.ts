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
  isPinned?: boolean;
}

export interface WebhookResult {
  text: string;
  vehicle?: string;
  title?: string;
}

export interface TechnicianProfile {
  name: string;
  workshopCode: string;
  specialization?: string;
  joinedAt?: string;
}
