import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

function sentry() {
  const dns = process.env.REACT_APP_SENTRY;
  console.log('🚀 debug ~ sentry ~ dns', dns);
  Sentry.init({
    dsn: dns,
    ignoreErrors: ['ResizeObserver loop limit exceeded'],
    beforeSend(event, hint) {
      // Check if it is an exception, and if so, show the report dialog
      if (event.exception) {
        Sentry.showReportDialog({
          eventId: event.event_id,
          title: 'Te pedimos disculpas',
          subtitle: 'Nuestro equipo dara una pronta solución a este inconveniente, cuentanos que ha sucedido?',
          successMessage:
            'Nos disculpamos contigo y te damos muchas gracias por tu feedback daremos pronta solución a este inconveniente.',
          errorFormEntry: 'Algunos datos no son válidos. Por favor, corrija los errores e inténtelo de nuevo.',
          errorGeneric: 'Se produjo un error desconocido al enviar su informe. Inténtalo de nuevo.',
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
