import React from 'react';
import { Grid, Spin, Layout, Space } from 'antd';
import { Route, Redirect, withRouter, Switch } from 'react-router-dom';
import Event from '../components/events/event';
import { ApiUrl } from '../helpers/constants';
import WithFooter from '../components/withFooter';

import { CurrentUserEventProvider } from '../Context/eventUserContext';
import { CurrentEventProvider, CurrentEventContext } from '../Context/eventContext';
import { CurrentUserProvider } from '../Context/userContext';
import { ProviderMessageController } from '../Context/MessageService';
import { SurveysProvider } from '../Context/surveysContext';

import { HelperContextProvider } from '../Context/HelperContext';
import EventOrganization from '../components/eventOrganization';
import Organization from '../components/organization';
import { NewEventProvider } from '../Context/newEventContext';
import MainProfile from '../components/profile/main';
import { AgendaContextProvider } from '../Context/AgendaContext';
import { UseCurrentUser } from 'Context/userContext';
import loadable from '@loadable/component';
import ModalAuth from 'components/authentication/ModalAuth';
import ModalNoRegister from 'components/authentication/ModalNoRegister';

//Code splitting
const Header = loadable(() => import('./header'));
const Home = loadable(() => import('../components/home'));
/* const HomeProfile = loadable(() => import('../components/home/profile_old')); */
const Landing = loadable(() => import('../components/events/Landing/landing'));
const Transition = loadable(() => import('../components/shared/Animate_Img/index'));
/* const Events = loadable(() => import('../components/events')); */
const NewEvent = loadable(() => import('../components/events/newEvent'));
/* const MyProfile = loadable(() => import('../components/profile/index_old')); */
/* const Purchase = loadable(() => import('../components/profile/purchase_old')); */
/* const EventEdit = loadable(() => import('../components/profile/events_old')); */
const Terms = loadable(() => import('../components/policies/termsService'));
const Privacy = loadable(() => import('../components/policies/privacyPolicy'));
const Policies = loadable(() => import('../components/policies/policies'));
const About = loadable(() => import('../components/policies/about'));
const Faqs = loadable(() => import('../components/faqs/index'));
/* const Tickets = loadable(() => import('../components/tickets/index_old')); */
const socialZone = loadable(() => import('../components/socialZone/socialZone'));
const AppointmentAccept = loadable(() => import('../components/networking/appointmentAccept'));
const NotFoundPage = loadable(() => import('../components/notFoundPage'));
const ForbiddenPage = loadable(() => import('../components/forbiddenPage'));
const QueryTesting = loadable(() => import('../components/events/surveys/components/queryTesting'));
const EventFinished = loadable(() => import('../components/eventFinished/eventFinished'));
const LoginWithCode = loadable(() => import('../components/AdminUsers/WithCode'));
const NoMatchPage = loadable(() => import('../components/notFoundPage/noMatchPage'));

const { useBreakpoint } = Grid;
const ContentContainer = () => {
  const screens = useBreakpoint();
  return (
    <main className='main'>
      <Switch>
        <RouteContext path={['/landing/:event_id', '/event/:event_name']} component={Landing} />

        {/*Ruta para ver resumen */}
        <PrivateRoute exact path='/myprofile/:tab' component={MainProfile} />

        {screens.xs ? (
          <Route exact path='/myprofile' render={() => <Redirect to='/myprofile/organization' />} />
        ) : (
          <PrivateRoute exact path='/myprofile' component={MainProfile} />
        )}
        <PrivateRoute exact path='/myprofile' component={MainProfile} />

        <Route path='/social/:event_id' component={socialZone} />
        {/* Arreglo temporal de mastercard para que tenga una url bonita, evius aún no soporta esto*/}
        <Route path='/mentoriamastercard' render={() => <Redirect to='/landing/5ef49fd9c6c89039a14c6412' />} />

        <Route path='/meetupsfenalco' render={() => <Redirect to='/landing/5f0622f01ce76d5550058c32' />} />

        <Route path='/evento/tpgamers' render={() => <Redirect to='/landing/5f4e41d5eae9886d464c6bf4' />} />

        <Route path='/notfound' component={NotFoundPage} />
        {/* <WithFooter> */}
        {/* <Route path='/page/:id' component={HomeProfile} /> */}

        <PrivateRoute path='/create-event/:user?'>
          <NewEventProvider>
            <NewEvent />
          </NewEventProvider>
        </PrivateRoute>
        <PrivateRoute path='/eventadmin/:event' component={Event} />
        <PrivateRoute path='/orgadmin/:event' component={Event} />
        <PrivateRoute path='/create-event' component={NewEvent} />
        {/* <PrivateRoute path='/profile/:id' component={MyProfile} /> */}
        <RouteContext exact path='/organization/:id/events' component={EventOrganization} />
        <RouteContext exact path='/organization/:id' component={EventOrganization} />
        <PrivateRoute path='/admin/organization/:id' component={Organization} />
        {/* <PrivateRoute path='/purchase/:id' component={Purchase} /> */}
        {/* <PrivateRoute path='/eventEdit/:id' component={EventEdit} /> */}
        {/* <PrivateRoute path='/tickets/:id' component={Tickets} /> */}
        <PrivateRoute path='/noaccesstocms/:id/:withoutPermissions' component={NoMatchPage} />
        <Route path='/terms' component={Terms} />
        <Route path='/privacy' component={Privacy} />
        <Route path='/policies' component={Policies} />
        <Route path='/about' component={About} />
        <Route path='/faqs' component={Faqs} />
        {/* Ruta para realizar pruebas de consultas a firebase */}
        <Route path='/queryTesting' component={QueryTesting} />
        <Route path='/api/generatorQr/:id' component={QRedirect} />
        <Route exact path='/transition/:event' component={Transition} />
        <Route exact path='/eventfinished' component={EventFinished} />

        {/* <Route exact path='/' component={RedirectPortal} /> */}
        <Route path='/loginWithCode' component={LoginWithCode} />

        <Route
          path='/meetings/:event_id/acceptmeeting/:meeting_id/id_receiver/:id_receiver'
          component={AppointmentAccept}
        />
        <RouteContext exact path='/' component={PageWithFooter} />
        <Route component={NotFoundPage} />
      </Switch>
    </main>
  );
};

function QRedirect({ match }) {
  window.location.replace(`${ApiUrl}/api/generatorQr/${match.params.id}`);
  return <p>Redirecting...</p>;
}

//Función que permite redirigir a portal evius se debe optimizar para mejor rendimiento
function RedirectPortal() {
  return <div>{window.location.assign('http://portal.evius.co/')}</div>;
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
                  <ProviderMessageController>
                    <Layout>
                      <Space direction='vertical' size={65}>
                        <Header />
                        <Component {...props} />
                        <ModalAuth />
                        <ModalNoRegister />
                      </Space>
                    </Layout>
                  </ProviderMessageController>
                </SurveysProvider>
              </HelperContextProvider>
            </AgendaContextProvider>
          </CurrentUserProvider>
        </CurrentUserEventProvider>
      </CurrentEventProvider>
    )}
  />
);

const PrivateRoute = ({ component: Component, ...rest }) => {
  const cUser = UseCurrentUser();
  return (
    <Route
      {...rest}
      render={(props) => (
        <CurrentEventProvider>
          <CurrentUserEventProvider>
            <CurrentUserProvider>
              <HelperContextProvider>
                <SurveysProvider>
                  <AgendaContextProvider>
                    <ProviderMessageController>
                      <Layout>
                        <Space direction='vertical' size={65}>
                          <Header />
                          {cUser.value ? (
                            <Component {...props} />
                          ) : cUser.value == null && cUser.status == 'LOADED' ? (
                            <>
                              <ModalAuth />
                              <ForbiddenPage />
                            </>
                          ) : (
                            <Spin />
                          )}
                        </Space>
                      </Layout>
                    </ProviderMessageController>
                  </AgendaContextProvider>
                </SurveysProvider>
              </HelperContextProvider>
            </CurrentUserProvider>
          </CurrentUserEventProvider>
        </CurrentEventProvider>
      )}
    />
  );
};

const RouteContextChildren = ({ children: children, ...rest }) => (
  <Route {...rest}>
    <CurrentEventProvider>
      <CurrentUserEventProvider>
        <CurrentUserProvider>
          <AgendaContextProvider>
            <HelperContextProvider>
              <SurveysProvider>{children}</SurveysProvider>
            </HelperContextProvider>
          </AgendaContextProvider>
        </CurrentUserProvider>
      </CurrentUserEventProvider>
    </CurrentEventProvider>
  </Route>
);

const PageWithFooter = () => {
  return (
    <WithFooter>
      <Home />
    </WithFooter>
  );
};

export default React.memo(ContentContainer);
