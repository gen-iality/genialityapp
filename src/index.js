import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.scss';
/* import 'react-toastify/dist/ReactToastify.css'; */
import App from './App/App';
import { unregister as unregisterServiceWorker } from './registerServiceWorker';
import { IntlProvider } from 'react-intl';
import localeData from './helpers/locale.json';
import { CurrentUserProvider } from 'Context/userContext';
import sentry from './helpers/sentry';

const language = (navigator.languages && navigator.languages[0]) || navigator.language;
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

/* A helper function that will send errors to Sentry.io. */
sentry();

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
