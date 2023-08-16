import { FunctionComponent, PropsWithChildren, memo } from 'react'
import { Grid, Spin, Layout } from 'antd'
import {
  BrowserRouter as Router,
  Route,
  redirect,
  Routes,
  RouteProps,
  Outlet,
  useMatch,
  useParams,
} from 'react-router-dom'
import EventAdminRoutes from '@components/events/EventAdminRoutes'
import { ApiUrl } from '@helpers/constants'
import WithFooter from '@components/withFooter'

import { CurrentUserEventProvider } from '@context/eventUserContext'
import { CurrentEventProvider } from '@context/eventContext'
import { CurrentUserProvider } from '@context/userContext'
import { SurveysProvider } from '@context/surveysContext'
import { NewEventProvider } from '@context/newEventContext'

import { HelperContextProvider } from '@context/helperContext/helperProvider'
import { AgendaContextProvider } from '@context/AgendaContext'

import EventOrganization from '@components/eventOrganization'
import OrganizationAdminRoutes from '@/pages/eventOrganization/OrganizationAdminRoutes'
import MainProfile from '@components/profile/main'

import { useCurrentUser } from '@context/userContext'
import loadable from '@loadable/component'
import ModalAuth from '@components/authentication/ModalAuth'
import ModalNoRegister from '@components/authentication/ModalNoRegister'
import BlockedEvent from '@components/events/Landing/BlockedEvent'
import ModalAuthAnonymous from '@components/authentication/ModalAuthAnonymous'
import ModalUpdate from '@components/events/Landing/ModalUpdate'
import DirectLoginPage from '@/pages/DirectLoginPage'
import CertificateGeneraterPage from '@/pages/CertificateGeneraterPage'
import { OrganizationPaymentProvider } from '@/payments/OrganizationPaymentContext'
//Code splitting
const HeaderContainer = loadable(() => import('./HeaderContainer'))
const Home = loadable(() => import('../pages/home'))
const LandingRoutes = loadable(() => import('../components/events/Landing/LandingRoutes'))
const Transition = loadable(() => import('../components/shared/Animate_Img/index'))
const NewEventPage = loadable(
  () => import('../components/events/createEvent/NewEventPage'),
)
const Terms = loadable(() => import('../components/policies/termsService'))
const Privacy = loadable(() => import('../components/policies/privacyPolicy'))
const Policies = loadable(() => import('../components/policies/policies'))
const About = loadable(() => import('../components/policies/about'))
const Faqs = loadable(() => import('../components/faqs/index'))
const socialZone = loadable(() => import('../components/socialZone/socialZone'))
const AppointmentAccept = loadable(
  () => import('../components/networking/appointmentAccept'),
)
const NotFoundPage = loadable(() => import('../components/notFoundPage/NotFoundPage'))
const ForbiddenPage = loadable(() => import('../components/forbiddenPage'))

const EventFinished = loadable(() => import('../components/eventFinished/eventFinished'))
const LoginWithCode = loadable(() => import('../components/AdminUsers/WithCode'))
const NoMatchPage = loadable(() => import('../components/notFoundPage/NoMatchPage'))

const GeneralContextProviders: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <CurrentEventProvider>
    <CurrentUserEventProvider>
      <CurrentUserProvider>
        <HelperContextProvider>
          <AgendaContextProvider>
            <SurveysProvider>{children}</SurveysProvider>
          </AgendaContextProvider>
        </HelperContextProvider>
      </CurrentUserProvider>
    </CurrentUserEventProvider>
  </CurrentEventProvider>
)

const { useBreakpoint } = Grid
const ContentContainer = () => {
  const screens = useBreakpoint()
  return (
    <Router
      basename="/"
      getUserConfirmation={() => {
        /* Empty callback to block the default browser prompt, it is necessary to be able to use in custon hook RouterPrompt */
      }}
    >
      <main className="main" style={{ minHeight: '100vh' }}>
        <Routes>
          {/** Private routes */}
          <Route
            element={
              <PrivateRoute>
                <Outlet />
              </PrivateRoute>
            }
          >
            <Route path="/myprofile" element={<MainProfile />} />
            {/*Ruta para ver resumen */}
            <Route path="/myprofile/:tab" element={<MainProfile />} />

            <Route
              path="/create-event/:user?"
              element={
                <NewEventProvider>
                  <NewEventPage />
                </NewEventProvider>
              }
            />
            <Route path="/eventadmin/:event" element={<EventAdminRoutes />} />
            <Route path="/orgadmin/:event" element={<EventAdminRoutes />} />
            <Route
              path="/create-event"
              element={
                <NewEventProvider>
                  <NewEventPage />
                </NewEventProvider>
              }
            />
            <Route path="/admin/organization/:id" element={<OrganizationAdminRoutes />} />
            <Route
              path="/noaccesstocms/:id/:withoutPermissions"
              element={<NoMatchPage />}
            />
          </Route>

          {/** Another routes with context */}
          <Route
            element={
              <RouteContext>
                <Outlet />
              </RouteContext>
            }
          >
            <Route path="/" element={<PageWithFooter />} />
            <Route
              path="/organization/:id"
              element={
                <OrganizationPaymentProvider>
                  <EventOrganization />
                </OrganizationPaymentProvider>
              }
            />
            <Route
              path="/organization/:id/events"
              element={
                <OrganizationPaymentProvider>
                  <EventOrganization />
                </OrganizationPaymentProvider>
              }
            />
            <Route path="/blockedEvent/:event_id" element={<BlockedEvent />} />
            <Route path={'/event/:event_name'} element={<LandingRoutes />} />
            <Route path="/landing/:event_id'" element={<LandingRoutes />} />
          </Route>

          {/** The rest of the routes */}
          <Route element={<NotFoundPage />} />
          <Route
            path="/certificate-generator/:userId/:eventId/:activityId"
            element={<CertificateGeneraterPage />}
          />
          <Route
            path="/meetings/:event_id/acceptmeeting/:meeting_id/id_receiver/:id_receiver"
            element={<AppointmentAccept />}
          />

          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<Faqs />} />

          <Route path="/api/generatorQr/:id" element={<QRedirect />} />
          <Route path="/transition/:event" element={<Transition />} />
          <Route path="/eventfinished" element={<EventFinished />} />

          <Route path="/loginWithCode" element={<LoginWithCode />} />

          <Route path="/direct-login" element={<DirectLoginPage />} />

          <Route path="/social/:event_id" element={<socialZone />} />
          <Route path="/notfound" element={<NotFoundPage />} />
          {screens.xs ? (
            <Route
              path="/myprofile"
              element={<>{redirect('/myprofile/organization')}</>}
            />
          ) : (
            <Route
              path="/myprofile"
              element={
                <PrivateRoute>
                  <MainProfile />
                </PrivateRoute>
              }
            />
          )}
        </Routes>
      </main>
    </Router>
  )
}

function QRedirect() {
  const params = useParams()
  window.location.replace(`${ApiUrl}/api/generatorQr/${params.id}`)
  return <p>Redirecting...</p>
}

const RouteContext: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <GeneralContextProviders>
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderContainer />
      {children}
      <ModalAuth />
      <ModalAuthAnonymous />
      <ModalNoRegister />
      <ModalUpdate />
    </Layout>
  </GeneralContextProviders>
)

const PrivateRoute: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const cUser = useCurrentUser()

  return (
    <GeneralContextProviders>
      <Layout style={{ minHeight: '100vh' }}>
        <HeaderContainer />
        {cUser.value ? (
          <>{children}</>
        ) : cUser.value == null && cUser.status == 'LOADED' ? (
          <>
            <ModalAuth isPrivateRoute />
            <ForbiddenPage />
          </>
        ) : (
          <Spin />
        )}
      </Layout>
    </GeneralContextProviders>
  )
}

const PageWithFooter: FunctionComponent = () => (
  <WithFooter>
    <Home />
  </WithFooter>
)

export default memo(ContentContainer)
