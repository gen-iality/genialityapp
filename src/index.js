import React from 'react';
import ReactDOM from 'react-dom';
import  './styles/main.css';
import App from './App/App';
import registerServiceWorker from './registerServiceWorker';
//index.html loading old files because of service worker after build
//https://github.com/facebook/create-react-app/issues/2715
unregister();
import {addLocaleData, IntlProvider,} from 'react-intl';
//Import local files from intl
import locale_en from 'react-intl/locale-data/en';
import locale_es from 'react-intl/locale-data/es';
import localeData from "./helpers/locale.json";

addLocaleData([...locale_en, ...locale_es]);
// Define user's language.
const language = (navigator.languages && navigator.languages[0]) || navigator.language;
// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
// Try full locale, try locale without region code, fallback to 'en'
const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

ReactDOM.render(
    <IntlProvider locale={language} messages={messages}>
        <App/>
    </IntlProvider>, document.getElementById('root'));
registerServiceWorker();
