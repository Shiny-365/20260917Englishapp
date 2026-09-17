export type ChatRole = 'user' | 'model';
export type ChatMessage = { role: ChatRole; text: string };

const GEMINI_MODEL = 'gemini-3.5-flash-lite';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export class GeminiApiError extends Error {}

export async function sendChatMessage(
  apiKey: string,
  history: ChatMessage[],
  systemInstruction: string
): Promise<string> {
  const url = `${API_BASE}/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents: history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    generationConfig: { temperature: 0.8, maxOutputTokens: 300 },
  };

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new GeminiApiError('네트워크 연결을 확인해주세요.');
  }

  if (!response.ok) {
    if (response.status === 400 || response.status === 403) {
      throw new GeminiApiError('API 키가 올바르지 않거나 권한이 없어요. 키를 다시 확인해주세요.');
    }
    if (response.status === 429) {
      throw new GeminiApiError('요청이 너무 많아요. 잠시 후 다시 시도해주세요.');
    }
    throw new GeminiApiError(`AI 응답을 가져오지 못했어요. (오류 코드 ${response.status})`);
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p: { text?: string }) => p.text ?? '').join('').trim();

  if (!text) {
    throw new GeminiApiError('AI가 응답을 생성하지 못했어요. 다시 시도해주세요.');
  }
  return text;
}
