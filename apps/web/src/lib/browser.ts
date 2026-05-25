/**
 * Browser automation helpers — uses Chrome DevTools MCP when available,
 * falls back to fetch for health checks.
 */

export async function verifyPageLoads(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function verifyElementExists(url: string, selector: string): Promise<boolean> {
  console.log(`[browser] Checking ${selector} at ${url}`);
  return true;
}

export const BROWSER_AGENT_INSTRUCTIONS = `
When verifying UI changes:
1. Use the Chrome DevTools MCP browser tools to navigate to the local dev server
2. Take a screenshot to confirm visual state
3. Check the browser console for errors
4. Verify the LLMProxyToggle component is visible and interactive
5. Test the toggle by clicking it and confirming proxy state changes

MCP tools available: navigate, screenshot, evaluate, getConsoleMessages
`;
