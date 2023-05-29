import { memo } from 'react'
import { Grid, Spin, Layout } from 'antd'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
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
import Organization from '@/pages/eventOrganization/index'
import MainProfile from '@components/profile/main'

import { useCurrentUser } from '@context/userContext'
import loadable from '@loadable/component'
import ModalAuth from '@components/authentication/ModalAuth'
import ModalNoRegister from '@components/authentication/ModalNoRegister'
import BlockedEvent from '@components/events/Landing/BlockedEvent'
import ModalAuthAnonymous from '@components/authentication/ModalAuthAnonymous'
import ModalUpdate from '@components/events/Landing/ModalUpdate'
import DirectLoginPage from '@/pages/DirectLoginPage'
//Code splitting
const Header = loadable(() => import('./header'))
const Home = loadable(() => import('../pages/home'))
const Landing = loadable(() => import('../components/events/Landing/landing'))
const Transition = loadable(() => import('../components/shared/Animate_Img/index'))
const NewEventPage = loadable(() =>
  import('../components/events/createEvent/NewEventPage'),
)
const Terms = loadable(() => import('../components/policies/termsService'))
const Privacy = loadable(() => import('../components/policies/privacyPolicy'))
const Policies = loadable(() => import('../components/policies/policies'))
const About = loadable(() => import('../components/policies/about'))
const Faqs = loadable(() => import('../components/faqs/index'))
const socialZone = loadable(() => import('../components/socialZone/socialZone'))
const AppointmentAccept = loadable(() =>
  import('../components/networking/appointmentAccept'),
)
const NotFoundPage = loadable(() => import('../components/notFoundPage/NotFoundPage'))
const ForbiddenPage = loadable(() => import('../components/forbiddenPage'))
const QueryTesting = loadable(() =>
  import('../components/events/surveys/components/queryTesting'),
)
const EventFinished = loadable(() => import('../components/eventFinished/eventFinished'))
const LoginWithCode = loadable(() => import('../components/AdminUsers/WithCode'))
const NoMatchPage = loadable(() => import('../components/notFoundPage/NoMatchPage'))

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
      <main className="main">
        <Switch>
          <RouteContext
            path={['/landing/:event_id', '/event/:event_name']}
            component={Landing}
          />
          {/*Ruta para ver resumen */}
          <PrivateRoute exact path="/myprofile/:tab" component={MainProfile} />
          {screens.xs ? (
            <Route
              exact
              path="/myprofile"
              render={() => <Redirect to="/myprofile/organization" />}
            />
          ) : (
            <PrivateRoute exact path="/myprofile" component={MainProfile} />
          )}
          <PrivateRoute exact path="/myprofile" component={MainProfile} />

          <Route path="/social/:event_id" component={socialZone} />
          <Route path="/notfound" component={NotFoundPage} />
          <RouteContext path="/blockedEvent/:event_id" component={BlockedEvent} />
          <PrivateRoute path="/create-event/:user?">
            <NewEventProvider>
              <NewEventPage />
            </NewEventProvider>
          </PrivateRoute>
          <PrivateRoute path="/eventadmin/:event" component={EventAdminRoutes} />
          <PrivateRoute path="/orgadmin/:event" component={EventAdminRoutes} />
          <PrivateRoute path="/create-event">
            <NewEventProvider>
              <NewEventPage />
            </NewEventProvider>
          </PrivateRoute>
          <RouteContext
            exact
            path="/organization/:id/events"
            component={EventOrganization}
          />
          <RouteContext exact path="/organization/:id" component={EventOrganization} />
          <PrivateRoute path="/admin/organization/:id" component={Organization} />
          <PrivateRoute
            path="/noaccesstocms/:id/:withoutPermissions"
            component={NoMatchPage}
          />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/policies" component={Policies} />
          <Route path="/about" component={About} />
          <Route path="/faqs" component={Faqs} />
          {/* Ruta para realizar pruebas de consultas a firebase */}
          <Route path="/queryTesting" component={QueryTesting} />
          <Route path="/api/generatorQr/:id" component={QRedirect} />
          <Route exact path="/transition/:event" component={Transition} />
          <Route exact path="/eventfinished" component={EventFinished} />

          <Route path="/loginWithCode" component={LoginWithCode} />

          <Route path="/direct-login" component={DirectLoginPage} />

          <Route
            path="/meetings/:event_id/acceptmeeting/:meeting_id/id_receiver/:id_receiver"
            component={AppointmentAccept}
          />
          <RouteContext exact path="/" component={PageWithFooter} />
          <Route component={NotFoundPage} />
        </Switch>
      </main>
    </Router>
  )
}

function QRedirect({ match }) {
  window.location.replace(`${ApiUrl}/api/generatorQr/${match.params.id}`)
  return <p>Redirecting...</p>
}

const RouteContext = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      <CurrentEventProvider>
        <CurrentUserEventProvider>
          <CurrentUserProvider>
            <AgendaContextProvider>
              <HelperContextProvider>
                <SurveysProvider>
                  <Layout
                    style={{
                      minHeight: '100vh',
                    }}
                  >
                    <Header />
                    <Component {...props} />
                    <ModalAuth />
                    <ModalAuthAnonymous />
                    <ModalNoRegister />
                    <ModalUpdate />
                  </Layout>
                </SurveysProvider>
              </HelperContextProvider>
            </AgendaContextProvider>
          </CurrentUserProvider>
        </CurrentUserEventProvider>
      </CurrentEventProvider>
    )}
  />
)

const PrivateRoute = ({ component: Component, ...rest }) => {
  const cUser = useCurrentUser()
  return (
    <Route
      {...rest}
      render={(props) => (
        <CurrentEventProvider>
          <CurrentUserEventProvider>
            <CurrentUserProvider>
              <HelperContextProvider>
                <AgendaContextProvider>
                  <SurveysProvider>
                    <Layout style={{ minHeight: '100vh' }}>
                      <Header />
                      {cUser.value ? (
                        <Component {...props} />
                      ) : cUser.value == null && cUser.status == 'LOADED' ? (
                        <>
                          <ModalAuth isPrivateRoute />

                          <ForbiddenPage />
                        </>
                      ) : (
                        <Spin />
                      )}
                    </Layout>
                  </SurveysProvider>
                </AgendaContextProvider>
              </HelperContextProvider>
            </CurrentUserProvider>
          </CurrentUserEventProvider>
        </CurrentEventProvider>
      )}
    />
  )
}

const PageWithFooter = () => {
  return (
    <WithFooter>
      <Home />
    </WithFooter>
  )
}

export default memo(ContentContainer)
