import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.scss';
/* import 'react-toastify/dist/ReactToastify.css'; */
import App from './App/App';
import { unregister as unregisterServiceWorker } from './registerServiceWorker';
import { IntlProvider } from 'react-intl';
import localeData from './helpers/locale.json';
import { CurrentUserProvider } from 'Context/userContext';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

const language = (navigator.languages && navigator.languages[0]) || navigator.language;
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

Sentry.init({
  dsn: 'https://d22c22662dfe45ab806c3bea19c1017b@o1156387.ingest.sentry.io/6237649',
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

ReactDOM.render(
  <>
    <IntlProvider locale={languageWithoutRegionCode} messages={messages} defaultLocale='es'>
      <CurrentUserProvider>
        <App />
      </CurrentUserProvider>
    </IntlProvider>
  </>,
  document.getElementById('root')
);

unregisterServiceWorker();
