import {
  classifyCopiedText,
  sanitizeCommand,
  trackEvent,
} from '../analytics';

describe('trackEvent (GA4 helper)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete window.gtag;
  });

  it('sends the event name and params to gtag', () => {
    const gtag = jest.fn();
    window.gtag = gtag;

    trackEvent('cv_download', { source: 'terminal' });

    expect(gtag).toHaveBeenCalledWith('event', 'cv_download', {
      source: 'terminal',
    });
  });

  it('defaults params to an empty object when none are given', () => {
    const gtag = jest.fn();
    window.gtag = gtag;

    trackEvent('page_ping');

    expect(gtag).toHaveBeenCalledWith('event', 'page_ping', {});
  });

  it('is a safe no-op (does not throw) when gtag is not loaded', () => {
    // e.g. GA id not set locally, or an ad-blocker stripped gtag out
    expect(() =>
      trackEvent('terminal_command', { command: 'about' })
    ).not.toThrow();
  });

  it('logs events at a console level visible by default in dev', () => {
    // Chrome hides console.debug (Verbose) unless the user opts in, which
    // defeats the purpose of dev logging — it must use console.info.
    jest.replaceProperty(process.env, 'NODE_ENV', 'development');
    const info = jest.spyOn(console, 'info').mockImplementation(() => {});

    trackEvent('terminal_command', { command: 'help' });

    expect(info).toHaveBeenCalledWith(
      '[analytics] event:',
      'terminal_command',
      { command: 'help' }
    );
    info.mockRestore();
  });
});

describe('sanitizeCommand (GA4 param hygiene)', () => {
  const KNOWN = ['help', 'about', 'cv'] as const;

  it('passes known commands through with known: true', () => {
    expect(sanitizeCommand('about', KNOWN)).toEqual({
      command: 'about',
      known: true,
    });
  });

  it('masks unknown commands to avoid junk cardinality and PII in GA', () => {
    // If a visitor types their email into the terminal, it must NOT be sent.
    expect(sanitizeCommand('someone@example.com', KNOWN)).toEqual({
      command: '(unknown)',
      known: false,
      attempted_length: 19,
    });
  });
});

describe('classifyCopiedText (email copy = contact intent)', () => {
  const contacts = {
    email: 'hello@yashsuthar.com',
    personalEmail: 'yashsuthar0309@gmail.com',
  };

  it('returns null when the copied text has no email in it', () => {
    expect(classifyCopiedText('just some terminal output', contacts)).toBe(
      null
    );
  });

  it('recognises the work email', () => {
    expect(
      classifyCopiedText('Email: hello@yashsuthar.com', contacts)
    ).toBe('work');
  });

  it('recognises the personal email', () => {
    expect(
      classifyCopiedText('reach me at yashsuthar0309@gmail.com!', contacts)
    ).toBe('personal');
  });

  it('classifies any other email as other', () => {
    expect(classifyCopiedText('cc stranger@example.org', contacts)).toBe(
      'other'
    );
  });
});
