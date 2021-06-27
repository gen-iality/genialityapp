import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
/** --------------------
 *  secciones del evento
 * ---------------------*/
import DocumentsForm from '../../documents/front/documentsLanding';
import SpeakersForm from '../speakers';
import SurveyForm from '../surveys';
import FaqsForm from '../../faqsLanding';
import Partners from '../Partners';
import Agenda from '../agendaLanding';
import EventHome from '../eventHome';
import TicketsForm from '../../tickets/formTicket';
import WallForm from '../../wall/index';
import Ferias from '../ferias/index'

const EventSectionRoutes = (props) => {
  let { path } = useRouteMatch();
  if (!props.cEvent) return <h1>Cargando...</h1>;
  return (
    <Switch>
      <Route path={`${path}/documents`}>
        <DocumentsForm event={props.cEvent} />
      </Route>
      <Route path={`${path}/speakers`}>
        <SpeakersForm eventId={props.cEvent._id} event={props.cEvent} />
      </Route>
      <Route path={`${path}/surveys`}>
        <SurveyForm event={props.cEvent} />
      </Route>
      <Route path={`${path}/partners`}>
        <Partners event={props.cEvent} />
      </Route>
      <Route path={`${path}/faqs`}>
        <FaqsForm event={props.cEvent} />
      </Route>

      <Route path={`${path}/evento`}>
        <EventHome cEvent={props.cEvent} cUser={props.cUser} cEventUser={props.cEventUser} />
      </Route>

      <Route path={`${path}/wall`}>
        <WallForm event={props.cEvent} eventId={props.cEvent._id} currentUser={props.cUser} />
      </Route>

      <Route path={`${path}/ferias`} render={() => <Ferias event={props.cEvent} />} />

      <Route path={`${path}/tickets`}>
        <>
          <div className='columns is-centered'>
            <TicketsForm
              stages={props.cEvent.event_stages}
              experience={props.cEvent.is_experience}
              fees={props.cEvent.fees}
              tickets={props.cEvent.tickets}
              eventId={props.cEvent._id}
              event={props.cEvent}
              seatsConfig={props.cEvent.seats_configuration}
              // handleModal={this.handleModal}
              // showSection={this.showSection}
            />
          </div>
        </>
      </Route>

      <Route path={`${path}/agenda`}>
        <Agenda
          // cEvent={props.cEvent}
          // eventId={props.cEvent._id}
          // toggleConference={this.toggleConference}
          // handleOpenRegisterForm={this.handleOpenRegisterForm}
          // handleOpenLogin={this.handleOpenLogin}
          // userRegistered={props.cEventUser}
          // currentUser={props.cUser}
          activity={props.currentActivity}
          // userEntered={props.cUser}
          // activeActivity={this.actualizarCurrentActivity}
          // option={this.state.currentActivity ? this.state.currentActivity.option : 'N/A'}
          // collapsed={this.state.collapsed}
          // toggleCollapsed={this.toggleCollapsed}
          // showSection={this.showSection}
          // zoomExternoHandleOpen={this.zoomExternoHandleOpen}
          // eventUser={props.cUserEvent}
          generalTabs={props.generalTabs}
          // cUser={props.cUser}
          currentUser={props.currentUser}
          // eventSurveys={this.state.eventSurveys}
          // publishedSurveys={this.state.publishedSurveys}
        />
      </Route>
    </Switch>
  );
};
export default EventSectionRoutes;
