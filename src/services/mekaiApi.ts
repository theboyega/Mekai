export const MEKAI_WEBHOOK_URL =
  'https://mekai-ai.app.n8n.cloud/webhook/5b01dd02-7501-46e9-ba90-f890e6a1c2bf/chat';

export interface MekaiAttachmentPayload {
  type: 'image' | 'file' | 'audio';
  name: string;
  size?: string;
  url?: string;
}

export interface SendMessageOptions {
  message: string;
  sessionId: string;
  technicianName?: string;
  activeCode?: string | null;
  attachment?: MekaiAttachmentPayload;
}

export interface MekaiApiResponse {
  success: boolean;
  reply: string;
  error?: string;
}

/**
 * Sends prompt and optional session/attachment context to the live Mekai n8n workflow.
 * Real webhook endpoint: https://mekai-ai.app.n8n.cloud/webhook/5b01dd02-7501-46e9-ba90-f890e6a1c2bf/chat
 */
export async function sendPromptToMekai(options: SendMessageOptions): Promise<MekaiApiResponse> {
  const { message, sessionId, technicianName, activeCode, attachment } = options;

  let computedChatInput = message.trim();
  if (!computedChatInput && attachment) {
    if (attachment.type === 'image') {
      computedChatInput = `[Inspection Photo Attached: ${attachment.name}] Please examine this vehicle component image.`;
    } else if (attachment.type === 'audio') {
      computedChatInput = `[Acoustic Audio Sample Attached: ${attachment.name}] Please evaluate this engine audio sample.`;
    } else {
      computedChatInput = `[Diagnostic Log/File Attached: ${attachment.name}] Please analyze this vehicle telemetry file.`;
    }
  }

  const payload: Record<string, any> = {
    chatInput: computedChatInput,
    sessionId: sessionId || `mekai-session-${Date.now()}`,
    action: 'sendMessage',
  };

  if (technicianName) {
    payload.technicianName = technicianName;
  }

  if (activeCode) {
    payload.workshopCode = activeCode;
  }

  if (attachment) {
    payload.attachment = {
      type: attachment.type,
      name: attachment.name,
      size: attachment.size,
      url: attachment.url,
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    const response = await fetch(MEKAI_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('Mekai webhook HTTP error:', response.status, errorText);
      return {
        success: false,
        reply: `Unable to connect with Mekai diagnostic services (HTTP ${response.status}). Please check your connection and retry.`,
        error: `HTTP_${response.status}`,
      };
    }

    const contentType = response.headers.get('content-type') || '';
    let responseData: any;

    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const rawText = await response.text();
      try {
        responseData = JSON.parse(rawText);
      } catch {
        responseData = rawText;
      }
    }

    let parsedReply = '';

    if (typeof responseData === 'string') {
      parsedReply = responseData;
    } else if (responseData && typeof responseData === 'object') {
      if (typeof responseData.output === 'string') {
        parsedReply = responseData.output;
      } else if (typeof responseData.text === 'string') {
        parsedReply = responseData.text;
      } else if (typeof responseData.message === 'string') {
        if (responseData.message === 'Error in workflow') {
          return {
            success: false,
            reply: 'Mekai diagnostic workflow reported a temporary service error. Please resend your query.',
            error: 'WorkflowError',
          };
        }
        parsedReply = responseData.message;
      } else if (typeof responseData.response === 'string') {
        parsedReply = responseData.response;
      } else if (Array.isArray(responseData) && responseData.length > 0) {
        const first = responseData[0];
        parsedReply =
          first?.output || first?.text || first?.message || JSON.stringify(first);
      } else {
        parsedReply = JSON.stringify(responseData);
      }
    }

    if (!parsedReply.trim()) {
      return {
        success: false,
        reply: 'Received an empty diagnostic response from Mekai. Please try rephrasing or sending again.',
        error: 'EmptyResponse',
      };
    }

    return {
      success: true,
      reply: parsedReply,
    };
  } catch (err: any) {
    console.error('Error connecting to Mekai n8n webhook:', err);
    const isTimeout = err.name === 'AbortError';
    return {
      success: false,
      reply: isTimeout
        ? 'Diagnostic request timed out after 35 seconds. The workshop engine may be processing heavy telemetry. Please try again.'
        : 'Network error communicating with Mekai diagnostic server. Please verify your internet connection.',
      error: isTimeout ? 'Timeout' : err.message,
    };
  }
}
