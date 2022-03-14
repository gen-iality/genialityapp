import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

function sentry() {
  const dns = process.env.REACT_APP_SENTRY;

  Sentry.init({
    dsn: dns,
    ignoreErrors: ['ResizeObserver loop limit exceeded'],
    beforeSend(event, hint) {
      // Check if it is an exception, and if so, show the report dialog
      if (event.exception) {
        Sentry.showReportDialog({
          eventId: event.event_id,
        });
      }
      return event;
    },
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

export default sentry;
