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

const EventSectionRoutes = (props) => {
  let { path } = useRouteMatch();
  if (!props.cEvent) return <h1>Cargando...</h1>;
  return (
    <Switch>
      <Route path={`${path}/documents`}>
        <DocumentsForm event={event} />
      </Route>
      <Route path={`${path}/speakers`}>
        <SpeakersForm event={event} />
      </Route>
      <Route path={`${path}/surveys`}>
        <SurveyForm event={event} />
      </Route>
      <Route path={`${path}/partners`}>
        <Partners event={event} />
      </Route>
      <Route path={`${path}/faqs`}>
        <FaqsForm event={event} />
      </Route>

      <Route path={`${path}/evento`}>
        <h1>EVENTO</h1>
        {/* <CertificadoLanding event={event} /> */}
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
