'use client';

import { trackEvent } from '@/utils/analytics';
import { useReportWebVitals } from 'next/web-vitals';

/**
 * Streams Core Web Vitals (LCP, INP, CLS, FCP, TTFB) into GA4 as
 * `web_vitals` events, so performance can be analysed next to visitor
 * behaviour (e.g. "do slow loads bounce more?").
 *
 * Renders nothing — mount once in the root layout.
 */
const WebVitalsReporter = () => {
  useReportWebVitals(metric => {
    trackEvent('web_vitals', {
      metric_name: metric.name,
      // CLS is a small decimal (~0.05) — scale it up so GA4's integer
      // rounding doesn't flatten every value to 0.
      metric_value: Math.round(
        metric.name === 'CLS' ? metric.value * 1000 : metric.value
      ),
      metric_rating: metric.rating,
      metric_id: metric.id,
    });
  });

  return null;
};

export default WebVitalsReporter;
