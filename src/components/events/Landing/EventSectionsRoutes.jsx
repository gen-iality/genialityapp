import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spin } from 'antd';
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
import Ferias from '../ferias/index';
import VirtualConference from '../virtualConference';
import CertificadoLanding from '../../certificados/cerLanding';
import AgendaActividadDetalle from '../agendaActividadDetalle';
import { setVirtualConference } from '../../../redux/virtualconference/actions';

const EventSectionRoutes = (props) => {
  let { path } = useRouteMatch();
  if (!props.cEvent) return <Spin size='large' tip='Cargando...' />;
  return (
    <>
      {props.viewVirtualconference && <VirtualConference />}

      <Switch>
        <Route exact path={`${path}/`}>
          {/* <VirtualConference /> */}

          <EventHome cEvent={props.cEvent} cUser={props.cUser} cEventUser={props.cEventUser} />
        </Route>

        <Route path={`${path}/documents`}>
          {/* <VirtualConference /> */}
          <DocumentsForm event={props.cEvent} />
        </Route>

        <Route path={`${path}/activity/:activity_id`}>
          <AgendaActividadDetalle
            setVirtualConference={props.setVirtualConference}
            // visible={this.state.visible}
            // onClose={this.onClose}
            // showDrawer={this.showDrawer}
            // matchUrl={this.props.matchUrl}
            // survey={survey}
            // activity={this.props.activity}
            // userEntered={props.cUser}
            // currentActivity={currentActivity}
            image_event={props.cEvent.styles.event_image}
            // gotoActivityList={this.gotoActivityList}
            // toggleConference={toggleConference}
            currentUser={props.cUser}
            // collapsed={this.props.collapsed}
            // toggleCollapsed={this.props.toggleCollapsed}
            // eventUser: Determina si el usuario esta registrado en el evento
            eventUser={props.cEventUser}
            cEvent={props.cEvent}
            cUser={props.cUser}
            // showSection={this.props.showSection}
            // zoomExternoHandleOpen={this.props.zoomExternoHandleOpen}
            // eventSurveys={this.props.eventSurveys}
          />
        </Route>

        <Route path={`${path}/speakers`}>
          {/* <VirtualConference /> */}
          <SpeakersForm eventId={props.cEvent._id} event={props.cEvent} />
        </Route>
        <Route path={`${path}/surveys`}>
          {/* <VirtualConference /> */}
          <SurveyForm event={props.cEvent} />
        </Route>
        <Route path={`${path}/partners`}>
          {/* <VirtualConference /> */}
          <Partners event={props.cEvent} />
        </Route>
        <Route path={`${path}/faqs`}>
          {/* <VirtualConference /> */}
          <FaqsForm event={props.cEvent} />
        </Route>

        <Route path={`${path}/evento`}>
          {/* <VirtualConference /> */}
          <EventHome cEvent={props.cEvent} cUser={props.cUser} cEventUser={props.cEventUser} />
        </Route>

        <Route path={`${path}/wall`}>
          {/* <VirtualConference /> */}
          <WallForm event={props.cEvent} eventId={props.cEvent._id} currentUser={props.cUser} />
        </Route>

        <Route path={`${path}/ferias`}>
          <Ferias event={props.cEvent} />
          {/* <VirtualConference /> */}
        </Route>

        <Route path={`${path}/tickets`}>
          <>
            {/* <VirtualConference /> */}

            <div className='columns is-centered'>
              <TicketsForm
                stages={props.cEvent.event_stages}
                experience={props.cEvent.is_experience}
                fees={props.cEvent.fees}
                tickets={props.cEvent.tickets}
                eventId={props.cEvent._id}
                event={props.cEvent}
                seatsConfig={props.cEvent.seats_configuration}
              />
            </div>
          </>
        </Route>

        <Route path={`${path}/certs`}>
          <>
            {/* <VirtualConference /> */}
            <CertificadoLanding
              event={props.cEvent}
              tickets={props.cEvent.tickets}
              currentUser={props.cUser}
              eventUser={props.cEventUser}
            />
          </>
        </Route>

        <Route path={`${path}/agenda`}>
          <Agenda
            activity={props.currentActivity}
            generalTabs={props.generalTabs}
            currentUser={props.cUser}
            setVirtualConference={props.setVirtualConference}
          />
        </Route>
      </Switch>
    </>
  );
};

const mapStateToProps = (state) => ({
  viewVirtualconference: state.virtualConferenceReducer.view,
});

const mapDispatchToProps = {
  setVirtualConference,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventSectionRoutes);
