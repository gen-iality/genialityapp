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
import MyAgendaIndepend from '../../networking/myAgendaIndepend';
import NetworkingForm from '../../networking';
import InformativeSection2 from '../informativeSections/informativeSection2';
import InformativeSection from '../informativeSections/informativeSection';

const EventSectionRoutes = (props) => {
  let { path } = useRouteMatch();
  if (!props.cEvent) return <Spin size='large' tip='Cargando...' />;

  return (
    <>
      {props.viewVirtualconference && <VirtualConference />}

      <Switch>
        <Route exact path={`${path}/`}>
          <EventHome />
        </Route>

        <Route path={`${path}/documents`}>
          <DocumentsForm />
        </Route>

        <Route path={`${path}/interviews`}>
          <MyAgendaIndepend />
        </Route>

        <Route path={`${path}/networking`}>
          <NetworkingForm />
        </Route>

        <Route path={`${path}/informativeSection1`}>
          <InformativeSection2 />
        </Route>

        <Route path={`${path}/informativeSection`}>
          <InformativeSection />
        </Route>

        <Route path={`${path}/activity/:activity_id`}>
          <AgendaActividadDetalle
            setVirtualConference={props.setVirtualConference}
            image_event={props.cEvent.styles.event_image}
            currentUser={props.cUser}
            eventUser={props.cEventUser}
            cEvent={props.cEvent}
            cUser={props.cUser}
           
          />
        </Route>

        <Route path={`${path}/speakers`}>
          <SpeakersForm eventId={props.cEvent._id} event={props.cEvent} />
        </Route>
        <Route path={`${path}/surveys`}>
          <SurveyForm event={props.cEvent} />
        </Route>
        <Route path={`${path}/partners`}>
          <Partners />
        </Route>
        <Route path={`${path}/faqs`}>
          <FaqsForm event={props.cEvent} />
        </Route>

        <Route path={`${path}/evento`}>
          <EventHome />
        </Route>

        <Route path={`${path}/wall`}>
          <WallForm event={props.cEvent} eventId={props.cEvent._id} currentUser={props.cUser} />
        </Route>

        <Route path={`${path}/ferias`}>
          <Ferias event={props.cEvent} />
        </Route>

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
              />
            </div>
          </>
        </Route>

        <Route path={`${path}/certs`}>
          <>
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
