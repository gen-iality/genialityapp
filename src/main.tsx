import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { QueryClient, QueryClientProvider } from 'react-query'

import './styles/main.scss'
import App from './App/App'
import { unregister as unregisterServiceWorker } from './registerServiceWorker'
import localeData from './helpers/locale.json'
import sentry from './helpers/sentry'
import store from './redux/store'
import { CurrentUserProvider } from './context/userContext'

import dayjs from 'dayjs'
import 'dayjs/locale/es'

const queryClient = new QueryClient()
const language = (navigator.languages && navigator.languages[0]) || navigator.language

const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0]
const messages =
  (localeData as any)[languageWithoutRegionCode] ||
  (localeData as any)[language] ||
  localeData.en

// Set the dayjs locale
dayjs.locale('es')

/* A helper function that will send errors to Sentry.io. */
sentry()

const root = createRoot(document.getElementById('root')!)
root.render(
  <IntlProvider locale={languageWithoutRegionCode} messages={messages} defaultLocale="es">
    <QueryClientProvider client={queryClient}>
      <CurrentUserProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </CurrentUserProvider>
    </QueryClientProvider>
  </IntlProvider>,
)

unregisterServiceWorker()
