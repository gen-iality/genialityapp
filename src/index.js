import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.scss';
import 'react-toastify/dist/ReactToastify.css';

import App from './App/App';

//import registerServiceWorker from './registerServiceWorker';
import { unregister as unregisterServiceWorker } from './registerServiceWorker';
//index.html loading old files because of service worker after build
//https://github.com/facebook/create-react-app/issues/2715
//https://gist.github.com/kirillshevch/a7d778a6aaa788149ae86a9b313cb0ad
import { IntlProvider } from 'react-intl';
//Import local files from intl
//import locale_en from 'react-intl/locale-data/en';
//import locale_es from 'react-intl/locale-data/es';
import localeData from './helpers/locale.json';

// Define user's language.
const language = (navigator.languages && navigator.languages[0]) || navigator.language;
// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
// Try full locale, try locale without region code, fallback to 'en'
const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;


console.log("process.env.REACT_APP_BASE_URL",process.env.REACT_APP_BASE_URL)
ReactDOM.render(
  <>
    <IntlProvider locale={languageWithoutRegionCode} messages={messages} defaultLocale='es'>
      <App />
    </IntlProvider>
  </>,
  document.getElementById('root')
);
////index.html loading old files because of service worker after build
//registerServiceWorker();
unregisterServiceWorker();
