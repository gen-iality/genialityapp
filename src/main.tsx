import { StrictMode } from 'react'
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

import { firestore, app } from '@helpers/firebase'
import { FB } from '@helpers/firestore-request'

import dayjs from 'dayjs'
import 'dayjs/locale/es'

/**
 * This solution is distributed as is:
 * https://github.com/react-component/picker/issues/123#issuecomment-728755491
 */
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeDataDayjs from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeDataDayjs)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

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

// @ts-expect-error
window.dayjs = dayjs
// @ts-expect-error
window.firestore = firestore
// @ts-expect-error
window.FB = FB
// @ts-expect-error
window.appFB = app

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <IntlProvider
      locale={languageWithoutRegionCode}
      messages={messages}
      defaultLocale="es"
    >
      <QueryClientProvider client={queryClient}>
        <CurrentUserProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </CurrentUserProvider>
      </QueryClientProvider>
    </IntlProvider>
  </StrictMode>,
)

unregisterServiceWorker()
