// Pushes a custom event onto Google Tag Manager's dataLayer (see the GTM-P38X3JKJ snippet
// in index.html). To actually see these in GA4, create a Custom Event trigger in GTM for
// each event name below (Trigger type: Custom Event, Event name: e.g. "booking_confirmed")
// and attach a GA4 Event tag to it — no further code changes needed after that.
// Wrapped in try/catch so a blocked/missing dataLayer (ad blockers) can never break booking.
export function trackEvent(name, params = {}) {
  try {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: name, ...params });
    }
  } catch (e) {
    /* no-op */
  }
}
