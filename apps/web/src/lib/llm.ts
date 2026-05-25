/**
 * Smart LLM Router — routes tasks to the best free provider via fcc proxy.
 * Toggle proxy on/off with LLM_PROXY_ENABLED env var or UI toggle.
 * All calls default through http://localhost:8082 unless proxy is off.
 */
import OpenAI from 'openai';

// ── Configuration ──────────────────────────────────────────────────
export const PROXY_URL = process.env.NEXT_PUBLIC_LLM_PROXY_URL ?? 'http://localhost:8082';
export const PROXY_TOKEN = process.env.NEXT_PUBLIC_LLM_PROXY_TOKEN ?? 'freecc';
export const PROXY_ENABLED = process.env.NEXT_PUBLIC_LLM_PROXY_ENABLED !== 'false';

// Direct provider credentials (used when proxy is off or for long-context/vision)
// Keys MUST be provided via environment variables. Do NOT hardcode secrets in source.
const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? '';
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN ?? '';
const OPENAI_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? '';
const GROQ_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY ?? '';
const MISTRAL_KEY = process.env.NEXT_PUBLIC_MISTRAL_API_KEY ?? '';

// ── Task → Model tier mapping ──────────────────────────────────────
export type TaskType =
  | 'reasoning' // Complex multi-step → OpenRouter gpt-oss-20b
  | 'code' // Code gen/review   → Groq llama-3.3-70b (fast)
  | 'fast' // Quick chat/simple → Groq llama-3.3-70b
  | 'balanced' // Default quality   → Mistral small
  | 'long-context' // >32K tokens       → Gemini 2.5 Flash direct
  | 'vision' // Image input       → Gemini 2.5 Flash direct
  | 'github-free' // Free quota burst  → GitHub Models gpt-4.1
  | 'default';

interface RouteConfig {
  model: string; // Claude tier alias → proxy maps to actual provider
  direct?: boolean; // Skip proxy, call provider directly
  provider?: string; // Direct provider URL
  apiKey?: string;
  maxTokens: number;
}

const TASK_ROUTES: Record<TaskType, RouteConfig> = {
  reasoning: { model: 'claude-opus-4-5', maxTokens: 8192 },
  code: { model: 'claude-haiku-4-5', maxTokens: 4096 },
  fast: { model: 'claude-haiku-4-5', maxTokens: 2048 },
  balanced: { model: 'claude-sonnet-4-5', maxTokens: 4096 },
  'long-context': {
    model: 'gemini-2.5-flash',
    direct: true,
    provider: 'https://generativelanguage.googleapis.com/v1beta/openai',
    apiKey: GEMINI_KEY,
    maxTokens: 32768,
  },
  vision: {
    model: 'gemini-2.5-flash',
    direct: true,
    provider: 'https://generativelanguage.googleapis.com/v1beta/openai',
    apiKey: GEMINI_KEY,
    maxTokens: 8192,
  },
  'github-free': {
    model: 'gpt-4.1-mini',
    direct: true,
    provider: 'https://models.github.ai/inference',
    apiKey: GITHUB_TOKEN,
    maxTokens: 4096,
  },
  default: { model: 'claude-sonnet-4-5', maxTokens: 4096 },
};

// ── Client factory ─────────────────────────────────────────────────
function makeClient(route: RouteConfig, proxyEnabled: boolean): OpenAI {
  if (route.direct || !proxyEnabled) {
    return new OpenAI({
      baseURL: route.provider,
      apiKey: route.apiKey ?? OPENAI_KEY,
      dangerouslyAllowBrowser: typeof window !== 'undefined',
    });
  }
  return new OpenAI({
    baseURL: PROXY_URL + '/v1',
    apiKey: PROXY_TOKEN,
    defaultHeaders: { 'anthropic-version': '2023-06-01' },
    dangerouslyAllowBrowser: typeof window !== 'undefined',
  });
}

// ── Main chat function ─────────────────────────────────────────────
export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMOptions {
  task?: TaskType;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
  proxyOverride?: boolean; // force proxy on/off for this call
}

export async function llmChat(
  messages: LLMMessage[],
  opts: LLMOptions = {},
): Promise<string> {
  const task = opts.task ?? 'default';
  const route = TASK_ROUTES[task];
  const useProxy = opts.proxyOverride ?? PROXY_ENABLED;
  const client = makeClient(route, useProxy);
  const maxTokens = opts.maxTokens ?? route.maxTokens;
  const allMessages = opts.systemPrompt
    ? [{ role: 'system' as const, content: opts.systemPrompt }, ...messages]
    : messages;

  const resp = await client.chat.completions.create({
    model: route.model,
    messages: allMessages,
    max_tokens: maxTokens,
    temperature: opts.temperature ?? 0.7,
    stream: false,
  });

  return (resp as any).choices?.[0]?.message?.content ?? (resp as any).content?.[0]?.text ?? '';
}

// ── Streaming variant ──────────────────────────────────────────────
export async function* llmStream(
  messages: LLMMessage[],
  opts: LLMOptions = {},
): AsyncGenerator<string> {
  const task = opts.task ?? 'default';
  const route = TASK_ROUTES[task];
  const useProxy = opts.proxyOverride ?? PROXY_ENABLED;
  const client = makeClient(route, useProxy);
  const allMessages = opts.systemPrompt
    ? [{ role: 'system' as const, content: opts.systemPrompt }, ...messages]
    : messages;

  const stream = await client.chat.completions.create({
    model: route.model,
    messages: allMessages,
    max_tokens: opts.maxTokens ?? route.maxTokens,
    stream: true,
  });

  for await (const chunk of stream as any) {
    const delta = chunk.choices?.[0]?.delta?.content ?? chunk.delta?.text;
    if (delta) yield delta;
  }
}

// ── Convenience exports ────────────────────────────────────────────
export const ask = (q: string, task?: TaskType) =>
  llmChat([{ role: 'user', content: q }], { task });

export const codeReview = (code: string) =>
  llmChat([{ role: 'user', content: `Review this code:\n\`\`\`\n${code}\n\`\`\`` }], {
    task: 'code',
  });

export const summarize = (text: string) =>
  llmChat([{ role: 'user', content: `Summarize concisely:\n${text}` }], {
    task: 'fast',
  });

export const analyze = (text: string) =>
  llmChat([{ role: 'user', content: text }], { task: 'reasoning' });
