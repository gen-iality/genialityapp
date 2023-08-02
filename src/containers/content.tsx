import { FunctionComponent, PropsWithChildren, memo } from 'react'
import { Grid, Spin, Layout } from 'antd'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  RouteProps,
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
import OrganizationLandingRoutes from '@/pages/eventOrganization/OrganizationLandingRoutes'
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
        <Switch>
          {/** Private routes */}
          <PrivateRoute
            exact
            path="/myprofile"
            render={(routeProps) => <MainProfile {...routeProps} />}
          />
          {/*Ruta para ver resumen */}
          <PrivateRoute
            exact
            path="/myprofile/:tab"
            render={(routeProps) => <MainProfile {...routeProps} />}
          />
          <PrivateRoute
            path="/create-event/:user?"
            render={() => (
              <NewEventProvider>
                <NewEventPage />
              </NewEventProvider>
            )}
          />
          <PrivateRoute
            path="/eventadmin/:event"
            render={(routeProps) => <EventAdminRoutes {...routeProps} />}
          />
          <PrivateRoute
            path="/orgadmin/:event"
            render={(routeProps) => <EventAdminRoutes {...routeProps} />}
          />
          <PrivateRoute
            path="/create-event"
            render={(routeProps) => (
              <NewEventProvider>
                <NewEventPage />
              </NewEventProvider>
            )}
          />
          <PrivateRoute
            path="/admin/organization/:id"
            render={() => <OrganizationLandingRoutes />}
          />
          <PrivateRoute
            path="/noaccesstocms/:id/:withoutPermissions"
            render={() => <NoMatchPage />}
          />

          {/** Another routes with context */}
          <RouteContext exact path="/" render={() => <PageWithFooter />} />
          <RouteContext
            exact
            path="/organization/:id"
            render={() => (
              <OrganizationPaymentProvider>
                <EventOrganization />
              </OrganizationPaymentProvider>
            )}
          />
          <RouteContext
            exact
            path="/organization/:id/events"
            render={() => (
              <OrganizationPaymentProvider>
                <EventOrganization />
              </OrganizationPaymentProvider>
            )}
          />
          <RouteContext
            path="/blockedEvent/:event_id"
            render={(routeProps) => <BlockedEvent {...routeProps} />}
          />
          <RouteContext
            path={['/landing/:event_id', '/event/:event_name']}
            render={(routeProps) => <LandingRoutes {...routeProps} />}
          />

          {/** The rest of the routes */}
          <Route component={NotFoundPage} />
          <Route
            exact
            path="/certificate-generator/:userId/:eventId/:activityId"
            render={() => <CertificateGeneraterPage />}
          />
          <Route
            path="/meetings/:event_id/acceptmeeting/:meeting_id/id_receiver/:id_receiver"
            component={AppointmentAccept}
          />

          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/policies" component={Policies} />
          <Route path="/about" component={About} />
          <Route path="/faqs" component={Faqs} />

          <Route path="/api/generatorQr/:id" component={QRedirect} />
          <Route exact path="/transition/:event" component={Transition} />
          <Route exact path="/eventfinished" component={EventFinished} />

          <Route path="/loginWithCode" component={LoginWithCode} />

          <Route path="/direct-login" component={DirectLoginPage} />

          <Route path="/social/:event_id" component={socialZone} />
          <Route path="/notfound" component={NotFoundPage} />
          {screens.xs ? (
            <Route
              exact
              path="/myprofile"
              render={() => <Redirect to="/myprofile/organization" />}
            />
          ) : (
            <PrivateRoute
              exact
              path="/myprofile"
              render={(routeProps) => <MainProfile {...routeProps} />}
            />
          )}
        </Switch>
      </main>
    </Router>
  )
}

function QRedirect({ match }) {
  window.location.replace(`${ApiUrl}/api/generatorQr/${match.params.id}`)
  return <p>Redirecting...</p>
}

const RouteContext: FunctionComponent<RouteProps> = ({ render, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      <GeneralContextProviders>
        <Layout style={{ minHeight: '100vh' }}>
          <HeaderContainer />
          {render && render(props)}
          <ModalAuth />
          <ModalAuthAnonymous />
          <ModalNoRegister />
          <ModalUpdate />
        </Layout>
      </GeneralContextProviders>
    )}
  />
)

const PrivateRoute: FunctionComponent<RouteProps> = ({ render, ...rest }) => {
  const cUser = useCurrentUser()

  return (
    <Route
      {...rest}
      render={(props) => (
        <GeneralContextProviders>
          <Layout style={{ minHeight: '100vh' }}>
            <HeaderContainer />
            {cUser.value ? (
              <>{render && render(props)}</>
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
      )}
    />
  )
}

const PageWithFooter: FunctionComponent = () => (
  <WithFooter>
    <Home />
  </WithFooter>
)

export default memo(ContentContainer)
