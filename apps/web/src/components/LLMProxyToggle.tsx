'use client';

import { useState, useEffect, useCallback } from 'react';

interface ProviderStatus {
  name: string;
  model: string;
  tier: string;
  ok: boolean | null;
}

const PROVIDERS: ProviderStatus[] = [
  { name: 'Groq', model: 'llama-3.3-70b', tier: 'Haiku (fast)', ok: null },
  { name: 'Mistral', model: 'mistral-small', tier: 'Sonnet (balanced)', ok: null },
  { name: 'OpenRouter', model: 'gpt-oss-20b:free', tier: 'Opus (reasoning)', ok: null },
];

export function LLMProxyToggle() {
  const [enabled, setEnabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [statuses, setStatuses] = useState(PROVIDERS);
  const [lastCheck, setLastCheck] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('llm_proxy_enabled');
    if (saved !== null) setEnabled(saved === 'true');
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem('llm_proxy_enabled', String(next));
    window.dispatchEvent(new CustomEvent('llm-proxy-toggle', { detail: { enabled: next } }));
  };

  const checkHealth = useCallback(async () => {
    setChecking(true);
    const tiers = [
      { tier: 'Haiku (fast)', model: 'claude-haiku-4-5', idx: 0 },
      { tier: 'Sonnet (balanced)', model: 'claude-sonnet-4-5', idx: 1 },
      { tier: 'Opus (reasoning)', model: 'claude-opus-4-5', idx: 2 },
    ];
    const results = await Promise.all(
      tiers.map(async ({ model, idx }) => {
        try {
          const r = await fetch('http://localhost:8082/v1/messages', {
            method: 'POST',
            headers: {
              'x-api-key': 'freecc',
              'Content-Type': 'application/json',
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
              model,
              max_tokens: 5,
              stream: false,
              messages: [{ role: 'user', content: 'Hi' }],
            }),
            signal: AbortSignal.timeout(10000),
          });
          return { idx, ok: r.ok };
        } catch {
          return { idx, ok: false };
        }
      }),
    );
    setStatuses((prev) =>
      prev.map((p, i) => {
        const r = results.find((x) => x.idx === i);
        return r ? { ...p, ok: r.ok } : p;
      }),
    );
    setLastCheck(new Date().toLocaleTimeString());
    setChecking(false);
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        fontFamily: 'monospace',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: enabled ? '#10b981' : '#6b7280',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '8px 14px',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 700,
          boxShadow: '0 2px 8px rgba(0,0,0,.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span style={{ fontSize: 16 }}>{enabled ? '🤖' : '💤'}</span>
        Free LLM {enabled ? 'ON' : 'OFF'}
        <span style={{ fontSize: 10, opacity: 0.7 }}>▲</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: 44,
            right: 0,
            background: '#1e1e2e',
            border: '1px solid #3b3b5c',
            borderRadius: 10,
            padding: 16,
            minWidth: 280,
            boxShadow: '0 4px 24px rgba(0,0,0,.4)',
            color: '#cdd6f4',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700 }}>Free LLM Proxy</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={enabled}
                onChange={toggle}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: enabled ? '#a6e3a1' : '#f38ba8',
                }}
              >
                {enabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div style={{ fontSize: 11, color: '#6c7086', marginBottom: 8 }}>
            Proxy: http://localhost:8082
          </div>

          {statuses.map((p) => (
            <div
              key={p.name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '4px 0',
                borderBottom: '1px solid #2a2a3e',
                fontSize: 12,
              }}
            >
              <span>
                <span
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: p.ok === null ? '#f9e2af' : p.ok ? '#a6e3a1' : '#f38ba8',
                    marginRight: 6,
                  }}
                />
                {p.name}
                <span style={{ color: '#6c7086', fontSize: 10, marginLeft: 4 }}>
                  {p.tier}
                </span>
              </span>
              <span style={{ color: '#89b4fa', fontSize: 10 }}>{p.model}</span>
            </div>
          ))}

          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button
              onClick={checkHealth}
              disabled={checking}
              style={{
                flex: 1,
                background: '#313244',
                color: '#cdd6f4',
                border: 'none',
                borderRadius: 6,
                padding: '5px 10px',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {checking ? '⟳ Checking...' : '⟳ Recheck'}
            </button>
            {lastCheck && (
              <span style={{ fontSize: 10, color: '#6c7086', alignSelf: 'center' }}>
                {lastCheck}
              </span>
            )}
          </div>

          <div
            style={{
              marginTop: 10,
              padding: '6px 8px',
              background: '#181825',
              borderRadius: 6,
              fontSize: 10,
              color: '#6c7086',
            }}
          >
            <div>⚡ fast/code → Groq llama-3.3-70b</div>
            <div>⚖️ balanced → Mistral small</div>
            <div>🧠 reasoning → OpenRouter gpt-oss-20b</div>
            <div>📄 long-context → Gemini 2.5 Flash (direct)</div>
            <div>🐙 github-free → GitHub Models gpt-4.1</div>
          </div>
        </div>
      )}
    </div>
  );
}
