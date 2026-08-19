import { render } from '@testing-library/react';
import WebVitalsReporter from '../WebVitalsReporter';

// Capture the callback the component registers with Next.js, and let the
// test fire fake metrics through it.
let reportCallback: ((metric: Record<string, unknown>) => void) | undefined;
jest.mock('next/web-vitals', () => ({
  useReportWebVitals: (cb: (metric: Record<string, unknown>) => void) => {
    reportCallback = cb;
  },
}));

describe('WebVitalsReporter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    reportCallback = undefined;
    delete window.gtag;
  });

  it('renders nothing visible', () => {
    const { container } = render(<WebVitalsReporter />);
    expect(container).toBeEmptyDOMElement();
  });

  it('forwards a metric to GA4 as a web_vitals event', () => {
    const gtag = jest.fn();
    window.gtag = gtag;
    render(<WebVitalsReporter />);

    reportCallback!({
      name: 'LCP',
      value: 2314.7,
      rating: 'good',
      id: 'v3-123',
    });

    expect(gtag).toHaveBeenCalledWith('event', 'web_vitals', {
      metric_name: 'LCP',
      metric_value: 2315,
      metric_rating: 'good',
      metric_id: 'v3-123',
    });
  });

  it('scales CLS so it survives GA4 integer rounding', () => {
    // CLS is a tiny decimal (e.g. 0.05); unscaled it would round to 0.
    const gtag = jest.fn();
    window.gtag = gtag;
    render(<WebVitalsReporter />);

    reportCallback!({
      name: 'CLS',
      value: 0.053,
      rating: 'good',
      id: 'v3-456',
    });

    expect(gtag).toHaveBeenCalledWith('event', 'web_vitals', {
      metric_name: 'CLS',
      metric_value: 53,
      metric_rating: 'good',
      metric_id: 'v3-456',
    });
  });
});
