import React from 'react';
import { Route, Redirect, withRouter, Switch } from 'react-router-dom';
import Event from '../components/events/event';
import * as Cookie from 'js-cookie';
import { ApiUrl } from '../helpers/constants';
import asyncComponent from './AsyncComponent';
import WithFooter from '../components/withFooter';

import { CurrentUserEventProvider } from '../Context/eventUserContext';
import { CurrentEventProvider, CurrentEventContext } from '../Context/eventContext';
import { CurrentUserProvider } from '../Context/userContext';
import { SurveysProvider } from '../Context/surveysContext';

import { HelperContextProvider } from '../Context/HelperContext';
import EventOrganization from '../components/eventOrganization';
import Organization from '../components/organization';
import { NewEventProvider } from '../Context/newEventContext';
import MainProfile from '../components/profile/main';

//Code splitting
const Home = asyncComponent(() => import('../components/home'));
const HomeProfile = asyncComponent(() => import('../components/home/profile'));
const Landing = asyncComponent(() => import('../components/events/Landing/landing'));
const Transition = asyncComponent(() => import('../components/shared/Animate_Img/index'));
const Events = asyncComponent(() => import('../components/events'));
const NewEvent = asyncComponent(() => import('../components/events/newEvent'));
const MyProfile = asyncComponent(() => import('../components/profile'));
const Purchase = asyncComponent(() => import('../components/profile/purchase'));
const EventEdit = asyncComponent(() => import('../components/profile/events'));
const Terms = asyncComponent(() => import('../components/policies/termsService'));
const Privacy = asyncComponent(() => import('../components/policies/privacyPolicy'));
const Policies = asyncComponent(() => import('../components/policies/policies'));
const About = asyncComponent(() => import('../components/policies/about'));
const Faqs = asyncComponent(() => import('../components/faqs/index'));
const Tickets = asyncComponent(() => import('../components/tickets'));
const socialZone = asyncComponent(() => import('../components/socialZone/socialZone'));
const AppointmentAccept = asyncComponent(() => import('../components/networking/appointmentAccept'));
const NotFoundPage = asyncComponent(() => import('../components/notFoundPage'));
const ForbiddenPage = asyncComponent(() => import('../components/forbiddenPage'));
const QueryTesting = asyncComponent(() => import('../components/events/surveys/components/queryTesting'));
const EventFinished = asyncComponent(() => import('../components/eventFinished/eventFinished'));

const ContentContainer = () => {
  return (
    <main className='main'>
      <Switch>
        <RouteContext path='/landing/:event_id' component={Landing} />

        <RouteContext path='/event/:event_name' component={Landing} />

        {/*Ruta para ver resumen */}
        <PrivateRoute exact path='/myprofile/:tab' component={MainProfile} />
        <PrivateRoute exact path='/myprofile' component={MainProfile} />

        <Route path='/social/:event_id' component={socialZone} />
        {/* Arreglo temporal de mastercard para que tenga una url bonita, evius aún no soporta esto*/}
        <Route path='/mentoriamastercard' render={() => <Redirect to='/landing/5ef49fd9c6c89039a14c6412' />} />

        <Route path='/meetupsfenalco' render={() => <Redirect to='/landing/5f0622f01ce76d5550058c32' />} />

        <Route path='/evento/tpgamers' render={() => <Redirect to='/landing/5f4e41d5eae9886d464c6bf4' />} />

        <Route path='/notfound' component={NotFoundPage} />
        {/* <WithFooter> */}
        <Route path='/page/:id' component={HomeProfile} />
        <PrivateRoute path='/my_events' component={Events} />
        <PrivateRoute path='/orgadmin/:event' component={Event} />
        <PrivateRoute path='/create-event/:user?'>
          <NewEventProvider>
            <NewEvent />
          </NewEventProvider>
        </PrivateRoute>

        <PrivateRoute path='/eventadmin/:event' component={Event}/>
        <PrivateRoute path='/orgadmin/:event' component={Event} />
        <PrivateRoute path='/create-event' component={NewEvent} />
        <PrivateRoute path='/profile/:id' component={MyProfile} />
        <RouteContext exact path='/organization/:id/events' component={EventOrganization} />
        <RouteContext exact path='/organization/:id'        component={EventOrganization} />
        <PrivateRoute path='/admin/organization/:id' component={Organization} />
        <PrivateRoute path='/purchase/:id' component={Purchase} />
        <PrivateRoute path='/eventEdit/:id' component={EventEdit} />
        <PrivateRoute path='/tickets/:id' component={Tickets} />
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
        <Route exact path='/' component={RedirectPortal} />

        <Route
          path='/meetings/:event_id/acceptmeeting/:meeting_id/id_receiver/:id_receiver'
          component={AppointmentAccept}
        />
        <Route
          exact
          path='/events'
          render={() => (
            <WithFooter>
              <Home />
            </WithFooter>
          )}
        />
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
            <HelperContextProvider>
              <SurveysProvider>
                <Component {...props} />
              </SurveysProvider>
            </HelperContextProvider>
          </CurrentUserProvider>
        </CurrentUserEventProvider>
      </CurrentEventProvider>
    )}
  />
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      <CurrentEventProvider>
        <CurrentUserEventProvider>
          <CurrentUserProvider>
            <HelperContextProvider>
              <SurveysProvider>
                {Cookie.get('evius_token') ? <Component {...props} />: <ForbiddenPage />}
                
              </SurveysProvider>
            </HelperContextProvider>
          </CurrentUserProvider>
        </CurrentUserEventProvider>
      </CurrentEventProvider>
    )}
  />
);

export default React.memo(ContentContainer);
