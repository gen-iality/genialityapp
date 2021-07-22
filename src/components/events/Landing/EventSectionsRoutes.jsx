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
import Noticias from '../noticias';

const EventSectionRoutes = (props) => {
  let { path } = useRouteMatch();

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
          <AgendaActividadDetalle setVirtualConference={props.setVirtualConference} />
        </Route>

        <Route path={`${path}/speakers`}>
          <SpeakersForm />
        </Route>
        <Route path={`${path}/surveys`}>
          <SurveyForm  />
        </Route>
        <Route path={`${path}/partners`}>
          <Partners />
        </Route>
        <Route path={`${path}/faqs`}>
          <FaqsForm />
        </Route>

        <Route path={`${path}/evento`}>
          <EventHome />
        </Route>

        <Route path={`${path}/wall`}>
          <WallForm />
        </Route>

        <Route path={`${path}/ferias`}>
          <Ferias />
        </Route>
        <Route path={`${path}/noticias`}>
          <Noticias />
        </Route>
        <Route path={`${path}/tickets`}>
          <>
            <div className='columns is-centered'>
              <TicketsForm />
            </div>
          </>
        </Route>

        <Route path={`${path}/certs`}>
          <>
            <CertificadoLanding />
          </>
        </Route>

        <Route path={`${path}/agenda`}>
          <Agenda
            activity={props.currentActivity}
            generalTabs={props.generalTabs}
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
