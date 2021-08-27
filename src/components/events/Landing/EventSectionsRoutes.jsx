import React, { useEffect, useContext } from 'react';
import { Redirect, Route, Switch, useRouteMatch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

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
import VirtualConferenceBig from '../virtualConferenceBig';
import CertificadoLanding from '../../certificados/cerLanding';
import AgendaActividadDetalle from '../agendaActividadDetalle';
import { setVirtualConference } from '../../../redux/virtualconference/actions';
import { setSpaceNetworking } from '../../../redux/networking/actions';
import MyAgendaIndepend from '../../networking/myAgendaIndepend';
import NetworkingForm from '../../networking';
import InformativeSection2 from '../informativeSections/informativeSection2';
import InformativeSection from '../informativeSections/informativeSection';
import Noticias from '../noticias';
import withContext from '../../../Context/withContext';
import PageNotPermissions from './PageNotPermissions';
import Productos from '../producto/index';
import MessageRegister from '../registrationForm/messageRegister';
import { setSectionPermissions } from '../../../redux/sectionPermissions/actions';
import ListVideoCard from '../../shared/listVideoCard';
import initUserPresence from '../../../containers/userPresenceInEvent';
import { HelperContext } from '../../../Context/HelperContext';
import Videos from '../videos';

const EventSectionRoutes = (props) => {
  let { path } = useRouteMatch();
  let { eventPrivate } = useContext(HelperContext);

  function ValidateViewPermissions(route, nombresection) {
    let routePermissions =
      props.cEvent.value && Object.values(props.cEvent.value.itemsMenu).filter((item) => item.section === route);
    if (
      routePermissions.length > 0 &&
      routePermissions[0].permissions === 'assistants' &&
      props.cEventUser.value == null
    ) {
      props.setSectionPermissions({ view: true, section: nombresection });
      return true;
    } else if (
      routePermissions.length > 0 &&
      routePermissions[0].permissions === 'public' &&
      props.cEventUser.value == null &&
      eventPrivate.private
    ) {
      // console.log('====================================');
      // console.log("la agenda es publica y el evento es privado");
      // console.log('====================================');
      props.setSectionPermissions({ view: true, section: nombresection });
      return true;
    } else if (
      routePermissions.length > 0 &&
      routePermissions[0].permissions === 'public' &&
      props.cEventUser.value == null &&
      !eventPrivate.private
    ) {
      // console.log('====================================');
      // console.log("la agenda es publica y el evento NO es privado");
      // console.log('====================================');
      return false;
    }
  }

  useEffect(async () => {
    props.cEvent.value && (await initUserPresence(props.cEvent.value._id));
  }, [props.cEvent.value]);

  return (
    <>
      {props.viewVirtualconference && (
        <>
          <VirtualConferenceBig />
          <ListVideoCard idevent={props.cEvent.value} />
         
        </>
      )}

      <Switch>
        <Route exact path={`${path}/`}>
          <Redirect to={`/landing/${props.cEvent.value._id}/${eventPrivate.section}`} />
        </Route>

        <Route path={`${path}/documents`}>
          {() =>
            ValidateViewPermissions('documents', 'Documentos') ? (
              <>
                <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
              </>
            ) : (
              <DocumentsForm />
            )
          }
        </Route>

        <Route path={`${path}/interviews`}>
          {() =>
            ValidateViewPermissions('interviews', 'interviews') ? (
              <>
                <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
              </>
            ) : (
              <MyAgendaIndepend />
            )
          }
        </Route>

        <Route path={`${path}/networking`}>
          {() =>
            ValidateViewPermissions('networking', 'Networking') ? (
              <>
                <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
              </>
            ) : (
              <NetworkingForm />
            )
          }
        </Route>

        <Route path={`${path}/informativeSection1`}>
          {() =>
            ValidateViewPermissions('informativeSection1', 'informativeSection1') ? (
              <>
                <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
              </>
            ) : (
              <InformativeSection2 />
            )
          }
        </Route>

        <Route path={`${path}/informativeSection`}>
          {() =>
            ValidateViewPermissions('informativeSection', 'informativeSection') ? (
              <>
                <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
              </>
            ) : (
              <InformativeSection />
            )
          }
        </Route>

        <Route path={`${path}/activity/:activity_id`}>
          {() =>
            ValidateViewPermissions('agenda', 'Agenda') ? (
              <>
                <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
              </>
            ) : (
              <AgendaActividadDetalle setVirtualConference={props.setVirtualConference} />
            )
          }
        </Route>

        <Route path={`${path}/speakers`}>
          {() =>
            ValidateViewPermissions('speakers', 'Conferencistas') ? (
              <>
                <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
              </>
            ) : (
              <SpeakersForm />
            )
          }
        </Route>
        <Route path={`${path}/surveys`}>
          {() =>
            ValidateViewPermissions('surveys', 'Encuestas') ? (
              <>
                <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
              </>
            ) : (
              <SurveyForm />
            )
          }
        </Route>
        <Route path={`${path}/partners`}>
        {() =>
            ValidateViewPermissions('partners', 'partners') ? (
              <>
                <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
              </>
            ) : (
              <Partners />
            )
          }

        
        </Route>
        <Route path={`${path}/faqs`}>
          {() =>
            ValidateViewPermissions('faqs', 'faqs') ? (
              <>
                <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
              </>
            ) : (
              <FaqsForm />
            )
          }
        </Route>

        <Route path={`${path}/evento`}>
          {() =>
            ValidateViewPermissions('evento', 'Evento') ? (
              <>
                <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
              </>
            ) : (
              <EventHome />
            )
          }
        </Route>

        <Route path={`${path}/wall`}>
          {() =>
            ValidateViewPermissions('wall', 'Muro') ? (
              <>
                <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
              </>
            ) : (
              <WallForm />
            )
          }
        </Route>
        <Route path={`${path}/videos`}>
          {() =>
            ValidateViewPermissions('videos', 'Videos') ? (
              <>
                <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
              </>
            ) : (
              <Videos />
            )
          }
        </Route>

        <Route path={`${path}/ferias`}>
          {() =>
            ValidateViewPermissions('ferias', 'Ferias') ? (
              <>
                <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
              </>
            ) : (
              <Ferias />
            )
          }
        </Route>
        <Route path={`${path}/noticias`}>
          {() =>
            ValidateViewPermissions('noticias', 'Noticias') ? (
              <>
                <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
              </>
            ) : (
              <Noticias />
            )
          }
        </Route>
        <Route path={`${path}/tickets`}>
          {() =>
            ValidateViewPermissions('tickets', 'Registro') ? (
              <>
                <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
              </>
            ) : (
              <div className='columns is-centered'>
                <TicketsForm />
              </div>
            )
          }
        </Route>

        <Route path={`${path}/certs`}>
          {() =>
            ValidateViewPermissions('certs', 'certs') ? (
              <>
                <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
              </>
            ) : (
              <CertificadoLanding />
            )
          }
        </Route>
        <Route path={`${path}/producto`}>
          {() =>
            ValidateViewPermissions('producto', 'Galería') ? (
              <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
            ) : (
              <Productos />
            )
          }
        </Route>
        <Route path={`${path}/agenda`}>
          {() =>
            ValidateViewPermissions('agenda', 'Agenda') ? (
              <>
                <Redirect to={`/landing/${props.cEvent.value._id}/permissions`} />
              </>
            ) : (
              <Agenda
                activity={props.currentActivity}
                generalTabs={props.generalTabs}
                setVirtualConference={props.setVirtualConference}
              />
            )
          }
        </Route>
        <Route path={`${path}/permissions`}>
          <PageNotPermissions />
        </Route>
        <Route path={`${path}/success/:type?`}>
          <MessageRegister />
        </Route>
      </Switch>
    </>
  );
};

const mapStateToProps = (state) => ({
  viewVirtualconference: state.virtualConferenceReducer.view,
  viewSocialZoneNetworking: state.spaceNetworkingReducer.view,
  sectionPermissions: state.viewSectionPermissions.view,
});

const mapDispatchToProps = {
  setVirtualConference,
  setSpaceNetworking,
  setSectionPermissions,
};

let eventSectionsContext = withRouter(withContext(EventSectionRoutes));
export default connect(mapStateToProps, mapDispatchToProps)(eventSectionsContext);
