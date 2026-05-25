'use client';

import { LLMProxyToggle } from './LLMProxyToggle';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <LLMProxyToggle />
    </>
  );
}
