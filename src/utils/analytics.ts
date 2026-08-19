/**
 * Tiny GA4 (Google Analytics 4) event helper.
 *
 * GA4 records "events": named things that happened, each with optional params.
 * The global `gtag()` function is injected by the Google Analytics script in
 * `layout.tsx` (only when NEXT_PUBLIC_GA_ID is set). This wrapper lets the rest
 * of the app fire events without ever touching `window.gtag` directly, and it
 * stays a safe no-op when GA isn't available (server-side render, no id set
 * locally, or an ad-blocker stripped gtag out).
 *
 * Usage:  trackEvent('cv_download', { source: 'terminal' })
 */

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js' | 'set',
      targetOrName: string | Date,
      params?: Record<string, unknown>
    ) => void;
  }
}

export function trackEvent(
  name: string,
  params: Record<string, unknown> = {}
): void {
  // In local dev, log every event so you can SEE what's being tracked in the
  // browser console while you learn. Silent in production and in tests.
  // console.info (not .debug) — Chrome hides debug/Verbose logs by default.
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.info('[analytics] event:', name, params);
  }

  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return; // GA not available — do nothing rather than crash.
  }

  window.gtag('event', name, params);
}

/**
 * Prepare a terminal command for analytics.
 *
 * Two GA4 gotchas this guards against:
 * - Cardinality: free-typed junk ("hepl", "ls -la", …) would flood the
 *   command report with one-off values.
 * - PII: if a visitor types an email/phone into the terminal, sending it to
 *   Google would violate GA4 policy. Unknown input is masked; only its
 *   length is kept (still useful: 3 chars = typo, 40 = pasted text).
 */
export function sanitizeCommand(
  command: string,
  knownCommands: readonly string[]
): { command: string; known: boolean; attempted_length?: number } {
  if (knownCommands.includes(command)) {
    return { command, known: true };
  }
  return {
    command: '(unknown)',
    known: false,
    attempted_length: command.length,
  };
}

const EMAIL_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/;

/**
 * Classify copied text for the email_copy event ("contact intent" signal).
 * Returns which address was copied — never the text itself (PII stays local).
 */
export function classifyCopiedText(
  text: string,
  contacts: { email: string; personalEmail: string }
): 'work' | 'personal' | 'other' | null {
  if (!EMAIL_PATTERN.test(text)) return null;
  if (text.includes(contacts.email)) return 'work';
  if (text.includes(contacts.personalEmail)) return 'personal';
  return 'other';
}
